# ai71/api.py

import os
import aiohttp
import asyncio
import logging
import json
from typing import List, Dict, Any, Optional, Union
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from openai import OpenAI


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AI71API:
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
        for attempt in range(max_retries):
            try:
                async with aiohttp.ClientSession(headers=self.headers) as session:
                    async with session.post(url, json=payload) as response:
                        response.raise_for_status()
                        if stream:
                            return response
                        else:
                            return await response.json()
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
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found. Please set it as an environment variable or provide it when initializing the class.")
        
        self.client = OpenAI(api_key=self.api_key)
        self.memory = ConversationBufferMemory(return_messages=True)

    def chat_completion(self, messages: List[Dict[str, str]], model: str = "gpt-4o-mini", **kwargs) -> Dict[str, Any]:
        """
        Create a chat completion using the OpenAI API.

        :param messages: A list of message dictionaries.
        :param model: The model to use for completion. Defaults to "gpt-4o-mini".
        :param kwargs: Additional parameters to pass to the API call.
        :return: The API response as a dictionary.
        """
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            **kwargs
        )
        self._update_memory(messages, response.choices[0].message.content)
        return response

    def stream_chat_completion(self, messages: List[Dict[str, str]], model: str = "gpt-4o-mini", **kwargs):
        """
        Create a streaming chat completion using the OpenAI API.

        :param messages: A list of message dictionaries.
        :param model: The model to use for completion. Defaults to "gpt-4o-mini".
        :param kwargs: Additional parameters to pass to the API call.
        :return: A generator yielding response chunks.
        """
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
        self._update_memory(messages, full_response)

    def create_image(self, prompt: str, model: str = "dall-e-3", size: str = "1024x1024", quality: str = "standard", n: int = 1) -> Dict[str, Any]:
        """
        Create an image using DALL-E 3.
        
        :param prompt: A text description of the desired image(s).
        :param model: The model to use for image generation. Defaults to "dall-e-3".
        :param size: The size of the generated images. Must be one of 1024x1024, 1792x1024, or 1024x1792 for dall-e-3.
        :param quality: The quality of the image that will be generated. Must be one of "standard" or "hd".
        :param n: The number of images to generate. Must be between 1 and 10. For dall-e-3, only n=1 is supported.
        :return: The API response as a dictionary.
        """
        response = self.client.images.generate(
            model=model,
            prompt=prompt,
            size=size,
            quality=quality,
            n=n
        )
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