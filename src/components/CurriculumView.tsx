import React, { useState, useEffect } from 'react';
import { getCurriculum } from '@/api/chat';
import { useToast } from "@/components/ui/use-toast";

const CurriculumView: React.FC = () => {
  const [curriculum, setCurriculum] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response:any = await getCurriculum('latest');  // Fetch the latest curriculum
        setCurriculum(response.curriculum);
      } catch (error) {
        console.error('Error fetching curriculum:', error);
        addToast({
          title: "Error",
          description: "Failed to fetch curriculum. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurriculum();
  }, []);

  if (isLoading) return <div>Loading curriculum...</div>;
  if (!curriculum) return <div>No curriculum found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Optimized Curriculum</h2>
      <h3 className="text-xl font-bold mt-4 mb-2">Overview</h3>
      <p>{curriculum.overview}</p>
      <h3 className="text-xl font-bold mt-4 mb-2">Learning Objectives</h3>
      <ul className="list-disc pl-5">
        {curriculum.learningObjectives.map((objective: string, index: number) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>
      <h3 className="text-xl font-bold mt-4 mb-2">Units</h3>
      {curriculum.units.map((unit: any, index: number) => (
        <div key={index} className="mb-4">
          <h4 className="text-lg font-bold">{unit.title}</h4>
          <p>{unit.description}</p>
          <h5 className="font-bold mt-2">Key Concepts</h5>
          <ul className="list-disc pl-5">
            {unit.keyConcepts.map((concept: string, conceptIndex: number) => (
              <li key={conceptIndex}>{concept}</li>
            ))}
          </ul>
          <h5 className="font-bold mt-2">Starter Questions</h5>
          <ul className="list-disc pl-5">
            {unit.starterQuestions.map((question: string, questionIndex: number) => (
              <li key={questionIndex}>{question}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CurriculumView;