'use client';

import React, { useState, useRef, useEffect } from 'react';
import CharacterBase from './CharacterBase';
import Image from 'next/image';
import MusicVisualizer from './WakeAct/MusicVisualizer';
import RhythmGame from './WakeAct/RhythmGame'; // Import RhythmGame component
import ComposeMelody from './WakeAct/ComposeMelody'; // Import the new component
import InstrumentQuiz from './WakeAct/InstrumentQuiz'; // Import the new component
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

export default function WakePage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const [showMusicVisualizer, setShowMusicVisualizer] = useState(false);
  const [showRhythmGame, setShowRhythmGame] = useState(false); // State for RhythmGame
  const [showComposeMelody, setShowComposeMelody] = useState(false);
  const [showInstrumentQuiz, setShowInstrumentQuiz] = useState(false);
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
          character: 'wake',
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

  const toggleMusicVisualizer = () => {
    setShowMusicVisualizer(!showMusicVisualizer);
  };

  const toggleRhythmGame = () => {
    setShowRhythmGame(!showRhythmGame);
  };

  const toggleComposeMelody = () => {
    setShowComposeMelody(!showComposeMelody);
  };

  const toggleInstrumentQuiz = () => {
    setShowInstrumentQuiz(!showInstrumentQuiz);
  };

  return (
    <div className="relative">
      <CharacterBase
        videoBackground="/wb5.mp4"
        characterName="Wake"
        subject="Music"
        chatDescription="Chat with Wake about music theory, instruments, and composition."
        activities={[
          { name: "Rhythm Game", action: toggleRhythmGame },
          { name: "Compose a Melody", action: toggleComposeMelody },
          { name: "Instrument Quiz", action: toggleInstrumentQuiz },
          { name: "Music Visualizer", action: toggleMusicVisualizer }
        ]}
        progressTitle="Your Musical Journey"
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
                src={message.type === 'user' ? '/animals/mina.png' : '/animals/wake.png'}
                alt={message.type === 'user' ? 'User' : 'Wake'}
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
      {showMusicVisualizer && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Music Visualizer</h2>
      <MusicVisualizer />
      <Button className="mt-4" onClick={toggleMusicVisualizer}>Close</Button>
    </Card>
  </div>
)}

{showRhythmGame && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Rhythm Game</h2>
      <RhythmGame />
      <Button className="mt-4" onClick={toggleRhythmGame}>Close</Button>
    </Card>
  </div>
)}

{showComposeMelody && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Compose Melody</h2>
      <ComposeMelody />
      <Button className="mt-4" onClick={toggleComposeMelody}>Close</Button>
    </Card>
  </div>
)}

{showInstrumentQuiz && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Instrument Quiz</h2>
      <InstrumentQuiz />
      <Button className="mt-4" onClick={toggleInstrumentQuiz}>Close</Button>
    </Card>
  </div>
)}
    </div>
  );
}
