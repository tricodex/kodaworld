import os
import aiohttp
import asyncio
import logging
import json
from typing import List, Dict, Any, Optional, Union
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from openai import OpenAI
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Add a new constant for development mode
DEV_MODE = True  # Set this to False when deploying

def log_conversation(api_name: str, action: str, data: Any):
    if DEV_MODE:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"{timestamp} - {api_name} - {action}:\n{json.dumps(data, indent=2)}\n\n"
        with open("conversation.log", "a") as log_file:
            log_file.write(log_entry)


class AI71API:
    """
    AI71API is a class that provides an interface to interact with the AI71 API.

    Args:
        api_key (Optional[str]): The API key to authenticate the requests. If not provided, it will be fetched from the environment variable 'AI71_API_KEY'.
        base_url (str): The base URL of the AI71 API. Defaults to "https://api.ai71.ai/v1".

    Attributes:
        api_key (str): The API key used for authentication.
        base_url (str): The base URL of the AI71 API.
        headers (dict): The headers to be included in the API requests.
        memory (ConversationBufferMemory): The memory object to store conversation history.

    """
    def __init__(self, api_key: Optional[str] = None, base_url: str = "https://api.ai71.ai/v1"):
        self.api_key = api_key or os.getenv('AI71_API_KEY')
        if not self.api_key:
            raise ValueError("AI71_API_KEY not found. Please set it as an environment variable.")
        
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.memory = ConversationBufferMemory(return_messages=True)

    async def _make_request(self, endpoint: str, payload: Dict[str, Any], stream: bool = False, max_retries: int = 3) -> Union[Dict[str, Any], aiohttp.ClientResponse]:
        url = f"{self.base_url}/{endpoint}"
        log_conversation("AI71API", f"Request to {endpoint}", payload)
        for attempt in range(max_retries):
            try:
                async with aiohttp.ClientSession(headers=self.headers) as session:
                    async with session.post(url, json=payload) as response:
                        response.raise_for_status()
                        if stream:
                            return response
                        else:
                            json_response = await response.json()
                            log_conversation("AI71API", f"Response from {endpoint}", json_response)
                            return json_response
            except aiohttp.ClientError as e:
                logger.error(f"Attempt {attempt + 1} failed: Error making request to {endpoint}: {str(e)}")
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(2 ** attempt)  # Exponential backoff

    async def chat_completion(self, messages: List[Dict[str, str]], model: str = "falcon-11b", **kwargs) -> Dict[str, Any]:
        payload = {
            "model": model,
            "messages": messages,
            **kwargs
        }
        response = await self._make_request("chat/completions", payload)
        await self._update_memory(messages, response['choices'][0]['message']['content'])
        return response

    async def stream_chat_completion(self, messages: List[Dict[str, str]], model: str = "falcon-11b", **kwargs):
        payload = {
            "model": model,
            "messages": messages,
            "stream": True,
            **kwargs
        }
        response = await self._make_request("chat/completions", payload, stream=True)
        full_response = ""
        async for line in response.content:
            if line:
                chunk = json.loads(line.decode('utf-8').split('data: ')[1])
                full_response += chunk['choices'][0]['delta'].get('content', '')
                yield chunk
        log_conversation("AI71API", "Stream Chat Completion Full Response", full_response)
        await self._update_memory(messages, full_response)

    async def _update_memory(self, messages: List[Dict[str, str]], response: str):
        for message in messages:
            if message['role'] == 'user':
                self.memory.chat_memory.add_user_message(message['content'])
            elif message['role'] == 'system':
                self.memory.chat_memory.add_message(SystemMessage(content=message['content']))
        self.memory.chat_memory.add_ai_message(response)

    def get_conversation_history(self) -> List[Union[HumanMessage, AIMessage, SystemMessage]]:
        return self.memory.chat_memory.messages

    async def clear_memory(self):
        self.memory.clear()

    async def generate_with_memory(self, user_input: str, model: str = "falcon-180b", messages: List[Dict[str, str]] = None, **kwargs) -> str:
        if messages is None:
            messages = self.get_conversation_history()
            messages.append(HumanMessage(content=user_input))
            messages = [{"role": m.type, "content": m.content} for m in messages]
        else:
            messages.append({"role": "user", "content": user_input})
        
        response = await self.chat_completion(messages, model=model, **kwargs)
        return response['choices'][0]['message']['content']

    def add_system_message(self, content: str):
        self.memory.chat_memory.add_message(SystemMessage(content=content))

    def add_user_message(self, content: str):
        self.memory.chat_memory.add_user_message(content)

    def add_ai_message(self, content: str):
        self.memory.chat_memory.add_ai_message(content)

