import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search } from 'lucide-react';
import Image from 'next/image';
import KodaHeader from './KodaHeader';
import { sendChatMessage } from '@/api/chat';
import { ChatMessage } from '@/types/api';

export default function GeneralChatPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = { type: 'user', value: inputMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage('koda', inputMessage);
      setChatMessages(prev => [...prev, { type: 'assistant', value: response.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, { type: 'assistant', value: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Google Chrome.');
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onstart = function () {
        setRecordMode(true);
      };

      recognition.onend = function () {
        setRecordMode(false);
      };

      recognition.onresult = function (event: any) {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.onerror = function (event: any) {
        console.error(event);
      };
    }
  };

  const startNewChat = () => {
    setChatMessages([]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0" style={{backgroundImage: "url('/17.png')"}}></div>
      <div className="relative z-10">
        <KodaHeader />
        
        <main className="container mx-auto px-4 mt-12">
          <Card className="p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">General Chat</h2>
              <Button onClick={startNewChat}>New Chat</Button>
            </div>
            <div className="h-96 overflow-y-auto mb-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`chat-message ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${
                    message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}>
                    {message.value}
                  </span>
                </div>
              ))}
              {isLoading && <div className="text-center">Thinking...</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-grow mr-2"
              />
              <Button onClick={sendMessage}>Send</Button>
              <Button onClick={startRecording} className="ml-2">
                {recordMode ? 'Stop' : 'Record'}
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}