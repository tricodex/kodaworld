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

// Define activities
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [recordMode, setRecordMode] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use a constant for the student ID
  const STUDENT_ID = 'student_01';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [chatMessages]);

  // Fetch conversation history when the component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getConversationHistory(STUDENT_ID);
        if (history.length === 0) {
          // If there's no history, get an initial greeting from Mina
          const response = await sendChatMessage('mina', 'Greet the user and introduce yourself');
          setChatMessages([{ type: 'assistant', value: response.response }]);
        } else {
          setChatMessages(history);
        }
      } catch (error) {
        console.error('Error fetching conversation history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage]);

  const startRecording = useCallback(() => {
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
  }, []);

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
  }, [currentActivity, STUDENT_ID]);

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