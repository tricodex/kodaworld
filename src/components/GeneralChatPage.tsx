'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from 'next/image';
import KodaHeader from './KodaHeader';
import { sendChatMessage } from '@/api/chat';
import { ChatMessage } from '@/types/api';
import { useRouter } from 'next/router';

export default function GeneralChatPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { character, q } = router.query;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  useEffect(() => {
    if (q && typeof q === 'string') {
      handleSendMessage(q);
    }
  }, [q]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(character as string, message, 'student_01');
      setChatMessages((prevMessages) => [...prevMessages, {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [character]);

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
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: "url('/17.png')" }}></div>
      <div className="relative z-10">
        <KodaHeader />
        
        <main className="container mx-auto px-4 mt-12">
          <Card className="p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chat with {character || 'Koda'}</h2>
              <Button onClick={startNewChat}>New Chat</Button>
            </div>
            <div className="h-96 overflow-y-auto mb-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`chat-message ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${
                    message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}>
                    {message.content}
                  </span>
                </div>
              ))}
              {isLoading && <div className="text-center">Thinking...</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                placeholder="Type your message..."
                className="flex-grow mr-2"
              />
              <Button onClick={() => handleSendMessage(input)}>Send</Button>
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
