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

interface KodaProps {
  studentId: string;
  character?: string;
}

const Koda: React.FC<KodaProps> = ({ studentId, character = "koda" }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  const fetchConversationHistory = useCallback(async () => {
    setIsFetching(true);
    try {
      const history = await getConversationHistory(studentId);
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
  }, [studentId, addToast]);

  useEffect(() => {
    fetchConversationHistory();
  }, [fetchConversationHistory]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = { type: 'user', value: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(character, input, studentId);
      setMessages(prevMessages => [...prevMessages, { type: 'assistant', value: response.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      addToast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearConversationHistory(studentId);
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
                className={`chat-message ${message.type === 'user' ? 'text-right' : 'text-left'} mb-2`}
              >
                <span className={`inline-block p-2 rounded-lg ${
                  message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {message.value}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 mt-2"
          >
            Thinking<span className="animate-pulse">...</span>
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