class OpenAIAPI:
    """
    A class that provides an interface to interact with the OpenAI API.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found. Please set it as an environment variable or provide it when initializing the class.")
        
        self.client = OpenAI(api_key=self.api_key)
        self.memory = ConversationBufferMemory(return_messages=True)

    # Rest of the class methods...
class OpenAIAPI:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found. Please set it as an environment variable or provide it when initializing the class.")
        
        self.client = OpenAI(api_key=self.api_key)
        self.memory = ConversationBufferMemory(return_messages=True)

    def chat_completion(self, messages: List[Dict[str, str]], model: str = "gpt-4o-mini", **kwargs) -> Dict[str, Any]:
        log_conversation("OpenAIAPI", "Chat Completion Request", {"messages": messages, "model": model, **kwargs})
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            **kwargs
        )
        log_conversation("OpenAIAPI", "Chat Completion Response", response)
        self._update_memory(messages, response.choices[0].message.content)
        return response

    def stream_chat_completion(self, messages: List[Dict[str, str]], model: str = "gpt-4o-mini", **kwargs):
        log_conversation("OpenAIAPI", "Stream Chat Completion Request", {"messages": messages, "model": model, **kwargs})
        stream = self.client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True,
            **kwargs
        )
        full_response = ""
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                full_response += content
                yield chunk
        log_conversation("OpenAIAPI", "Stream Chat Completion Full Response", full_response)
        self._update_memory(messages, full_response)

    def create_image(self, prompt: str, model: str = "dall-e-3", size: str = "1024x1024", quality: str = "standard", n: int = 1) -> Dict[str, Any]:
        log_conversation("OpenAIAPI", "Create Image Request", {"prompt": prompt, "model": model, "size": size, "quality": quality, "n": n})
        response = self.client.images.generate(
            model=model,
            prompt=prompt,
            size=size,
            quality=quality,
            n=n
        )
        log_conversation("OpenAIAPI", "Create Image Response", response)
        return response

    def _update_memory(self, messages: List[Dict[str, str]], response: str):
        for message in messages:
            if message['role'] == 'user':
                self.memory.chat_memory.add_user_message(message['content'])
            elif message['role'] == 'system':
                self.memory.chat_memory.add_message(SystemMessage(content=message['content']))
        self.memory.chat_memory.add_ai_message(response)

    def get_conversation_history(self) -> List[Union[HumanMessage, AIMessage, SystemMessage]]:
        return self.memory.chat_memory.messages

    def clear_memory(self):
        self.memory.clear()

    def generate_with_memory(self, user_input: str, model: str = "gpt-4o-mini", messages: List[Dict[str, str]] = None, **kwargs) -> str:
        if messages is None:
            messages = self.get_conversation_history()
            messages.append(HumanMessage(content=user_input))
            messages = [{"role": m.type, "content": m.content} for m in messages]
        else:
            messages.append({"role": "user", "content": user_input})
        
        response = self.chat_completion(messages, model=model, **kwargs)
        return response.choices[0].message.content

    def add_system_message(self, content: str):
        self.memory.chat_memory.add_message(SystemMessage(content=content))

    def add_user_message(self, content: str):
        self.memory.chat_memory.add_user_message(content)

    def add_ai_message(self, content: str):
        self.memory.chat_memory.add_ai_message(content)