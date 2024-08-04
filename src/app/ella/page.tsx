import React from 'react';
import EllaPage from '../../components/EllaPage';
import NextSteps from '../../components/NextSteps';
import LearningProgressComponent from '../../components/LearningProgressComponent';

export default function Ella() {
  // The assistant sets a hardcoded studentId for the MVP
  const studentId = 'student_01';

  return (
    <div>
      <EllaPage />
      <div className="mt-8">
        <NextSteps studentId={studentId} />
      </div>
      <div className="mt-8">
        <LearningProgressComponent studentId={studentId} />
      </div>
    </div>
  );
}