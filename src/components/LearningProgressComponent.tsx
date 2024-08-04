'use client';
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLearningProgress } from '@/api/chat';

const LearningProgressComponent: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      const response = await getLearningProgress(studentId);
      // The assistant ensures that the progress is a number
      setProgress(typeof response.progress === 'number' ? response.progress : null);
    } catch (error) {
      console.error('Error fetching learning progress:', error);
      setProgress(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [studentId]);

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Learning Progress</h2>
      {isLoading ? (
        <p>Loading progress...</p>
      ) : progress !== null ? (
        <>
          <p className="mb-4">Your current progress: {progress}%</p>
          <Button onClick={fetchProgress}>Refresh Progress</Button>
        </>
      ) : (
        <p>Unable to load progress. Please try again.</p>
      )}
    </Card>
  );
};

export default LearningProgressComponent;