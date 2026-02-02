import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const FocusTimer: React.FC = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // Handle simulations links
  useEffect(() => {
     // Simulate occasional overlays for demo purposes, 
     // but in a real app these would be triggered by events.
     // For this UI demo, we will use buttons to navigate to them.
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    // Format to HH:MM:SS
    const format = (num: number) => num.toString().padStart(2, '0');
    return { h: format(hrs), m: format(mins), s: format(secs) };
  };

  const time = formatTime(1415 + seconds); // Start from ~23:15 for demo

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white h-full w-full flex flex-col relative antialiased overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Dev Navigation Overlay (Hidden in prod, useful for demo to access simulations) */}
      <div className="absolute top-4 left-4 z-50 flex gap-2 opacity-0 hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-lg">
        <button onClick={() => navigate('/block')} className="text-xs bg-white text-black px-2 py-1 rounded">Block Screen</button>
        <button onClick={() => navigate('/rest')} className="text-xs bg-white text-black px-2 py-1 rounded">Rest</button>
        <button onClick={() => navigate('/eyecare')} className="text-xs bg-white text-black px-2 py-1 rounded">Eye</button>
        <button onClick={() => navigate('/simulation')} className="text-xs bg-white text-black px-2 py-1 rounded">Bubble</button>
      </div>

      <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto px-6 pb-8 justify-between">
         <div className="flex-none h-12 w-full flex justify-end items-center">
            {/* Settings or Minimize could go here */}
         </div>

         {/* Central Timer */}
         <div className="flex flex-col items-center justify-center flex-grow -mt-16 space-y-8">
            <div className="relative">
              <h1 className="text-7xl sm:text-8xl font-thin tracking-tighter tabular-nums text-slate-900 dark:text-white flex items-baseline select-none drop-shadow-2xl">
                <span>{time.h}</span>
                <span className="animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] mx-1 relative -top-1 text-primary">:</span>
                <span>{time.m}</span>
                <span className="animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] mx-1 relative -top-1 text-primary">:</span>
                <span>{time.s}</span>
              </h1>
              <div className="absolute -inset-4 bg-primary/5 blur-xl rounded-full -z-10 dark:opacity-50"></div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-[#1a232d] border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
               <Icon name="flag" className="text-primary text-[20px]" filled />
               <p className="text-slate-600 dark:text-[#92adc9] text-sm font-medium leading-normal tracking-wide">Goal &gt; 30 min</p>
            </div>
         </div>

         {/* Bottom Controls */}
         <div className="flex flex-col w-full gap-5 items-center">
            <div className="flex items-stretch gap-4 w-full">
               <button 
                onClick={() => navigate('/home')}
                aria-label="Return to Desktop" 
                className="flex items-center justify-center w-16 h-16 flex-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 dark:text-slate-400 hover:border-primary/50 hover:text-primary dark:hover:border-primary/50 dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 group"
               >
                 <Icon name="expand_more" className="text-3xl group-hover:scale-110 transition-transform" />
               </button>
               <button 
                 onClick={() => navigate('/success')}
                 className="flex-1 flex items-center justify-center gap-2 h-16 px-6 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white rounded-2xl shadow-lg shadow-primary/25 transition-all duration-200 transform active:scale-[0.98] group"
               >
                 <Icon name="check_circle" className="text-2xl group-hover:rotate-12 transition-transform" />
                 <span className="text-lg font-bold tracking-wide">Complete</span>
               </button>
            </div>
            <button 
              onClick={() => navigate('/fail')}
              className="flex items-center justify-center h-10 px-6 bg-transparent text-slate-400 dark:text-slate-600 hover:text-danger dark:hover:text-red-400 text-sm font-bold tracking-wider uppercase transition-colors duration-300"
            >
                Give Up
            </button>
         </div>
      </div>
    </div>
  );
};