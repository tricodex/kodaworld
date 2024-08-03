'use client';

import React, { useState, useRef, useEffect } from 'react';
import ActivityLayout from '@/components/ActivityLayout';
import CharacterBase from './CharacterBase';
import HistoricalTimelineGame from './EllaAct/HistoricalTimelineGame';
import AncientCivilizationPuzzle from './EllaAct/AncientCivilizationPuzzle';
import HistoryChess from './EllaAct/HistoryChess';
import HistoricalFigureQuiz from './EllaAct/HistoricalFigureQuiz';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

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

export default function EllaPage() {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: 'ella',
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

  const toggleActivity = (activity: string | null) => {
    setCurrentActivity(activity);
  };

  const activities = [
    { name: "Historical Timeline Game", key: "TimelineGame" },
    { name: "Ancient Civilizations Puzzle", key: "CivilizationPuzzle" },
    { name: "Historical Figure Quiz", key: "HistoricalFigureQuiz" },
    { name: "History Chess", key: "HistoryChess" }
  ];

  const renderActivity = () => {
    switch (currentActivity) {
      case "TimelineGame":
        return <HistoricalTimelineGame />;
      case "CivilizationPuzzle":
        return <AncientCivilizationPuzzle />;
      case "HistoricalFigureQuiz":
        return <HistoricalFigureQuiz />;
      case "HistoryChess":
        return <HistoryChess />;
      default:
        return null;
    }
  };

  return (
    <>
      <CharacterBase
        backgroundImage="/backgrounds/ella-history-bg.jpg"
        characterName="Ella"
        subject="History"
        chatDescription="Chat with Ella about historical events, figures, and civilizations. Explore different eras, learn about important moments in history, and understand how past events have shaped our world today."
        activities={activities.map(activity => ({ name: activity.name, action: () => toggleActivity(activity.key) }))}
        progressTitle="Time Traveler's Log"
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
                src={message.type === 'user' ? '/animals/wake.png' : '/animals/ella.png'}
                alt={message.type === 'user' ? 'User' : 'Ella'}
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