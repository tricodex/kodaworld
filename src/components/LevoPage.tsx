'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import CharacterBase from '@/components/CharacterBase';
import ActivityLayout from '@/components/ActivityLayout';
import ParticleGame from './LevoAct/ParticleGame';
import LevoPuzzleGame from './LevoAct/LevoPuzzleGame';
import PhysicsPuzzle from './LevoAct/PhysicsPuzzle';
import NumbersGame from './LevoAct/NumbersGame';
import Koda from '@/components/Koda';
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast";
import { sendChatMessage } from '@/api/chat';
import { ChatMessage } from '@/types/api';

const activities = [
  { name: "Koda", key: "Koda" },
  { name: "Particle Game", key: "ParticleGame" },
  { name: "Shapes Game", key: "LevoPuzzleGame" }, 
  { name: "Interactive Spheres", key: "PhysicsPuzzle" },
  { name: "Numbers Game", key: "NumbersGame" },
];

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function LevoPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm Levo, the scholarly lion. I'm here to help you explore the fascinating world of science. What would you like to learn about today? We can dive into topics in maths, physics, chemistry, biology, computer science, or any other scientific field you're curious about!",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const STUDENT_ID = 'student_01';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage('levo', input, STUDENT_ID);
      setChatMessages((prevMessages) => [...prevMessages, {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      addToast({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [input, STUDENT_ID, addToast, scrollToBottom]);

  const startRecording = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    setRecordMode(true);

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
  };

  const toggleActivity = useCallback((activity: string | null) => {
    setCurrentActivity(activity);
  }, []);

  const renderActivity = useCallback(() => {
    switch (currentActivity) {
      case "Koda":
        return <Koda studentId={STUDENT_ID} />;
      case "ParticleGame":
        return <ParticleGame />;
      case "LevoPuzzleGame":
        return <LevoPuzzleGame />;
      case "PhysicsPuzzle":
        return <PhysicsPuzzle />;
      case "NumbersGame":
        return <NumbersGame />;
      default:
        return null;
    }
  }, [currentActivity, STUDENT_ID]);

  return (
    <div className="relative min-h-screen">
      <CharacterBase
        backgroundImage="/backgrounds/levo-bg.webp"
        characterName="Levo"
        subject="Science"
        chatDescription="Chat with Levo, the scholarly lion, about scientific concepts and experiments."
        activities={activities.map(activity => ({ name: activity.name, action: () => toggleActivity(activity.key) }))}
        progressTitle="Scientific Achievements"
        onSendMessage={handleSendMessage}
        onStartRecording={startRecording}
        input={input}
        setInputMessage={setInputMessage}
        recordMode={recordMode}
        studentId={STUDENT_ID}
      >
        {chatMessages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role === 'assistant' ? 'flex justify-start' : 'flex justify-end'}`}>
            <div className={`flex items-end ${message.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
              <Image
                src={message.role === 'assistant' ? "/animals/levo.png" : "/student_01.png"}
                alt={message.role === 'assistant' ? "Levo" : "User"}
                width={24}
                height={24}
                className="rounded-full"
              />
              <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${message.role === 'assistant' ? 'items-start' : 'items-end'}`}>
                <div>
                  <span className={`px-4 py-2 rounded-lg inline-block ${
                    message.role === 'assistant' ? 'rounded-bl-none bg-gray-300 text-gray-600' : 'rounded-br-none bg-blue-600 text-white'
                  }`}>
                    {message.content}
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
                    Levo is thinking...
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
          onClose={() => toggleActivity(null)}
        >
          {renderActivity()}
        </ActivityLayout>
      )}
    </div>
  );
}
