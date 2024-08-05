import os
import requests
import logging
import time
from typing import List, Dict, Any, Optional, Union, Generator
import json
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, SystemMessage, AIMessage

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AI71API:
    def __init__(self, api_key: Optional[str] = None, base_url: str = "https://api.ai71.ai/v1"):
        self.api_key = api_key or os.getenv('AI71_API_KEY')
        if not self.api_key:
            raise ValueError("AI71_API_KEY not found. Please set it as an environment variable.")
        
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        })
        self.memory = ConversationBufferMemory(return_messages=True)

    def _make_request(self, endpoint: str, payload: Dict[str, Any], stream: bool = False, max_retries: int = 3) -> Union[Dict[str, Any], requests.Response]:
        url = f"{self.base_url}/{endpoint}"
        for attempt in range(max_retries):
            try:
                response = self.session.post(url, json=payload, stream=stream)
                response.raise_for_status()
                return response if stream else response.json()
            except requests.RequestException as e:
                logger.error(f"Attempt {attempt + 1} failed: Error making request to {endpoint}: {str(e)}")
                if attempt == max_retries - 1:
                    raise
                time.sleep(2 ** attempt)  # Exponential backoff

    def chat_completion(self, messages: List[Dict[str, str]], model: str = "falcon-11b", **kwargs) -> Dict[str, Any]: #180b or 11b
        payload = {
            "model": model,
            "messages": messages,
            **kwargs
        }
        response = self._make_request("chat/completions", payload)
        self._update_memory(messages, response['choices'][0]['message']['content'])
        return response

    def stream_chat_completion(self, messages: List[Dict[str, str]], model: str = "falcon-11b   ", **kwargs) -> Generator[Dict[str, Any], None, None]: #180b or 11b
        payload = {
            "model": model,
            "messages": messages,
            "stream": True,
            **kwargs
        }
        response = self._make_request("chat/completions", payload, stream=True)
        full_response = ""
        for line in response.iter_lines():
            if line:
                chunk = json.loads(line.decode('utf-8').split('data: ')[1])
                full_response += chunk['choices'][0]['delta'].get('content', '')
                yield chunk
        self._update_memory(messages, full_response)

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

    def generate_with_memory(self, user_input: str, model: str = "falcon-180b", messages: List[Dict[str, str]] = None, **kwargs) -> str:
        if messages is None:
            messages = self.get_conversation_history()
            messages.append(HumanMessage(content=user_input))
            messages = [{"role": m.type, "content": m.content} for m in messages]
        else:
            messages.append({"role": "user", "content": user_input})
        
        response = self.chat_completion(messages, model=model, **kwargs)
        return response['choices'][0]['message']['content']

    def add_system_message(self, content: str):
        self.memory.chat_memory.add_message(SystemMessage(content=content))

    def add_user_message(self, content: str):
        self.memory.chat_memory.add_user_message(content)

    def add_ai_message(self, content: str):
        self.memory.chat_memory.add_ai_message(content)