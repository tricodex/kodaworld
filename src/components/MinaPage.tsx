'use client';

import React, { useState, useRef, useEffect } from 'react';
import ActivityLayout from '@/components/ActivityLayout';
import CharacterBase from './CharacterBase';
import Image from 'next/image';
import CulturalExpedition from './MinaAct/CulturalExpedition';
import WorldMapQuiz from './MinaAct/WorldMapQuiz';
import ClimateChallenge from './MinaAct/ClimateChallenge';
import CountryGame from './MinaAct/CountryGame';
import { Button } from "@/components/ui/button";

interface ChatMessage {
  type: 'user' | 'assistant';
  value: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function MinaPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentActivity, setCurrentActivity] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const sendMessage = async () => {
    // ... (existing sendMessage logic)
  };

  const startRecording = () => {
    // ... (existing startRecording logic)
  };

  const toggleActivity = (activity: string | null) => {
    setCurrentActivity(activity);
  };

  const activities = [
    { name: "World Map Quiz", key: "WorldMapQuiz" },
    { name: "Climate Challenge", key: "ClimateChallenge" },
    { name: "Cultural Expedition", key: "CulturalExpedition" },
    { name: "Country Game", key: "CountryGame" }
  ];

  const renderActivity = () => {
    switch (currentActivity) {
      case "WorldMapQuiz":
        return <WorldMapQuiz />;
      case "ClimateChallenge":
        return <ClimateChallenge />;
      case "CulturalExpedition":
        return <CulturalExpedition />;
      case "CountryGame":
        return <CountryGame />;
      default:
        return null;
    }
  };

  return (
    <>
      <CharacterBase
        backgroundImage="/backgrounds/mina-geography-bg.jpg"
        characterName="Mina"
        subject="Geography"
        chatDescription="Chat with Mina about countries, cultures, and geographical features."
        activities={activities.map(activity => ({ name: activity.name, action: () => toggleActivity(activity.key) }))}
        progressTitle="Global Explorer Badge"
        onSendMessage={sendMessage}
        onStartRecording={startRecording}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        recordMode={recordMode}
      >
        {chatMessages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
            <div className={`flex items-end ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <Image
                src={message.type === 'user' ? '/animals/ella.png' : '/animals/mina.png'}
                alt={message.type === 'user' ? 'User' : 'Mina'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div>
                  <span className={`px-4 py-2 rounded-lg inline-block ${
                    message.type === 'user' ? 'rounded-br-none bg-blue-600 text-white' : 'rounded-bl-none bg-gray-300 text-gray-600'
                  }`}>
                    {message.value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
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
    </>
  );
}