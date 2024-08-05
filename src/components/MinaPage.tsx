'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ActivityLayout from '@/components/ActivityLayout';
import CharacterBase from '@/components/CharacterBase';
import Image from 'next/image';
import CulturalExpedition from './MinaAct/CulturalExpedition';
import WorldMapQuiz from './MinaAct/WorldMapQuiz';
import ClimateChallenge from './MinaAct/ClimateChallenge';
import CountryGame from './MinaAct/CountryGame';
import Koda from '@/components/Koda';
import { sendChatMessage, getConversationHistory } from '@/api/chat';
import { ChatMessage } from '@/types/api';
import { useToast } from "@/components/ui/use-toast";

const activities = [
  { name: "Koda", key: "Koda" },
  { name: "World Map Quiz", key: "WorldMapQuiz" },
  { name: "Climate Challenge", key: "ClimateChallenge" },
  { name: "Cultural Expedition", key: "CulturalExpedition" },
  { name: "Country Game", key: "CountryGame" }
];

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function MinaPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: 'assistant',
      value: "Hello there! I'm Mina, your globetrotting monkey guide to geography and world cultures. Ready to explore the wonders of our planet? Whether you want to learn about distant lands, diverse cultures, or the Earth's amazing features, I'm here to help. What would you like to discover today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const STUDENT_ID = 'student_01';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [chatMessages]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getConversationHistory(STUDENT_ID);
        if (history.length > 0) {
          setChatMessages(history);
        }
      } catch (error) {
        console.error('Error fetching conversation history:', error);
        addToast({
          title: "Error",
          description: "Failed to load chat history. Starting a new conversation.",
        });
      }
    };

    fetchHistory();
  }, [addToast]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = { type: 'user', value: inputMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage('mina', inputMessage);
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
  }, [currentActivity]);

  return (
    <div className="relative min-h-screen">
      <CharacterBase
        studentId={STUDENT_ID}
        backgroundImage="/backgrounds/mina-bg.webp"
        characterName="Mina"
        subject="Geography"
        chatDescription="Chat with Mina about countries, cultures, and geographical features."
        activities={activities.map(activity => ({ name: activity.name, action: () => toggleActivity(activity.key) }))}
        progressTitle="Global Explorer Badge"
        onSendMessage={handleSendMessage}
        onStartRecording={startRecording}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        recordMode={recordMode}
      >
        {chatMessages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
            <div className={`flex items-end ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <Image
                src={message.type === 'user' ? '/student_01.png' : '/animals/mina.png'}
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
        {isLoading && (
          <div className="chat-message flex justify-start">
            <div className="flex items-end">
              <Image
                src="/animals/mina.png"
                alt="Mina"
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