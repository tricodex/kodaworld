import React from 'react';
import MinaPage from '../../components/MinaPage';
import NextSteps from '../../components/NextSteps';
import LearningProgressComponent from '../../components/LearningProgressComponent';

export default function Mina() {
  // The assistant sets a hardcoded studentId for the MVP
  const studentId = 'student_01';

  return (
    <div>
      <MinaPage />
      <div className="mt-8">
        <NextSteps studentId={studentId} />
      </div>
      <div className="mt-8">
        <LearningProgressComponent studentId={studentId} />
      </div>
    </div>
  );
}