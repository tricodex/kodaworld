
'use client';

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { InfoIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { optimizeCurriculum } from '@/api/chat';

const characterOptions = [
  { value: 'global', label: 'Global Curriculum' },
  { value: 'wake', label: 'Wake the Musical Whale' },
  { value: 'levo', label: 'Levo the Scholarly Lion' },
  { value: 'mina', label: 'Mina the Globetrotting Monkey' },
  { value: 'ella', label: 'Ella the Wise Elephant' },
];

const subjectOptions = {
  global: ['Math', 'Science', 'History', 'Language', 'Arts', 'Physical Education'],
  wake: ['Music Theory', 'Instrument Studies', 'Music History', 'Composition', 'Sound Engineering'],
  levo: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
  mina: ['Geography', 'Cultural Studies', 'World Languages', 'Astronomy', 'Environmental Science'],
  ella: ['Ancient History', 'Modern History', 'Archaeology', 'Anthropology', 'Political Science'],
};

const CurriculumCreator = () => {
  const [character, setCharacter] = useState('global');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [chapters, setChapters] = useState(['']);
  const [performanceData, setPerformanceData] = useState<{ [key: string]: number }>({});
  const [customSubject, setCustomSubject] = useState('');
  const [optimizedCurriculum, setOptimizedCurriculum] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleCreate = async () => {
    if (!subject || !difficulty || chapters.some(chapter => !chapter) || Object.keys(performanceData).length === 0) {
      addToast({
        title: "Error",
        description: "Please fill in all fields before creating the curriculum.",
      });
      return;
    }

    const currentCurriculum = {
      character,
      subject: subject === 'custom' ? customSubject : subject,
      difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      units: chapters.filter(chapter => chapter),
    };
    const performanceDataArray = Object.keys(performanceData).map(chapter => ({
      chapter,
      score: performanceData[chapter],
    }));

    setIsLoading(true);
    try {
      console.log("Sending request to optimize curriculum");
      const response = await optimizeCurriculum(
        currentCurriculum,
        performanceDataArray
      );
      console.log("Received response:", response);

      setOptimizedCurriculum(JSON.stringify(response, null, 2));
      addToast({
        title: "Success",
        description: "Curriculum created successfully!",
      });
    } catch (error) {
      console.error('Error creating curriculum:', error);
      addToast({
        title: "Error",
        description: "Failed to create curriculum. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTooltip = (content: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <InfoIcon className="w-4 h-4 ml-2 inline-block" />
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
          Character {renderTooltip("Select the character or choose global curriculum.")}
        </label>
        <Select onValueChange={(value) => { setCharacter(value); setSubject(''); }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a character" />
          </SelectTrigger>
          <SelectContent>
            {characterOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">
          Subject {renderTooltip("Select the main subject of the curriculum.")}
        </label>
        <Select onValueChange={setSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjectOptions[character as keyof typeof subjectOptions].map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        {subject === 'custom' && (
          <Input
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            placeholder="Enter custom subject"
            className="mt-2"
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">
          Difficulty {renderTooltip("Select the difficulty level of the curriculum.")}
        </label>
        <Select onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">
          Chapters {renderTooltip("Enter the chapter topics covered in the curriculum.")}
        </label>
        {chapters.map((chapter, index) => (
          <div key={index} className="flex mb-2">
            <Input
              value={chapter}
              onChange={(e) => {
                const newChapters = [...chapters];
                newChapters[index] = e.target.value;
                setChapters(newChapters);
              }}
              placeholder={`Chapter ${index + 1}`}
              className="mr-2"
            />
            {index === chapters.length - 1 && (
              <Button onClick={() => setChapters([...chapters, ''])}>+</Button>
            )}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">
          Performance Data {renderTooltip("Enter the performance data for each chapter.")}
        </label>
        {chapters.filter(chapter => chapter).map((chapter, index) => (
          <div key={index} className="flex mb-2">
            <Input
              value={chapter}
              readOnly
              className="mr-2 w-1/2"
            />
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={performanceData[chapter] || ''}
              onChange={(e) => {
                setPerformanceData({
                  ...performanceData,
                  [chapter]: parseFloat(e.target.value),
                });
              }}
              placeholder="0.0 - 1.0"
              className="w-1/2"
            />
          </div>
        ))}
      </div>
      <Button onClick={handleCreate} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Curriculum"}
      </Button>
      {optimizedCurriculum && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Created Curriculum:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
            {optimizedCurriculum}
          </pre>
        </div>
      )}
    </Card>
  );
};

export default CurriculumCreator;


// // src/components/CurriculumCreator.tsx

// 'use client';

// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { InfoIcon } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { optimizeCurriculum } from '@/api/chat';
// import { CurriculumData, PerformanceData } from '@/types/api';

// const characterOptions = [
//   { value: 'global', label: 'Global Curriculum' },
//   { value: 'wake', label: 'Wake the Musical Whale' },
//   { value: 'levo', label: 'Levo the Scholarly Lion' },
//   { value: 'mina', label: 'Mina the Globetrotting Monkey' },
//   { value: 'ella', label: 'Ella the Wise Elephant' },
// ];

// const subjectOptions = {
//   global: ['Math', 'Science', 'History', 'Language', 'Arts', 'Physical Education'],
//   wake: ['Music Theory', 'Instrument Studies', 'Music History', 'Composition', 'Sound Engineering'],
//   levo: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
//   mina: ['Geography', 'Cultural Studies', 'World Languages', 'Astronomy', 'Environmental Science'],
//   ella: ['Ancient History', 'Modern History', 'Archaeology', 'Anthropology', 'Political Science'],
// };

// const CurriculumCreator = () => {
//   const [character, setCharacter] = useState('global');
//   const [subject, setSubject] = useState('');
//   const [difficulty, setDifficulty] = useState('');
//   const [chapters, setChapters] = useState(['']);
//   const [performanceData, setPerformanceData] = useState<{ [key: string]: number }>({});
//   // const [learningGoals, setLearningGoals] = useState(['']);
//   const [customSubject, setCustomSubject] = useState('');
//   const [optimizedCurriculum, setOptimizedCurriculum] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { addToast } = useToast();
//   const STUDENT_ID = 'student_01'

//   const handleCreate = async () => {
//     if (!subject || !difficulty || chapters.some(chapter => !chapter) || Object.keys(performanceData).length === 0 || learningGoals.some(goal => !goal)) {
//       addToast({
//         title: "Error",
//         description: "Please fill in all fields before creating the curriculum.",
//       });
//       return;
//     }
  
//     const currentCurriculum = {
//       character,
//       subject: subject === 'custom' ? customSubject : subject,
//       difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
//       units: chapters.filter(chapter => chapter),
//     };
//     const performanceDataArray = Object.keys(performanceData).map(chapter => ({
//       chapter,
//       score: performanceData[chapter],
//     }));
//     const learningGoalsArray = learningGoals.filter(goal => goal).map(goal => ({
//       goal,
//     }));
  
//     setIsLoading(true);
//     try {
//       console.log("Sending request to optimize curriculum");
//       const response = await optimizeCurriculum(
//         currentCurriculum,
//         performanceDataArray,
//         learningGoalsArray
//       );
//       console.log("Received response:", response);
//       if (response.error) {
//         addToast({
//           title: "Error",
//           description: response.error,
//         });
//       } else {
//         setOptimizedCurriculum(JSON.stringify(response, null, 2));
//         addToast({
//           title: "Success",
//           description: "Curriculum created successfully!",
//         });
//       }
//     } catch (error) {
//       console.error('Error creating curriculum:', error);
//       addToast({
//         title: "Error",
//         description: "Failed to create curriculum. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   const renderTooltip = (content: string) => (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger>
//           <InfoIcon className="w-4 h-4 ml-2 inline-block" />
//         </TooltipTrigger>
//         <TooltipContent>{content}</TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );

//   return (
//     <Card className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Curriculum Optimizer</h2>
//       <div className="mb-4">
//         <label className="block mb-2 font-bold">
//           Character {renderTooltip("Select the character or choose global curriculum.")}
//         </label>
//         <Select onValueChange={(value) => { setCharacter(value); setSubject(''); }}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select a character" />
//           </SelectTrigger>
//           <SelectContent>
//             {characterOptions.map(option => (
//               <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="mb-4">
//         <label className="block mb-2 font-bold">
//           Subject {renderTooltip("Select the main subject of the curriculum.")}
//         </label>
//         <Select onValueChange={setSubject}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select a subject" />
//           </SelectTrigger>
//           <SelectContent>
//             {subjectOptions[character as keyof typeof subjectOptions].map(option => (
//               <SelectItem key={option} value={option}>{option}</SelectItem>
//             ))}
//             <SelectItem value="custom">Custom</SelectItem>
//           </SelectContent>
//         </Select>
//         {subject === 'custom' && (
//           <Input
//             value={customSubject}
//             onChange={(e) => setCustomSubject(e.target.value)}
//             placeholder="Enter custom subject"
//             className="mt-2"
//           />
//         )}
//       </div>
//       <div className="mb-4">
//         <label className="block mb-2 font-bold">
//           Difficulty {renderTooltip("Select the difficulty level of the curriculum.")}
//         </label>
//         <Select onValueChange={setDifficulty}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select difficulty" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="Beginner">Beginner</SelectItem>
//             <SelectItem value="Intermediate">Intermediate</SelectItem>
//             <SelectItem value="Advanced">Advanced</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="mb-4">
//         <label className="block mb-2 font-bold">
//           Chapters {renderTooltip("Enter the chapter topics covered in the curriculum.")}
//         </label>
//         {chapters.map((chapter, index) => (
//           <div key={index} className="flex mb-2">
//             <Input
//               value={chapter}
//               onChange={(e) => {
//                 const newChapters = [...chapters];
//                 newChapters[index] = e.target.value;
//                 setChapters(newChapters);
//               }}
//               placeholder={`Chapter ${index + 1}`}
//               className="mr-2"
//             />
//             {index === chapters.length - 1 && (
//               <Button onClick={() => setChapters([...chapters, ''])}>+</Button>
//             )}
//           </div>
//         ))}
//       </div>
//       <div className="mb-4">
//         <label className="block mb-2 font-bold">
//           Performance Data {renderTooltip("Enter the performance data for each chapter.")}
//         </label>
//         {chapters.filter(chapter => chapter).map((chapter, index) => (
//           <div key={index} className="flex mb-2">
//             <Input
//               value={chapter}
//               readOnly
//               className="mr-2 w-1/2"
//             />
//             <Input
//               type="number"
//               min="0"
//               max="1"
//               step="0.1"
//               value={performanceData[chapter] || ''}
//               onChange={(e) => {
//                 setPerformanceData({
//                   ...performanceData,
//                   [chapter]: parseFloat(e.target.value),
//                 });
//               }}
//               placeholder="0.0 - 1.0"
//               className="w-1/2"
//             />
//           </div>
//         ))}
//       </div>
//       {/* <div className="mb-4">
//         <label className="block mb-2 font-bold">
//           Learning Goals {renderTooltip("Enter the learning goals for the curriculum.")}
//         </label>
//         {learningGoals.map((goal, index) => (
//           <div key={index} className="flex mb-2">
//             <Input
//               value={goal}
//               onChange={(e) => {
//                 const newGoals = [...learningGoals];
//                 newGoals[index] = e.target.value;
//                 setLearningGoals(newGoals);
//               }}
//               placeholder={`Goal ${index + 1}`}
//               className="mr-2"
//             />
//             {index === learningGoals.length - 1 && (
//               <Button onClick={() => setLearningGoals([...learningGoals, ''])}>+</Button>
//             )}
//           </div>
//         ))}
//       </div> */}
//       <Button onClick={handleCreate} disabled={isLoading}>
//         {isLoading ? "Creating..." : "Create Curriculum"}
//       </Button>
//       {optimizedCurriculum && (
//         <div className="mt-4">
//           <h3 className="text-xl font-bold">Created Curriculum:</h3>
//           <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
//             {optimizedCurriculum}
//           </pre>
//         </div>
//       )}
//     </Card>
//   );
// };

// export default CurriculumCreator;
