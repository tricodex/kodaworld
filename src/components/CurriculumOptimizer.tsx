import React, { useState } from 'react';
import { Button } from "./ui/button";
import Textarea from "./ui/textarea";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { optimizeCurriculum } from '@/api/chat';

const CurriculumOptimizer = () => {
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
      const response = await optimizeCurriculum(
        JSON.parse(currentCurriculum),
        JSON.parse(performanceData),
        JSON.parse(learningGoals)
      );
      setOptimizedCurriculum(JSON.stringify(response, null, 2));
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
        <TooltipTrigger>
          <InfoCircledIcon className="w-4 h-4 ml-2" />
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Curriculum Optimizer</h2>
      <div className="mb-4">
        <label className="block mb-2 font-bold">
          Current Curriculum (JSON)
          {renderTooltip("Enter your current curriculum structure as a JSON object.")}
        </label>
        <Textarea
          value={currentCurriculum}
          onChange={(e) => setCurrentCurriculum(e.target.value)}
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
          onChange={(e) => setPerformanceData(e.target.value)}
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
          onChange={(e) => setLearningGoals(e.target.value)}
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
  );
};

export default CurriculumOptimizer;