'use client';

import React, { useState, useRef, useEffect } from 'react';
import CharacterBase from './CharacterBase';
import ActivityLayout from '@/components/ActivityLayout';
import ParticleGame from './LevoAct/ParticleGame';
import ChemistryLabSim from './LevoAct/ChemistryLabSim';
import PhysicsPuzzle from './LevoAct/PhysicsPuzzle';
import NumbersGame from './LevoAct/NumbersGame';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest } from '@/utils/apiUtils';

interface ChatMessage {
  type: 'user' | 'assistant';
  value: string;
}

interface AITutorMessage {
  role: 'user' | 'assistant';
  content: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function LevoPage() {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [AITutorMessages, setAITutorMessages] = useState<AITutorMessage[]>([]);
  const [AITutorInput, setAITutorInput] = useState('');
  const [isAITutorLoading, setIsAITutorLoading] = useState(false);
  const AITutorMessagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const scrollAITutorToBottom = () => {
    AITutorMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollAITutorToBottom, [AITutorMessages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = { type: 'user', value: inputMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: 'levo',
          message: inputMessage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { type: 'assistant', value: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, { type: 'assistant', value: 'Sorry, I encountered an error. Please try again.' }]);
      addToast({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendAITutorMessage = async () => {
    if (!AITutorInput.trim()) return;
  
    const newMessage: AITutorMessage = { role: 'user', content: AITutorInput };
    setAITutorMessages(prev => [...prev, newMessage]);
    setAITutorInput('');
    setIsAITutorLoading(true);
  
    try {
      const response = await apiRequest<{ response: string }>('/api/ai-tutor', {
        method: 'POST',
        body: JSON.stringify({ message: AITutorInput, studentId: 'levo-student' }),
      });
      console.log('AI Tutor response:', response);
      setAITutorMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Error sending message to AI Tutor:', error);
      addToast({
        title: "Error",
        description: "Failed to get a response from AI Tutor. Please try again.",
      });
    } finally {
      setIsAITutorLoading(false);
    }
  };

  const handleAITutorClearHistory = async () => {
    try {
      await fetch(`/api/clear-history/levo-student`, { method: 'POST' });
      setAITutorMessages([]);
      addToast({
        title: "Success",
        description: "AI Tutor conversation history cleared successfully.",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to clear AI Tutor conversation history.",
      });
    }
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      addToast({
        title: "Speech Recognition Unavailable",
        description: "Your browser does not support speech recognition. Please use Google Chrome.",
      });
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
        addToast({
          title: "Speech Recognition Error",
          description: "An error occurred during speech recognition. Please try again.",
        });
      };
    }
  };

  const activities = [
    { name: "AI Tutor", key: "AITutor" },
    { name: "Particle Game", key: "ParticleGame" },
    { name: "Chemistry Lab Simulator", key: "ChemistryLabSim" },
    { name: "Physics Puzzle", key: "PhysicsPuzzle" },
    { name: "Numbers Game", key: "NumbersGame" },
  ];

  const renderActivity = () => {
    switch (currentActivity) {
      case "AITutor":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-4">
              {AITutorMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`flex items-end ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Image
                      src={message.role === 'user' ? "/animals/mina.png" : "/animals/levo.png"}
                      alt={message.role === 'user' ? "User" : "AI"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div className={`max-w-xs mx-2 p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isAITutorLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2">
                    <span className="animate-pulse">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={AITutorMessagesEndRef} />
            </div>
            <div className="flex items-center mb-4">
              <Input 
                value={AITutorInput} 
                onChange={(e) => setAITutorInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAITutorMessage()}
                placeholder="Ask AI Tutor a question..."
                className="flex-grow mr-2"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={sendAITutorMessage} disabled={isAITutorLoading}>
                      {isAITutorLoading ? "Sending..." : "Send"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send your question to the AI Tutor</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button onClick={handleAITutorClearHistory} variant="outline">
              Clear History
            </Button>
          </div>
        );
      case "ParticleGame":
        return <ParticleGame />;
      case "ChemistryLabSim":
        return <ChemistryLabSim />;
      case "PhysicsPuzzle":
        return <PhysicsPuzzle />;
      case "NumbersGame":
        return <NumbersGame />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen">
      <CharacterBase
        backgroundImage="/backgrounds/levo-science-bg.jpeg"
        characterName="Levo"
        subject="Science"
        chatDescription="Chat with Levo about scientific concepts and experiments."
        activities={activities.map(activity => ({ name: activity.name, action: () => setCurrentActivity(activity.key) }))}
        progressTitle="Scientific Achievements"
        onSendMessage={sendMessage}
        onStartRecording={startRecording}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        recordMode={recordMode}
      >
        {chatMessages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type === 'assistant' ? 'flex justify-start' : 'flex justify-end'}`}>
            <div className={`flex items-end ${message.type === 'assistant' ? '' : 'flex-row-reverse'}`}>
              <Image
                src={message.type === 'assistant' ? "/animals/levo.png" : "/animals/mina.png"}
                alt={message.type === 'assistant' ? "Levo" : "User"}
                width={24}
                height={24}
                className="rounded-full"
              />
              <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${message.type === 'assistant' ? 'items-start' : 'items-end'}`}>
                <div>
                  <span className={`px-4 py-2 rounded-lg inline-block ${
                    message.type === 'assistant' ? 'rounded-bl-none bg-gray-300 text-gray-600' : 'rounded-br-none bg-blue-600 text-white'
                  }`}>
                    {message.value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message flex justify-start">
            <div className="flex items-end">
              <Image
                src="/animals/levo.png"
                alt="Levo"
                width={24}
                height={24}
                className="rounded-full"
              />
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 items-start">
                <div>
                  <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600 relative">
                    Typing...
                    <span className="animate-ping absolute top-0 right-0 inline-flex w-2 h-2 rounded-full bg-orange-500 opacity-75"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CharacterBase>
      
      {currentActivity && (
        <ActivityLayout
          title={activities.find(a => a.key === currentActivity)?.name || ''}
          onClose={() => setCurrentActivity(null)}
        >
          {renderActivity()}
        </ActivityLayout>
      )}
    </div>
  );
}