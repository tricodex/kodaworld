'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ActivityLayout from '@/components/ActivityLayout';
import CharacterBase from '@/components/CharacterBase';
import Image from 'next/image';
import MusicVisualizer from './WakeAct/MusicVisualizer';
// import RhythmGame from './WakeAct/RhythmGame';
import ComposeMelody from './WakeAct/ComposeMelody';
// import InstrumentQuiz from './WakeAct/InstrumentQuiz';
import Koda from '@/components/Koda';
import { sendChatMessage, getConversationHistory } from '@/api/chat';
import { ChatMessage } from '@/types/api';
import { useToast } from "@/components/ui/use-toast";

const activities = [
  { name: "Koda", key: "Koda" },
  { name: "Rhythm Game", key: "RhythmGame" },
  { name: "Compose a Melody", key: "ComposeMelody" },
  { name: "Instrument Quiz", key: "InstrumentQuiz" },
  { name: "Music Visualizer", key: "MusicVisualizer" }
];

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function WakePage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello there! I'm Wake, your musical whale guide to the world of sound and melody. Ready to dive into the ocean of music? Whether you want to learn about music theory, instruments, composition, or just enjoy some tunes, I'm here to help. What musical adventure would you like to start today?",
      timestamp: new Date().toISOString()
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

  useEffect(scrollToBottom, [chatMessages, scrollToBottom]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getConversationHistory(STUDENT_ID, "wake");
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
  }, [STUDENT_ID, addToast]);

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
      const response = await sendChatMessage('wake', input, STUDENT_ID);
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
      // case "RhythmGame":
      //   return <RhythmGame />;
      case "ComposeMelody":
        return <ComposeMelody />;
      // case "InstrumentQuiz":
      //   return <InstrumentQuiz />;
      case "MusicVisualizer":
        return <MusicVisualizer />;
      default:
        return null;
    }
  }, [currentActivity, STUDENT_ID]);

  return (
    <div className="relative min-h-screen">
      <CharacterBase
        studentId={STUDENT_ID}
        videoBackground="/wb5.mp4"
        characterName="Wake"
        subject="Music"
        chatDescription="Chat with Wake about music theory, instruments, and composition."
        activities={activities.map(activity => ({ name: activity.name, action: () => toggleActivity(activity.key) }))}
        progressTitle="Your Musical Journey"
        onSendMessage={handleSendMessage}
        onStartRecording={startRecording}
        input={input}
        setInputMessage={setInputMessage}
        recordMode={recordMode}
      >
        {chatMessages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
            <div className={`flex items-end ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Image
                src={message.role === 'user' ? '/student_01.png' : '/animals/wake.png'}
                alt={message.role === 'user' ? 'User' : 'Wake'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div>
                  <span className={`px-4 py-2 rounded-lg inline-block ${
                    message.role === 'user' ? 'rounded-br-none bg-blue-600 text-white' : 'rounded-bl-none bg-gray-300 text-gray-600'
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
                src="/animals/wake.png"
                alt="Wake"
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
