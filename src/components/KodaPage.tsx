import React, { useState, useEffect, useCallback } from 'react';
import Koda from '@/components/Koda';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { matchPeers, getAchievements, generateChallenges, generateEnvironment } from '@/api/chat';

const KodaPage: React.FC = () => {
  const [studentId, setStudentId] = useState('student_01');
  const [peerMatches, setPeerMatches] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [complexity, setComplexity] = useState('intermediate');
  const { addToast } = useToast();

  const handlePeerMatching = useCallback(async () => {
    try {
      const matches = await matchPeers(studentId);
      setPeerMatches(matches);
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
      const newChallenges = await generateChallenges(studentId);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to KodaWorld</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chat with Koda</CardTitle>
          </CardHeader>
          <CardContent>
            <Koda studentId={studentId} />
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
                <ul>
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
                <ul>
                  {achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
            {challenges.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Your Challenges:</h3>
                <ul>
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
              <select
                id="complexity"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className="w-full p-2 border rounded"
                title="Complexity"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <Button onClick={handleGenerateEnvironment} className="mt-4">Generate Environment</Button>
            {environment && (
              <div className="mt-4">
                <h3 className="font-semibold">Generated Environment:</h3>
                <p>{environment}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KodaPage;