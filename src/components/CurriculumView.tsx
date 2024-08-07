'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { getCurriculum } from '@/api/chat';
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const CurriculumView: React.FC = () => {
  const [curriculum, setCurriculum] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { addToast } = useToast();

  const fetchCurriculum = useCallback(async () => {
    try {
      const response: any = await getCurriculum('latest');
      setCurriculum(response.curriculum);
      // Simulating progress for demonstration
      setProgress(Math.floor(Math.random() * 101));
    } catch (error) {
      console.error('Error fetching curriculum:', error);
      addToast({
        title: "Error",
        description: "Failed to fetch curriculum. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!curriculum) return <div className="p-6 text-center text-xl font-semibold">No curriculum found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Your Optimized Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-1">{progress}% Complete</p>
          </div>
          <p className="text-gray-700">{curriculum.overview}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {curriculum.learningObjectives.map((objective: string, index: number) => (
              <li key={index} className="text-gray-700">{objective}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        {curriculum.units.map((unit: any, index: number) => (
          <AccordionItem value={`unit-${index}`} key={index}>
            <AccordionTrigger className="text-xl font-semibold">
              {unit.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700 mb-4">{unit.description}</p>
                <h5 className="font-bold mt-4 mb-2">Key Concepts</h5>
                <div className="flex flex-wrap gap-2 mb-4">
                  {unit.keyConcepts.map((concept: string, conceptIndex: number) => (
                    <Badge key={conceptIndex} variant="secondary">{concept}</Badge>
                  ))}
                </div>
                <h5 className="font-bold mt-4 mb-2">Starter Questions</h5>
                <ul className="list-disc pl-5 space-y-2">
                  {unit.starterQuestions.map((question: string, questionIndex: number) => (
                    <li key={questionIndex} className="text-gray-700">{question}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CurriculumView;