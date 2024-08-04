import React from 'react';
import KodaHeader from '@/components/KodaHeader';
import CurriculumCreator from '@/components/CurriculumCreator';

const CurriculumPage: React.FC = () => {
  return (
    <div>
      <KodaHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Curriculum Management</h1>
        <CurriculumCreator />
      </div>
    </div>
  );
};

export default CurriculumPage;