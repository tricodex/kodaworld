'use client';
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNextSteps } from '@/api/chat';

const NextSteps: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNextSteps = async () => {
    setIsLoading(true);
    try {
      const response:any = await getNextSteps(studentId);
      setNextSteps(response.nextSteps);
    } catch (error) {
      console.error('Failed to fetch next steps:', error);
      setNextSteps([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextSteps();
  }, [studentId]);

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
      {isLoading ? (
        <p>Loading next steps...</p>
      ) : (
        <>
          <ul className="list-disc pl-5 mb-4">
            {nextSteps.map((step, index) => (
              <li key={index} className="mb-2">{step}</li>
            ))}
          </ul>
          <Button onClick={fetchNextSteps}>Refresh Next Steps</Button>
        </>
      )}
    </Card>
  );
};

export default NextSteps;