import React from 'react';
import LevoPage from '../../components/LevoPage';
import NextSteps from '../../components/NextSteps';
import LearningProgressComponent from '../../components/LearningProgressComponent';

export default function Levo() {
  // The assistant sets a hardcoded studentId for the MVP
  const studentId = 'student_01';

  return (
    <div>
      <LevoPage />
      <div className="mt-8">
        <NextSteps studentId={studentId} />
      </div>
      <div className="mt-8">
        <LearningProgressComponent studentId={studentId} />
      </div>
    </div>
  );
}