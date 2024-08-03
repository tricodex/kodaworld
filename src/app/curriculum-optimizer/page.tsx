// src/app/curriculum-optimizer/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';

export default function CurriculumOptimizer() {
  const [currentCurriculum, setCurrentCurriculum] = useState('');
  const [performanceData, setPerformanceData] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [optimizedCurriculum, setOptimizedCurriculum] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleOptimize = async () => {
    if (!currentCurriculum || !performanceData || !learningGoals) {
      addToast({
        title: "Error",
        description: "Please fill in all fields before optimizing.",
      });
      return;
    }

    setIsLoading(true);
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
      addToast({
        title: "Success",
        description: "Curriculum optimized successfully!",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to optimize curriculum. Please check your input and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTooltip = (content: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="w-4 h-4 ml-2 inline-block" />
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Curriculum Optimizer</h1>
      <Card className="p-6">
        <div className="mb-4">
          <label className="block mb-2 font-bold">
            Current Curriculum (JSON)
            {renderTooltip("Enter your current curriculum structure as a JSON object.")}
          </label>
          <Textarea
            value={currentCurriculum}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentCurriculum(e.target.value)}
            placeholder='{"subject": "Math", "units": ["Algebra", "Geometry"], "difficulty": "Intermediate"}'
            className="mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">
            Performance Data (JSON)
            {renderTooltip("Enter student performance data as a JSON object.")}
          </label>
          <Textarea
            value={performanceData}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPerformanceData(e.target.value)}
            placeholder='{"Algebra": 0.75, "Geometry": 0.6}'
            className="mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">
            Learning Goals (JSON array)
            {renderTooltip("Enter learning goals as a JSON array of strings.")}
          </label>
          <Textarea
            value={learningGoals}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLearningGoals(e.target.value)}
            placeholder='["Master quadratic equations", "Improve spatial reasoning"]'
            className="mb-2"
          />
        </div>
        <Button onClick={handleOptimize} disabled={isLoading}>
          {isLoading ? "Optimizing..." : "Optimize Curriculum"}
        </Button>
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