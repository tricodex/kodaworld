'use client';

import React, { useState, useRef, useEffect } from 'react';
import CharacterBase from './CharacterBase';
import Image from 'next/image';
import CulturalExpedition from './MinaAct/CulturalExpedition';
import WorldMapQuiz from './MinaAct/WorldMapQuiz';
import ClimateChallenge from './MinaAct/ClimateChallenge';
import CountryGame from './MinaAct/CountryGame';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  const [showCulturalExpedition, setShowCulturalExpedition] = useState(false);
  const [showWorldMapQuiz, setShowWorldMapQuiz] = useState(false);
  const [showClimateChallenge, setShowClimateChallenge] = useState(false);
  const [showCountryGame, setShowCountryGame] = useState(false)

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
          character: 'mina',
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

  const toggleCulturalExpedition = () => setShowCulturalExpedition(!showCulturalExpedition);
  const toggleWorldMapQuiz = () => setShowWorldMapQuiz(!showWorldMapQuiz);
  const toggleClimateChallenge = () => setShowClimateChallenge(!showClimateChallenge);
  const toggleCountryGame = () => setShowCountryGame(!showCountryGame);

  return (
    <>
      <CharacterBase
        backgroundImage="/backgrounds/mina-geography-bg.jpg"
        characterName="Mina"
        subject="Geography"
        chatDescription="Chat with Mina about countries, cultures, and geographical features."
        activities={[
          { name: "World Map Quiz", action: toggleWorldMapQuiz },
          { name: "Climate Challenge", action: toggleClimateChallenge },
          { name: "Cultural Expedition", action: toggleCulturalExpedition },
          { name: "Country Game", action: toggleCountryGame }
        ]}
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

{showCulturalExpedition && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Cultural Expedition</h2>
      <CulturalExpedition />
      <Button className="mt-4" onClick={toggleCulturalExpedition}>Close Expedition</Button>
    </Card>
  </div>
)}

{showWorldMapQuiz && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">World Map Quiz</h2>
      <WorldMapQuiz />
      <Button className="mt-4" onClick={toggleWorldMapQuiz}>Close Quiz</Button>
    </Card>
  </div>
)}

{showClimateChallenge && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Climate Challenge</h2>
      <ClimateChallenge />
      <Button className="mt-4" onClick={toggleClimateChallenge}>Close Challenge</Button>
    </Card>
  </div>
)}

{showCountryGame && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Country Game</h2>
      <CountryGame />
      <Button className="mt-4" onClick={toggleCountryGame}>Close Game</Button>
    </Card>
  </div>
)}
</>
);
}