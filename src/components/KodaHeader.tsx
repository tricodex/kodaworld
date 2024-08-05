import React from 'react';
import { Button } from "@/components/ui/button"
import { Bell, Settings, LogIn, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const KodaHeader: React.FC = () => {
  return (
    <header className="relative p-2"> 
      <div className="relative z-10 flex justify-between items-center">
        <Link href="/" className="text-4xl font-bold text-white animate-fade-in ml-2" style={{ fontFamily: 'var(--font-bungee-spice)', letterSpacing: '+0.0001em' }}>
          <span style={{ letterSpacing: 'inherit' }}>K</span>
          <Image 
            src="/koda_logo128.png" 
            alt="Globe" 
            width={40} 
            height={20} 
            className="inline-block align-middle" 
          />
          <span style={{ letterSpacing: 'inherit' }}>DA</span>
        </Link>
        <div className="flex items-center space-x-4">
        <Link href="/koda" passHref>
            <Button variant="ghost" className="text-black hover:bg-black/20">Koda</Button>
          </Link>
          <Link href="/element-lab" passHref>
            <Button variant="ghost" className="text-black hover:bg-black/20">Element Lab</Button>
          </Link>
          <Link href="/curriculum-view" passHref>
            <Button variant="ghost" className="text-black hover:bg-black/20">              
            <BookOpen className="h-5 w-5 mr-2" />
            Curriculum</Button>
          </Link>
          <Link href="/curriculum-optimizer" passHref>
            <Button variant="ghost" className="text-black hover:bg-black/20">
              Curriculum Optimizer
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="text-black hover:bg-black/20"><Bell className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" aria-label="Settings" className="text-black hover:bg-black/20"><Settings className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" aria-label="Login" className="text-black hover:bg-black/20"><LogIn className="h-5 w-5" /></Button>
          <Button variant="ghost" className="hidden sm:inline-flex text-black border-white hover:bg-black/20">Upgrade Plan</Button>
        </div>
      </div>
    </header>
  );
};

export default KodaHeader;