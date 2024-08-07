'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ActivityLayout from '@/components/ActivityLayout';
import CharacterBase from '@/components/CharacterBase';
import Image from 'next/image';
// import HistoricalTimelineGame from './EllaAct/HistoricalTimelineGame';
// import AncientCivilizationPuzzle from './EllaAct/AncientCivilizationPuzzle';
// import HistoryChess from './EllaAct/HistoryChess';
// import HistoricalFigureQuiz from './EllaAct/HistoricalFigureQuiz';
import Koda from '@/components/Koda';
import { sendChatMessage, getConversationHistory } from '@/api/chat';
import { ChatMessage } from '@/types/api';
import { useToast } from "@/components/ui/use-toast";

const activities = [
  { name: "Koda", key: "Koda" },
  { name: "Historical Timeline Game", key: "TimelineGame" },
  { name: "Ancient Civilizations Puzzle", key: "CivilizationPuzzle" },
  { name: "Historical Figure Quiz", key: "HistoricalFigureQuiz" },
  { name: "History Chess", key: "HistoryChess" }
];

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function EllaPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Greetings, young historian! I'm Ella, your wise elephant guide through the corridors of time. Ready to explore the fascinating tapestry of human history? From ancient civilizations to modern marvels, I'm here to help you uncover the stories that shaped our world. What era or historical topic would you like to discover today?",
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
        const history = await getConversationHistory(STUDENT_ID, "character_name");
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
      const response = await sendChatMessage('ella', {
        id: '123', // Use a default ID for development
        username: STUDENT_ID,
        email: "student@example.com", // Use a default email for development
        message: input
      });
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
      // case "TimelineGame":
      //   return <HistoricalTimelineGame />;
      // case "CivilizationPuzzle":
      //   return <AncientCivilizationPuzzle />;
      // case "HistoricalFigureQuiz":
      //   return <HistoricalFigureQuiz />;
      // case "HistoryChess":
      //   return <HistoryChess />;
      default:
        return null;
    }
  }, [currentActivity, STUDENT_ID]);

  return (
    <div className="relative min-h-screen">
      <CharacterBase
        studentId={STUDENT_ID}
        backgroundImage="/backgrounds/ella-bg.webp"
        characterName="Ella"
        subject="History"
        chatDescription="Chat with Ella about historical events, figures, and civilizations. Explore different eras, learn about important moments in history, and understand how past events have shaped our world today."
        activities={activities.map(activity => ({ name: activity.name, action: () => toggleActivity(activity.key) }))}
        progressTitle="Time Traveler's Log"
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
                src={message.role === 'user' ? '/student_01.png' : '/animals/ella.png'}
                alt={message.role === 'user' ? 'User' : 'Ella'}
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
                src="/animals/ella.png"
                alt="Ella"
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
