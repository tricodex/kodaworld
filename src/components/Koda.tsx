// src/components/Koda.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { sendChatMessage, getConversationHistory, clearConversationHistory } from '@/api/chat';
import { ChatMessage } from '@/types/api';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

type CharacterType = "koda" | "wake" | "levo" | "mina" | "ella";

interface KodaProps {
  studentId: string;
  character?: CharacterType;
}

const Koda: React.FC<KodaProps> = ({ studentId, character = "koda" }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const STUDENT_ID = 'student_01';


  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  const fetchConversationHistory = useCallback(async () => {
    setIsFetching(true);
    try {
      const history = await getConversationHistory(studentId, character);
      setMessages(history);
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      addToast({
        title: "Error",
        description: "Failed to fetch conversation history.",
      });
    } finally {
      setIsFetching(false);
    }
  }, [studentId, character, addToast]);

  useEffect(() => {
    fetchConversationHistory();
  }, [fetchConversationHistory]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage('koda', {
        id: '123', // Use a default ID for development
        username: STUDENT_ID,
        email: "student@example.com", // Use a default email for development
        message: input
      });      setMessages((prevMessages) => [...prevMessages, {
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
  };

  const handleClearHistory = async () => {
    try {
      await clearConversationHistory(studentId, character);
      setMessages([]);
      addToast({
        title: "Success",
        description: "Conversation history cleared successfully.",
      });
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      addToast({
        title: "Error",
        description: "Failed to clear conversation history.",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
      <div className="h-96 overflow-y-auto mb-4 relative">
        {isFetching ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div className={`flex items-end ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Image
                    src={message.role === 'user' ? '/student_01.png' : '/koda_logo128.png'}
                    alt={message.role === 'user' ? 'User' : 'Koda'}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className={`inline-block p-2 rounded-lg mx-2 ${
                    message.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}>
                    {message.content}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-start items-center text-gray-500 mt-2"
          >
            <Image
              src="/koda_logo128.png"
              alt="Koda"
              width={24}
              height={24}
              className="rounded-full mr-2"
            />
            <span>Thinking<span className="animate-pulse">...</span></span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your question here..."
          className="flex-grow mr-2"
          disabled={isLoading}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send your question to Koda</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleClearHistory} variant="outline" disabled={messages.length === 0}>
                Clear History
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear the current conversation history</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={fetchConversationHistory} variant="ghost">
          Refresh
        </Button>
      </div>
    </Card>
  );
};

export default Koda;
