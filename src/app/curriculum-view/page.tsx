import React from 'react';
import KodaHeader from '@/components/KodaHeader';
import CurriculumView from '@/components/CurriculumView';

const CurriculumViewPage: React.FC = () => {
  return (
    <div>
      <KodaHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Curriculum View</h1>
        <CurriculumView />
      </div>
    </div>
  );
};

export default CurriculumViewPage;