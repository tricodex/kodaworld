// src/app/curriculum-optimizer/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function CurriculumOptimizer() {
  const [currentCurriculum, setCurrentCurriculum] = useState('');
  const [performanceData, setPerformanceData] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [optimizedCurriculum, setOptimizedCurriculum] = useState('');
  const { addToast } = useToast();

  const handleOptimize = async () => {
    try {
      const response = await fetch('/api/optimize-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCurriculum: JSON.parse(currentCurriculum),
          performanceData: JSON.parse(performanceData),
          learningGoals: JSON.parse(learningGoals),
        }),
      });

      if (!response.ok) throw new Error('Failed to optimize curriculum');

      const data = await response.json();
      setOptimizedCurriculum(JSON.stringify(data.optimizedCurriculum, null, 2));
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to optimize curriculum. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Curriculum Optimizer</h1>
      <Card className="p-6">
        <Textarea
          value={currentCurriculum}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentCurriculum(e.target.value)}
          placeholder="Current Curriculum (JSON)"
          className="mb-4"
        />
        <Textarea
          value={performanceData}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPerformanceData(e.target.value)}
          placeholder="Performance Data (JSON)"
          className="mb-4"
        />
        <Textarea
          value={learningGoals}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLearningGoals(e.target.value)}
          placeholder="Learning Goals (JSON array)"
          className="mb-4"
        />
        <Button onClick={handleOptimize}>Optimize Curriculum</Button>
        {optimizedCurriculum && (
          <div className="mt-4">
            <h3 className="text-xl font-bold">Optimized Curriculum:</h3>
            <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {optimizedCurriculum}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
}