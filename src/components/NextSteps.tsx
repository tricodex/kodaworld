'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNextSteps } from '@/api/chat';
import { useToast } from "@/components/ui/use-toast";

const NextSteps: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const fetchNextSteps = useCallback(async () => {
    setIsLoading(true);
    try {
      const steps = await getNextSteps(studentId);
      setNextSteps(steps);
    } catch (error) {
      console.error('Failed to fetch next steps:', error);
      setNextSteps([]);
      addToast({
        title: "Error",
        description: "Failed to fetch next steps. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [studentId, addToast]);

  useEffect(() => {
    fetchNextSteps();
  }, [fetchNextSteps]);

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
      {isLoading ? (
        <p>Loading next steps...</p>
      ) : nextSteps.length > 0 ? (
        <>
          <ul className="list-disc pl-5 mb-4">
            {nextSteps.map((step, index) => (
              <li key={index} className="mb-2">{step}</li>
            ))}
          </ul>
          <Button onClick={fetchNextSteps}>Refresh Next Steps</Button>
        </>
      ) : (
        <p>No next steps available. Try refreshing.</p>
      )}
    </Card>
  );
};

export default NextSteps;