import React from 'react';
import WakePage from '../../components/WakePage';
import NextSteps from '../../components/NextSteps';
import LearningProgressComponent from '../../components/LearningProgressComponent';

export default function Wake() {
  // The assistant sets a hardcoded studentId for the MVP
  const studentId = 'student_01';

  return (
    <div>
      <WakePage />
      <div className="mt-8">
        <NextSteps studentId={studentId} />
      </div>
      <div className="mt-8">
        <LearningProgressComponent studentId={studentId} />
      </div>
    </div>
  );
}