import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { sendChatMessage, getConversationHistory, clearConversationHistory } from '@/api/chat';
import { ChatMessage } from '@/types/api';

interface AITutorProps {
  studentId: string;
}

const AITutor: React.FC<AITutorProps> = ({ studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchConversationHistory();
  }, [studentId]);

  const fetchConversationHistory = async () => {
    try {
      const history = await getConversationHistory(studentId);
      setMessages(history);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to fetch conversation history.",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = { type: 'user', value: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage('ai-tutor', input);
      setMessages(prevMessages => [...prevMessages, { type: 'assistant', value: response.response }]);
    } catch (error) {
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
      addToast({
        title: "Error",
        description: "Failed to clear conversation history.",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
      <div className="h-96 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${
              message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>
              {message.value}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-center">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask your question here..."
          className="flex-grow mr-2"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send your question to the AI Tutor</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleClearHistory} variant="outline">
                Clear History
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear the current conversation history</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default AITutor;