import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Bell, Settings, LogIn, Search, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface AnimalButtonProps {
  name: string;
  subject: string;
  bgColor: string;
  lightBgColor: string;
  boxShadowColor: string;
}

const AnimalButton: React.FC<AnimalButtonProps> = ({ name, subject, bgColor, lightBgColor, boxShadowColor }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/${name.toLowerCase()}`} className={`card ${subject.toLowerCase()} transition-all duration-300 hover:scale-105`} style={{
          '--bg-color': bgColor,
          '--bg-color-light': lightBgColor,
          '--box-shadow-color': boxShadowColor
        } as React.CSSProperties}>
          <div className="overlay"></div>
          <div className="circle">
            <div className="w-32 h-32 overflow-hidden relative">
              <Image 
                src={`/animals/${name.toLowerCase()}.png`} 
                alt={name} 
                layout="fill"
                objectFit="contain"
                className="z-10"
              />
            </div>
          </div>
          <p className="font-bold text-lg mt-4">{name}</p>
          <p className="text-sm font-medium text-gray-600">{subject}</p>
          </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>Learn {subject} with {name}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// border-b-4
export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/general-chat?q=${encodeURIComponent(query)}`);
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0" style={{backgroundImage: "url('/17.png')"}}></div>
      <div className="relative z-10">
        <header className="relative p-2"> 
          <div className="relative z-10 flex justify-between items-center">
            <Link href="/" className="text-4xl font-bold text-white animate-fade-in ml-2" style={{ fontFamily: 'var(--font-bungee-spice)', letterSpacing: '+0.0001em' }}>
              <span style={{ letterSpacing: 'inherit' }}>
                K
              </span>
              <Image 
                src="/e1.png" 
                alt="Globe" 
                width={55} 
                height={40} 
                className="inline-block align-middle" 
                style={{ marginLeft: '-0.26em', marginRight: '-0.24em' }} 
              />
              <span style={{ letterSpacing: 'inherit' }}>
                DA
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" aria-label="Notifications" className="text-black hover:bg-black/20"><Bell className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" aria-label="Settings" className="text-black hover:bg-black/20"><Settings className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" aria-label="Login" className="text-black hover:bg-black/20"><LogIn className="h-5 w-5" /></Button>
              <Button variant="ghost" className="hidden sm:inline-flex text-black border-white hover:bg-black/20">Upgrade Plan</Button>
              {/* <Button variant="ghost" size="icon" aria-label="Home" className="text-white hover:bg-white/20"><Home className="h-5 w-5" /></Button> */}
            </div>
          </div>
        </header>        
        <main className="container mx-auto px-4 mt-12">
          <div className="text-center mb-12">
            <h1 className="text-8xl font-bold mb-4 text-white animate-fade-in" style={{ fontFamily: 'var(--font-bungee-spice)', letterSpacing: '+0.001em' }}>
              <span style={{ letterSpacing: 'inherit' }}>
                K
              </span>
              <Image 
                src="/e1.png" 
                alt="Globe" 
                width={140} 
                height={100} 
                className="inline-block align-middle" 
                style={{ marginLeft: '-0.28em', marginRight: '-0.25em' }} 
              />
              <span style={{ letterSpacing: 'inherit' }}>
                DA
              </span>
            </h1>
            {/* <p className="text-3xl text-orange" style={{ fontFamily: 'var(--font-londrina-shadow)' }}>Choose your friend!</p> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <AnimalButton name="Wake" subject="Music" bgColor="#B8F9D3" lightBgColor="#e2fced" boxShadowColor="rgba(184, 249, 211, 0.48)" />
            <AnimalButton name="Levo" subject="Science" bgColor="#ffd861" lightBgColor="#ffeeba" boxShadowColor="rgba(255, 215, 97, 0.48)" />
            <AnimalButton name="Mina" subject="Geography" bgColor="#CEB2FC" lightBgColor="#F0E7FF" boxShadowColor="rgba(206, 178, 252, 0.48)" />
            <AnimalButton name="Ella" subject="History" bgColor="#DCE9FF" lightBgColor="#f1f7ff" boxShadowColor="rgba(220, 233, 255, 0.48)" />
          </div>
          <Card className="max-w-3xl mx-auto p-6 shadow-lg bg-white bg-opacity-90">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text"
                placeholder="What do you want to learn today?"
                className="pl-10 pr-4 py-3 text-lg rounded-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>
        </Card>
        </main>
      </div>
    </div>
  );
}