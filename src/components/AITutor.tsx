import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "./ui/use-toast";

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
  const [isTyping, setIsTyping] = useState(false);
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
    setIsTyping(true);

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
      setIsTyping(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
      <div className="flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-end ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className={message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </Avatar>
                <div className={`max-w-xs mx-2 p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2">
                <span className="animate-pulse">AI is typing...</span>
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
          <Button onClick={handleSendMessage} disabled={isTyping}>Send</Button>
        </div>
      </div>
    </Card>
  );
};

export default AITutor;