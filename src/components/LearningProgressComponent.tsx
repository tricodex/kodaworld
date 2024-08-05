'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLearningProgress } from '@/api/chat';
import { useToast } from "@/components/ui/use-toast";
import { sendChatMessage } from '@/api/chat'; 

const LearningProgressComponent: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);


  const fetchProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const progressValue = await getLearningProgress(studentId);
      if (typeof progressValue === 'number') {
        setProgress(progressValue);
      } else {
        throw new Error('Invalid progress value');
      }
    } catch (error) {
      console.error('Error fetching learning progress:', error);
      setProgress(null);
      addToast({
        title: "Error",
        description: "Failed to fetch learning progress. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [studentId, addToast]);

  useEffect(() => {
    fetchProgress();
  }, [scrollToBottom, fetchProgress]);

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Learning Progress</h2>
      {isLoading ? (
        <p>Loading progress...</p>
      ) : progress !== null ? (
        <>
          <p className="mb-4">Your current progress: {progress.toFixed(2)}%</p>
          <Button onClick={fetchProgress}>Refresh Progress</Button>
        </>
      ) : (
        <p>Unable to load progress. Please try again.</p>
      )}
    </Card>
  );
};

export default LearningProgressComponent;
