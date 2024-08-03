// src/components/ui/avatar.tsx

import React from 'react';
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
        {children}
      </div>
    </div>
  );
};