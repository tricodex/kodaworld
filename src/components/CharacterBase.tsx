'use client';

import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Bell, Settings, LogIn, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import KodaHeader from './KodaHeader';

interface Activity {
  name: string;
  action: () => void;
}

interface CharacterBaseProps {
  backgroundImage?: string;
  videoBackground?: string;
  characterName: string;
  subject: string;
  chatDescription: string;
  activities: Activity[];
  progressTitle: string;
  children: ReactNode;
  onSendMessage: () => void;
  onStartRecording: () => void;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  recordMode: boolean;
}

export default function CharacterBase({
  backgroundImage,
  videoBackground,
  characterName,
  subject,
  chatDescription,
  activities,
  progressTitle,
  children,
  onSendMessage,
  onStartRecording,
  inputMessage,
  setInputMessage,
  recordMode
}: CharacterBaseProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0" style={{backgroundImage: `url('${backgroundImage}')`}}></div>
      {videoBackground && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={videoBackground} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="relative z-10">
        <header className="relative p-2">
        <KodaHeader />
        </header>
        
        <main className="container mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
                <div className="flex items-center mb-4">
                  <Image 
                    src={`/animals/${characterName.toLowerCase()}.png`}
                    alt={characterName}
                    width={80}
                    height={80}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-londrina-shadow)' }}>{subject} with {characterName}</h2>
                    <p className="text-gray-600">Your personal {subject.toLowerCase()} tutor</p>
                  </div>
                </div>
                <div
                  id="messages"
                  className="flex flex-col h-96 space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                >
                  {children}
                </div>
                <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                  <div className="relative flex">
                    <span className="absolute inset-y-0 flex items-center">
                      <button
                        onClick={onStartRecording}
                        type="button"
                        title="Start Recording"
                        className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className={`h-6 w-6 ${recordMode ? 'text-red-600' : 'text-gray-600'}`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          ></path>
                        </svg>
                      </button>
                    </span>
                    <input
                      type="text"
                      placeholder="Write your message!"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          onSendMessage();
                        }
                      }}
                      className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                    />
                    <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                      <button
                        onClick={onSendMessage}
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                      >
                        <span className="font-bold">Send</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-6 w-6 ml-2 transform rotate-90"
                        >
                          <path
                            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-londrina-shadow)' }}>{subject} Activities</h3>
                <div className="space-y-2">
                  {activities.map((activity, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full bg-opacity-80 hover:bg-opacity-100 transition-all duration-300"
                            onClick={activity.action}
                          >
                            {activity.name}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Start {activity.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </Card>
              
              <Card className="p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-londrina-shadow)' }}>{progressTitle}</h3>
                <p className="text-gray-600">Track your progress in {subject.toLowerCase()} here.</p>
                <div className="mt-4 h-4 bg-gray-200 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}