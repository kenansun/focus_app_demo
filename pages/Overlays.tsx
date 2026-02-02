import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

// Mock Component for Overlay backgrounds
const MockBackground = () => (
  <div className="absolute inset-0 bg-cover bg-center filter blur-sm opacity-50 dark:opacity-30 scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")' }}></div>
);

export const BlockScreen: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      <MockBackground />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between backdrop-blur-xl bg-background-light/90 dark:bg-background-dark/95 p-6 animate-in fade-in duration-300">
         <div className="mt-8 flex flex-col items-center animate-pulse">
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary dark:text-blue-400">
               <Icon name="bolt" size={18} />
               <span>Focus Mode Active</span>
            </div>
         </div>
         <div className="flex flex-col items-center justify-center w-full max-w-sm text-center">
            <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 shadow-inner">
               <Icon name="lock" className="text-[80px] text-primary" />
            </div>
            <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-extrabold leading-tight mb-2">Stay Focused</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed px-4">
               <span className="font-semibold text-slate-800 dark:text-slate-200">Instagram</span> is not in your current whitelist. Don't break your streak now!
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-slate-500">
               <Icon name="local_fire_department" className="text-orange-400 text-[20px] filled" />
               <span>12 day streak at risk</span>
            </div>
         </div>
         <div className="mb-6 flex w-full max-w-sm flex-col gap-4">
            <button onClick={() => navigate(-1)} className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 bg-primary text-white text-lg font-bold shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-transform">
               <Icon name="arrow_back" className="mr-2" /> OK, Go Back
            </button>
            <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-5 text-slate-400 hover:text-slate-600 font-medium">Emergency Use</button>
         </div>
      </div>
    </div>
  );
};

