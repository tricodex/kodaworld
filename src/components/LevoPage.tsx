'use client';

import React, { useState, useRef, useEffect } from 'react';
import CharacterBase from './CharacterBase';
import ParticleGame from './LevoAct/ParticleGame';
import ChemistryLabSim from './LevoAct/ChemistryLabSim';
import PhysicsPuzzle from './LevoAct/PhysicsPuzzle';
import NumbersGame from './LevoAct/NumbersGame';
import AiTutor from './AiTutor';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast";

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

export default function LevoPage() {
  const [showParticleGame, setShowParticleGame] = useState(false);
  const [showChemistryLabSim, setShowChemistryLabSim] = useState(false);
  const [showPhysicsPuzzle, setShowPhysicsPuzzle] = useState(false);
  const [showNumbersGame, setShowNumbersGame] = useState(false);
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const toggleParticleGame = () => setShowParticleGame(!showParticleGame);
  const toggleChemistryLabSim = () => setShowChemistryLabSim(!showChemistryLabSim);
  const togglePhysicsPuzzle = () => setShowPhysicsPuzzle(!showPhysicsPuzzle);
  const toggleNumbersGame = () => setShowNumbersGame(!showNumbersGame);
  const toggleAiTutor = () => setShowAiTutor(!showAiTutor);

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
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser does not support speech recognition. Please use Google Chrome.",
        variant: "destructive",
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
        toast({
          title: "Speech Recognition Error",
          description: "An error occurred during speech recognition. Please try again.",
          variant: "destructive",
        });
      };
    }
  };

  return (
    <div className="relative min-h-screen">
      <CharacterBase
        backgroundImage="/backgrounds/levo-science-bg.jpg"
        characterName="Levo"
        subject="Science"
        chatDescription="Chat with Levo about scientific concepts and experiments."
        activities={[
          { name: "AI Tutor", action: toggleAiTutor },
          { name: "Particle Game", action: toggleParticleGame },
          { name: "Chemistry Lab Simulator", action: toggleChemistryLabSim },
          { name: "Physics Puzzle", action: togglePhysicsPuzzle },
          { name: "Numbers Game", action: toggleNumbersGame },
        ]}
        progressTitle="Scientific Achievements"
        onSendMessage={sendMessage}
        onStartRecording={startRecording}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        recordMode={recordMode}
      >
        {chatMessages.map((message, index) => (
          message.type === 'assistant' ? (
            <div key={index} className="chat-message">
              <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                  <div>
                    <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                      {message.value}
                    </span>
                  </div>
                </div>
                <Image
                  src="/animals/levo.png"
                  alt="Levo"
                  width={24}
                  height={24}
                  className="rounded-full order-1"
                />
              </div>
            </div>
          ) : (
            <div key={index} className="chat-message">
              <div className="flex items-end justify-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                  <div>
                    <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                      {message.value}
                    </span>
                  </div>
                </div>
                <Image src="/animals/mina.png" alt="My profile" width={24} height={24} className="rounded-full order-2" />
              </div>
            </div>
          )
        ))}
        {isLoading && (
          <div className="chat-message">
            <div className="flex items-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div>
                  <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600 relative">
                    Typing...
                    <span className="animate-ping absolute top-0 right-0 inline-flex w-2 h-2 rounded-full bg-orange-500 opacity-75"></span>
                  </span>
                </div>
              </div>
              <Image
                src="/animals/levo.png"
                alt="Levo"
                width={24}
                height={24}
                className="rounded-full order-1"
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CharacterBase>
      
      {showAiTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">AI Tutor</h2>
            <AiTutor studentId="levo-student" />
            <Button className="mt-4" onClick={toggleAiTutor}>Close AI Tutor</Button>
          </Card>
        </div>
      )}
      
      {showParticleGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Particle Game</h2>
            <ParticleGame />
            <Button className="mt-4" onClick={toggleParticleGame}>Close Game</Button>
          </Card>
        </div>
      )}
      {showChemistryLabSim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Chemistry Lab Simulator</h2>
            <ChemistryLabSim />
            <Button className="mt-4" onClick={toggleChemistryLabSim}>Close Simulator</Button>
          </Card>
        </div>
      )}
      {showPhysicsPuzzle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 bg-white w-5/6 h-5/6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Physics Puzzle</h2>
            <PhysicsPuzzle />
            <Button className="mt-4" onClick={togglePhysicsPuzzle}>Close Puzzle</Button>
          </Card>
        </div>
      )}
      {showNumbersGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 bg-white w-5/6 h-5/6 overflow-hidden">
            <h2 className="text-2xl font-bold mb-4">Numbers Game</h2>
            <div className="h-[calc(100%-4rem)]">
              <NumbersGame />
            </div>
            <Button className="mt-4" onClick={toggleNumbersGame}>Close Game</Button>
          </Card>
        </div>
      )}
    </div>
  );
}