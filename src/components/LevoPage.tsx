'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import CharacterBase from '@/components/CharacterBase';
import ActivityLayout from '@/components/ActivityLayout';
import ParticleGame from './LevoAct/ParticleGame';
import ChemistryLabSim from './LevoAct/ChemistryLabSim';
import PhysicsPuzzle from './LevoAct/PhysicsPuzzle';
import NumbersGame from './LevoAct/NumbersGame';
import Koda from '@/components/Koda';
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast";
import { sendChatMessage } from '@/api/chat';
import { ChatMessage } from '@/types/api';

// Define activities available for Levo
const activities = [
  { name: "Koda", key: "Koda" },
  { name: "Particle Game", key: "ParticleGame" },
  { name: "Chemistry Lab Simulator", key: "ChemistryLabSim" },
  { name: "Physics Puzzle", key: "PhysicsPuzzle" },
  { name: "Numbers Game", key: "NumbersGame" },
];

// Declare global types for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function LevoPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      type: 'assistant', 
      value: "Hello! I'm Levo, your science tutor. What would you like to learn about today? We can explore topics in computers, physics, chemistry, biology, robots or any other scientific field you're interested in!" 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const STUDENT_ID = 'student_01';

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Prevent unwanted scrolling when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = { type: 'user', value: inputMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage('levo', inputMessage);
      setChatMessages(prev => [...prev, { type: 'assistant', value: response.response }]);
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
  }, [inputMessage, addToast]);

  const startRecording = useCallback(() => {
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
  }, [addToast]);

  const toggleActivity = useCallback((activity: string | null) => {
    setCurrentActivity(activity);
  }, []);

  const renderActivity = useCallback(() => {
    switch (currentActivity) {
      case "Koda":
        return <Koda studentId={STUDENT_ID} />;
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
  }, [currentActivity]);

  return (
    <div className="relative min-h-screen">
      <CharacterBase
        backgroundImage="/backgrounds/levo-bg.webp"
        characterName="Levo"
        subject="Science"
        chatDescription="Chat with Levo about scientific concepts and experiments."
        activities={activities.map(activity => ({ name: activity.name, action: () => toggleActivity(activity.key) }))}
        progressTitle="Scientific Achievements"
        onSendMessage={handleSendMessage}
        onStartRecording={startRecording}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        recordMode={recordMode}
        studentId={STUDENT_ID}
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
          onClose={() => toggleActivity(null)}
        >
          {renderActivity()}
        </ActivityLayout>
      )}
    </div>
  );
}