export const RestReminder: React.FC = () => {
   const navigate = useNavigate();
   return (
      <div className="relative h-full w-full bg-black">
         {/* Dimmed Background */}
         <div className="absolute inset-0 w-full h-full opacity-30 filter blur-[2px] pointer-events-none">
            <div className="flex items-center justify-between p-6 pt-12 bg-white dark:bg-[#1a160c]">
               <Icon name="menu" />
               <h1 className="text-lg font-bold">Daily Focus</h1>
               <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-xl h-40"></div>
               <div className="bg-white p-4 rounded-xl h-40"></div>
            </div>
         </div>
         <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-[1px]"></div>
         
         <div className="absolute top-0 left-0 w-full z-50 px-4 pt-4 pb-6 flex flex-col items-center">
            <div className="h-8 w-full"></div>
            <div className="w-full max-w-sm bg-white dark:bg-[#2a2415] rounded-xl shadow-2xl border-l-8 border-yellow-500 overflow-hidden relative animate-in slide-in-from-top-10 duration-500">
               <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700"><div className="h-full bg-yellow-500 w-2/3"></div></div>
               <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-600">
                        <Icon name="warning" className="text-[24px]" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                           <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Rest Reminder</h2>
                           <span className="text-yellow-600 font-bold text-lg font-mono">00:30</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">Your eyes need a break. Screen locking shortly.</p>
                     </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                     <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Icon name="lock_clock" size={16} /> <span>Auto-lock enabled</span>
                     </div>
                     <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 rounded-lg text-sm font-semibold transition-colors">
                        <Icon name="snooze" size={18} /> +1 min snooze
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export const EyeCare: React.FC = () => {
   const navigate = useNavigate();
   return (
      <div className="relative flex h-full w-full flex-col items-center justify-between bg-gradient-to-b from-[#050a06] via-[#0a160e] to-[#0f2a1b] overflow-hidden text-white">
         <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div className="w-[150vw] h-[150vw] bg-green-500/5 rounded-full blur-[100px] opacity-20"></div>
         </div>
         <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10">
            <div className="absolute flex items-center justify-center">
               <div className="w-72 h-72 rounded-full border border-green-500/20 animate-breathe"></div>
               <div className="absolute w-64 h-64 rounded-full bg-green-500/10 blur-2xl animate-breathe" style={{ animationDelay: '0.5s' }}></div>
               <div className="absolute w-56 h-56 rounded-full border border-green-500/10 animate-breathe" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <div className="relative z-20 flex flex-col items-center justify-center gap-4">
               <h1 className="text-[56px] font-thin font-mono leading-none drop-shadow-[0_0_15px_rgba(15,189,73,0.3)]">05:00</h1>
               <p className="text-white/60 text-sm font-normal tracking-wide text-center animate-pulse">Breathe in...</p>
            </div>
         </div>
         <div className="w-full flex flex-col items-center justify-end pb-12 z-20 gap-6">
            <p className="text-white/40 text-xs text-center px-6 max-w-xs leading-relaxed">Rest your eyes. Look away from the screen effectively by focusing on a distant object.</p>
            <button onClick={() => navigate('/focus')} className="group relative flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 active:scale-95 transition-all">
               <Icon name="lock_open" className="text-white/70 group-hover:text-white" size={20} />
               <span className="text-xs font-medium text-white/70 uppercase tracking-widest group-hover:text-white">Emergency Unlock</span>
            </button>
         </div>
      </div>
   );
};

export const FloatingBubble: React.FC = () => {
   const navigate = useNavigate();
   return (
     <div className="h-full w-full bg-black relative overflow-hidden flex items-center justify-center">
        {/* Simulate Phone Wallpaper */}
        <div className="absolute inset-0 bg-cover bg-center brightness-[0.7] blur-[1px]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAS0CgtFBkKhkh47gJOh7RvBZlP0DNccnCqhmdNFHT8Qp3SWcFhDcMrDRLOBuZEpcI-tmjeUNyuRGe2b3LYOdcVLLvuPsu2KYSw6h5VUuHyjq-oN0Rsp18cI18TU1BPyoJ7lzKnqBWp9zZ4HIdbAKwUFKPb0S9sMztOIZ7DUQbC-yrTesOfnvPupGekqYaeflVP9vK9ohGXq8DVv7PRge3dxMNwTol_TaPoNsUmLWOvCsgX4eXFWC4ncHQE5bLfR5vVu9sn98N-AY4")' }}></div>
        
        {/* Mock Icons blurred */}
        <div className="absolute inset-0 z-10 grid grid-cols-4 gap-4 p-6 content-start opacity-50 blur-sm pointer-events-none">
           {[...Array(16)].map((_, i) => <div key={i} className="w-14 h-14 rounded-2xl bg-white/20"></div>)}
        </div>

        {/* The Radial Menu Overlay */}
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
           <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Satellite Buttons */}
              <button className="absolute top-0 left-4 transform translate-y-8 w-16 h-16 rounded-full bg-[#1c2a38] border border-white/10 text-red-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform" onClick={() => navigate('/focus')}>
                 <Icon name="square" filled size={24} />
              </button>
              <button className="absolute top-0 right-4 transform translate-y-8 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                 <Icon name="pause" size={32} />
              </button>
              <button className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-4 w-14 h-14 rounded-full bg-[#1c2a38] border border-white/10 text-white/60 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                 <Icon name="expand_more" size={32} />
              </button>

              {/* Central Hub */}
              <div className="w-48 h-48 rounded-full bg-[#101922] border-4 border-[#1c2a38] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden z-20">
                 <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                 <Icon name="timelapse" className="text-primary/80 mb-1 text-2xl" />
                 <div className="flex items-baseline text-white">
                    <span className="text-5xl font-bold tracking-tighter">24</span>
                    <span className="text-2xl font-bold opacity-50 mx-0.5">:</span>
                    <span className="text-5xl font-bold tracking-tighter">59</span>
                 </div>
                 <p className="text-primary font-medium text-[10px] mt-1 uppercase tracking-widest">Focus Mode</p>
              </div>
           </div>
           <p className="absolute bottom-12 text-white/30 text-sm font-medium animate-pulse">Tap timer to minimize</p>
        </div>
     </div>
   );
};