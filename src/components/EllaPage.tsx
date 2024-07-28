'use client';

import React, { useState, useRef, useEffect } from 'react';
import CharacterBase from './CharacterBase';
import HistoricalTimelineGame from './EllaAct/HistoricalTimelineGame';
import AncientCivilizationPuzzle from './EllaAct/AncientCivilizationPuzzle';
import HistoryChess from './EllaAct/HistoryChess';
import HistoricalFigureQuiz from './EllaAct/HistoricalFigureQuiz';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const [showTimelineGame, setShowTimelineGame] = useState(false);
  const [showCivilizationPuzzle, setShowCivilizationPuzzle] = useState(false);
  const [showHistoricalFigureQuiz, setShowHistoricalFigureQuiz] = useState(false);
  const [showHistoryChess, setShowHistoryChess] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleTimelineGame = () => setShowTimelineGame(!showTimelineGame);
  const toggleCivilizationPuzzle = () => setShowCivilizationPuzzle(!showCivilizationPuzzle);
  const toggleHistoricalFigureQuiz = () => setShowHistoricalFigureQuiz(!showHistoricalFigureQuiz);
  const toggleHistoryChess = () => setShowHistoryChess(!showHistoryChess);

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

  return (
    <>
      <CharacterBase
        backgroundImage="/backgrounds/ella-history-bg.jpg"
        characterName="Ella"
        subject="History"
        chatDescription="Chat with Ella about historical events, figures, and civilizations. Explore different eras, learn about important moments in history, and understand how past events have shaped our world today."
        activities={[
          { name: "Historical Timeline Game", action: toggleTimelineGame },
          { name: "Ancient Civilizations Puzzle", action: toggleCivilizationPuzzle },
          { name: "Historical Figure Quiz", action: toggleHistoricalFigureQuiz },
          { name: "History Chess", action: toggleHistoryChess },
          // { name: "Cultural Expedition", action: toggleCulturalExpedition }
        ]}
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

{showTimelineGame && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Historical Timeline Game</h2>
      <HistoricalTimelineGame />
      <Button className="mt-4" onClick={toggleTimelineGame}>Close Game</Button>
    </Card>
  </div>
)}
{showCivilizationPuzzle && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Ancient Civilizations Puzzle</h2>
      <AncientCivilizationPuzzle />
      <Button className="mt-4" onClick={toggleCivilizationPuzzle}>Close Puzzle</Button>
    </Card>
  </div>
)}
{showHistoricalFigureQuiz && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Historical Figure Quiz</h2>
      <HistoricalFigureQuiz />
      <Button className="mt-4" onClick={toggleHistoricalFigureQuiz}>Close Quiz</Button>
    </Card>
  </div>
)}
{showHistoryChess && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">History Chess</h2>
      <HistoryChess />
      <Button className="mt-4" onClick={toggleHistoryChess}>Close Game</Button>
    </Card>
  </div>
)}
{/* {showCulturalExpedition && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Cultural Expedition</h2>
      <CulturalExpedition />
      <Button className="mt-4" onClick={toggleCulturalExpedition}>Close Expedition</Button>
    </Card>
  </div>
)} */}
</>
);
}