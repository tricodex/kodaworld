import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ActivityLayoutProps {
  children: ReactNode;
  title: string;
  onClose: () => void;
}

const ActivityLayout: React.FC<ActivityLayoutProps> = ({ children, title, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-5/6 h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button onClick={onClose}>Close</Button>
        </div>
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </Card>
    </div>
  );
};

export default ActivityLayout;
