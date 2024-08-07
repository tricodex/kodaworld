import React from 'react';
import { Button } from "@/components/ui/button"
import { Bell, Settings, LogIn, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface KodaHeaderProps {
  inverse?: boolean;
}

const KodaHeader: React.FC<KodaHeaderProps> = ({ inverse = false }) => {
  const textColor = inverse ? 'text-white' : 'text-black';
  const hoverBgColor = inverse ? 'hover:bg-white/20' : 'hover:bg-black/20';

  return (
    <header className="relative p-2"> 
      <div className="relative z-10 flex justify-between items-center">
        <Link href="/" className={`text-4xl font-bold ${textColor} animate-fade-in ml-2`} style={{ fontFamily: 'var(--font-bungee-spice)', letterSpacing: '+0.0001em' }}>
          <span style={{ letterSpacing: 'inherit' }}>K</span>
          <Image 
            src="/koda_logo128.png" 
            alt="Globe" 
            width={40} 
            height={20} 
            className="inline-block align-middle" 
            style={{ marginLeft: '-0.1em', marginRight: '-0.1em' }}
          />
          <span style={{ letterSpacing: 'inherit' }}>DA</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/koda-bg" passHref>
            <Button variant="ghost" className={`${textColor} ${hoverBgColor}`}>Tag</Button>
          </Link>
          <Link href="/about" passHref>
            <Button variant="ghost" className={`${textColor} ${hoverBgColor}`}>About</Button>
          </Link>
          <Link href="/space" passHref>
            <Button variant="ghost" className={`${textColor} ${hoverBgColor}`}>Space</Button>
          </Link>
          <Link href="/koda" passHref>
            <Button variant="ghost" className={`${textColor} ${hoverBgColor}`}>Koda</Button>
          </Link>
          <Link href="/element-lab" passHref>
            <Button variant="ghost" className={`${textColor} ${hoverBgColor}`}>Element Lab</Button>
          </Link>
          <Link href="/curriculum-view" passHref>
            <Button variant="ghost" className={`${textColor} ${hoverBgColor}`}>              
              <BookOpen className="h-5 w-5 mr-2" />
              Curriculum
            </Button>
          </Link>
          <Link href="/curriculum-optimizer" passHref>
            <Button variant="ghost" className={`${textColor} ${hoverBgColor}`}>
              Curriculum Generator
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Notifications" className={`${textColor} ${hoverBgColor}`}><Bell className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" aria-label="Settings" className={`${textColor} ${hoverBgColor}`}><Settings className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" aria-label="Login" className={`${textColor} ${hoverBgColor}`}><LogIn className="h-5 w-5" /></Button>
          <Button variant="ghost" className={`hidden sm:inline-flex ${textColor} border-current ${hoverBgColor}`}>Upgrade Plan</Button>
        </div>
      </div>
    </header>
  );
};

export default KodaHeader;