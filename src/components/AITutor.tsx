import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AITutorProps {
  studentId: string;
}

const AITutor: React.FC<AITutorProps> = ({ studentId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, studentId }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
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
      await fetch(`/api/clear-history/${studentId}`, { method: 'POST' });
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

  const AvatarSVG = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#4CAF50" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20">AI</text>
    </svg>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">AI Tutor</h2>
      <p className="mb-4">Ask questions and get personalized tutoring assistance.</p>
      <div className="flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-end ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.role === 'assistant' && <AvatarSVG />}
                <div className={`max-w-xs mx-2 p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2">
                <span className="animate-pulse">AI is thinking...</span>
              </div>
            </div>
          )}
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