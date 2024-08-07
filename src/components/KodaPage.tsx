'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Avatar } from "@/components/ui/avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { 
  matchPeers, getUserAchievements, generateChallenges, generateEnvironment, 
  getConversationHistory, sendChatMessage, getLearningProgress, getNextSteps,
  optimizeCurriculum, getCurriculum, generateAchievements, updateAchievements,
  calculateEngagement, generateEnvironmentWithImage, generateAchievementBadge,
  recommendResources, generateElement, createUser, getUserProfile, createUserEngagement
} from '@/api/chat';
import { CurriculumData, PerformanceData, LearningGoal, Environment, Challenge, UserProfile, UserEngagement } from '@/types/api';
import KodaHeader from './KodaHeader';
import Image from 'next/image';

const KodaPage: React.FC = () => {
  const [studentId, setStudentId] = useState('student_01');
  const [peerMatches, setPeerMatches] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [topic, setTopic] = useState('');
  const [complexity, setComplexity] = useState('intermediate');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [learningProgress, setLearningProgress] = useState<number>(0);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userEngagement, setUserEngagement] = useState<UserEngagement | null>(null);
  const [recommendedResources, setRecommendedResources] = useState<any[]>([]);
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
      const matches = await matchPeers([{ id: parseInt(studentId), username: `student_${studentId}`, email: `student_${studentId}@example.com` }], 2);
      setPeerMatches(matches.flat());
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
      const userAchievements = await getUserAchievements(parseInt(studentId));
      setAchievements(userAchievements.map(a => a.achievement?.name || ''));
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
      const newChallenges = await generateChallenges(studentId, {}, {});
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
      const newEnvironment = await generateEnvironmentWithImage(topic, complexity as 'Beginner' | 'Intermediate' | 'Advanced');
      setEnvironment(newEnvironment);
      addToast({
        title: "Environment",
        description: "Successfully generated a new learning environment with image!",
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
      const response = await sendChatMessage(character as 'wake' | 'levo' | 'mina' | 'ella' | 'koda', currentMessage, studentId);
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

  const handleGetLearningProgress = useCallback(async () => {
    try {
      const progress = await getLearningProgress(studentId);
      setLearningProgress(progress);
      addToast({
        title: "Learning Progress",
        description: `Your current learning progress is ${progress.toFixed(2)}%`,
      });
    } catch (error) {
      console.error('Error getting learning progress:', error);
      addToast({
        title: "Error",
        description: "Failed to get learning progress. Please try again.",
      });
    }
  }, [studentId, addToast]);

  const handleGetNextSteps = useCallback(async () => {
    try {
      const steps = await getNextSteps(studentId);
      setNextSteps(steps);
      addToast({
        title: "Next Steps",
        description: "Successfully retrieved your next learning steps!",
      });
    } catch (error) {
      console.error('Error getting next steps:', error);
      addToast({
        title: "Error",
        description: "Failed to get next steps. Please try again.",
      });
    }
  }, [studentId, addToast]);

  const handleOptimizeCurriculum = useCallback(async () => {
    try {
      const currentCurriculum: CurriculumData = { subject: "Math", units: ["Algebra", "Geometry"], difficulty: "Intermediate" };
      const performanceData: PerformanceData[] = [{ chapter: "Algebra", score: 0.8 }];
      const learningGoals: LearningGoal[] = [{ goal: "Master quadratic equations" }];
      const optimizedCurriculum = await optimizeCurriculum(currentCurriculum, performanceData, learningGoals);
      setCurriculum(optimizedCurriculum);
      addToast({
        title: "Curriculum Optimized",
        description: "Successfully optimized your curriculum!",
      });
    } catch (error) {
      console.error('Error optimizing curriculum:', error);
      addToast({
        title: "Error",
        description: "Failed to optimize curriculum. Please try again.",
      });
    }
  }, [addToast]);

  const handleRecommendResources = useCallback(async () => {
    try {
      const resources = await recommendResources(studentId, 'visual', 'mathematics', 'intermediate');
      setRecommendedResources(resources);
      addToast({
        title: "Resources Recommended",
        description: "Successfully recommended learning resources!",
      });
    } catch (error) {
      console.error('Error recommending resources:', error);
      addToast({
        title: "Error",
        description: "Failed to recommend resources. Please try again.",
      });
    }
  }, [studentId, addToast]);

  return (
    <div className="container mx-auto p-4">
      <KodaHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chat section */}
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
              <div ref={messagesEndRef} />
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

        {/* Peer Matching section */}
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

        {/* Gamification section */}
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
                    <li key={index}>{challenge.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academica section */}
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
                {environment.image_url && (
                  <Image src={environment.image_url} alt="Generated Environment" width={300} height={200} className="mt-2" />
                )}
                <h4 className="font-semibold mt-2">Interactive Elements:</h4>
                <ul className="list-disc pl-5">
                  {environment.elements.map((element: string, index: number) => (
                    <li key={index}>{element}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Progress section */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetLearningProgress} className="mr-2">Get Learning Progress</Button>
            <Button onClick={handleGetNextSteps}>Get Next Steps</Button>
            {learningProgress > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Your Learning Progress:</h3>
                <p>{learningProgress.toFixed(2)}%</p>
              </div>
            )}
            {nextSteps.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Next Steps:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {nextSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Curriculum Optimization section */}
        <Card>
          <CardHeader>
            <CardTitle>Curriculum Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleOptimizeCurriculum}>Optimize Curriculum</Button>
            {curriculum && (
              <div className="mt-4">
                <h3 className="font-semibold">Optimized Curriculum:</h3>
                <p>Subject: {curriculum.subject}</p>
                <p>Difficulty: {curriculum.difficulty}</p>
                <h4 className="font-semibold mt-2">Units:</h4>
                <ul className="list-disc pl-5">
                  {curriculum.units.map((unit, index) => (
                    <li key={index}>{unit}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resource Recommendations section */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRecommendResources}>Get Recommended Resources</Button>
            {recommendedResources.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Recommended Resources:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {recommendedResources.map((resource, index) => (
                    <li key={index}>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {resource.title}
                      </a>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Profile section */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={async () => {
              try {
                const profile = await getUserProfile(parseInt(studentId));
                setUserProfile(profile);
                addToast({
                  title: "User Profile",
                  description: "Successfully retrieved user profile!",
                });
              } catch (error) {
                console.error('Error getting user profile:', error);
                addToast({
                  title: "Error",
                  description: "Failed to get user profile. Please try again.",
                });
              }
            }} className="mr-2">
              Get User Profile
            </Button>
            {userProfile && (
              <div className="mt-4">
                <h3 className="font-semibold">User Profile:</h3>
                <p>Learning Style: {userProfile.learning_style}</p>
                <h4 className="font-semibold mt-2">Skills:</h4>
                <ul className="list-disc pl-5">
                  {Object.entries(userProfile.skills).map(([skill, level], index) => (
                    <li key={index}>{skill}: {level}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mt-2">Interests:</h4>
                <ul className="list-disc pl-5">
                  {userProfile.interests.map((interest, index) => (
                    <li key={index}>{interest}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Engagement section */}
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={async () => {
              try {
                const engagement: UserEngagement = {
                  user_id: parseInt(studentId),
                  engagement_score: Math.random() * 100 // Random score for demonstration
                };
                const createdEngagement = await createUserEngagement(engagement);
                setUserEngagement(createdEngagement);
                addToast({
                  title: "User Engagement",
                  description: "Successfully created user engagement!",
                });
              } catch (error) {
                console.error('Error creating user engagement:', error);
                addToast({
                  title: "Error",
                  description: "Failed to create user engagement. Please try again.",
                });
              }
            }} className="mr-2">
              Create User Engagement
            </Button>
            {userEngagement && (
              <div className="mt-4">
                <h3 className="font-semibold">User Engagement:</h3>
                <p>Engagement Score: {userEngagement.engagement_score.toFixed(2)}</p>
                <p>Timestamp: {userEngagement.timestamp}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KodaPage;