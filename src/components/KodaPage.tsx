'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { matchPeers, getAchievements, generateChallenges, generateEnvironment, getConversationHistory, sendChatMessage } from '@/api/chat';
import KodaHeader from './KodaHeader';
import Image from 'next/image';

const KodaPage: React.FC = () => {
  const [studentId, setStudentId] = useState('student_01');
  const [peerMatches, setPeerMatches] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<any>(null);
  const [topic, setTopic] = useState('');
  const [complexity, setComplexity] = useState('intermediate');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const { addToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const character = 'koda';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchChatHistory = useCallback(async () => {
    try {
      const history = await getConversationHistory(studentId, character);
      setChatHistory(history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      addToast({
        title: "Error",
        description: "Failed to fetch chat history. Please try again.",
      });
    }
  }, [studentId, addToast, character]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  const handlePeerMatching = useCallback(async () => {
    try {
      const matches = await matchPeers([studentId], 2); // Adjusted to use array and specify group size
      setPeerMatches(matches.flat()); // Flattening the matches array to string[]
      addToast({
        title: "Peer Matching",
        description: "Successfully found peer matches!",
      });
    } catch (error) {
      console.error('Error in peer matching:', error);
      addToast({
        title: "Error",
        description: "Failed to find peer matches. Please try again.",
      });
    }
  }, [studentId, addToast]);

  const handleGetAchievements = useCallback(async () => {
    try {
      const userAchievements = await getAchievements(studentId);
      setAchievements(userAchievements);
      addToast({
        title: "Achievements",
        description: "Successfully retrieved your achievements!",
      });
    } catch (error) {
      console.error('Error getting achievements:', error);
      addToast({
        title: "Error",
        description: "Failed to get achievements. Please try again.",
      });
    }
  }, [studentId, addToast]);

  const handleGenerateChallenges = useCallback(async () => {
    try {
      const newChallenges = await generateChallenges(studentId, {}, {}); // Provide empty objects for progress and achievementSystem
      setChallenges(newChallenges);
      addToast({
        title: "Challenges",
        description: "Successfully generated new challenges!",
      });
    } catch (error) {
      console.error('Error generating challenges:', error);
      addToast({
        title: "Error",
        description: "Failed to generate challenges. Please try again.",
      });
    }
  }, [studentId, addToast]);

  const handleGenerateEnvironment = useCallback(async () => {
    if (!topic) {
      addToast({
        title: "Error",
        description: "Please enter a topic for the environment.",
      });
      return;
    }
    try {
      const newEnvironment = await generateEnvironment(topic, complexity);
      setEnvironment(newEnvironment);
      addToast({
        title: "Environment",
        description: "Successfully generated a new learning environment!",
      });
    } catch (error) {
      console.error('Error generating environment:', error);
      addToast({
        title: "Error",
        description: "Failed to generate environment. Please try again.",
      });
    }
  }, [topic, complexity, addToast]);

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim()) return;

    try {
      const response = await sendChatMessage(character, currentMessage, studentId);
      setChatHistory(prev => [...prev, { role: 'user', content: currentMessage }, { role: 'assistant', content: response.response }]);
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      addToast({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  }, [currentMessage, studentId, addToast, character]);

  return (
    <div className="container mx-auto p-4">
      <KodaHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Chat with Koda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto mb-4 p-4 border rounded">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`flex items-end ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-8 h-8">
                      <Image
                        src={message.role === 'user' ? '/student_01.png' : '/koda_logo123.png'}
                        alt={message.role === 'user' ? 'User' : 'Koda'}
                        width={32}
                        height={32}
                      />
                    </Avatar>
                    <div className={`max-w-xs mx-2 p-2 rounded ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-grow mr-2"
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peer Matching</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePeerMatching}>Find Peer Matches</Button>
            {peerMatches.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Your Matches:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {peerMatches.map((match, index) => (
                    <li key={index}>{match}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gamification</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetAchievements} className="mr-2">View Achievements</Button>
            <Button onClick={handleGenerateChallenges}>Generate Challenges</Button>
            {achievements.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Your Achievements:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
            {challenges.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Your Challenges:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic"
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="complexity">Complexity</Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateEnvironment} className="mt-4">Generate Environment</Button>
            {environment && (
              <div className="mt-4">
                <h3 className="font-semibold">Generated Environment:</h3>
                <p>{environment.description}</p>
                <h4 className="font-semibold mt-2">Interactive Elements:</h4>
                <ul className="list-disc pl-5">
                  {environment.interactive_elements.map((element: string, index: number) => (
                    <li key={index}>{element}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KodaPage;
