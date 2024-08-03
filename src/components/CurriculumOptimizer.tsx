import React, { useState } from 'react';
import { Button } from "./ui/button";
import Textarea from "@/components/ui/textarea";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";

const CurriculumOptimizer = () => {
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Curriculum Optimizer</h2>
      <Textarea
        value={currentCurriculum}
        onChange={(e) => setCurrentCurriculum(e.target.value)}
        placeholder="Current Curriculum (JSON)"
        className="mb-4"
      />
      <Textarea
        value={performanceData}
        onChange={(e) => setPerformanceData(e.target.value)}
        placeholder="Performance Data (JSON)"
        className="mb-4"
      />
      <Textarea
        value={learningGoals}
        onChange={(e) => setLearningGoals(e.target.value)}
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
  );
};

export default CurriculumOptimizer;