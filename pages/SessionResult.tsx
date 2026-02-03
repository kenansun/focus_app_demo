import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const SessionResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSuccess = location.pathname.includes('success');
  const state = location.state || {};

  // Extract dynamic data with fallbacks
  const { 
      duration = 0, 
      reward = 0, 
      accumulatedMinutes = 0, 
      targetMinutes = 0,
      taskName = 'Session' 
  } = state;

  if (isSuccess) {
    return (
      <div className="font-display bg-slate-900 h-full w-full overflow-hidden flex items-center justify-center relative">
         <div className="absolute inset-0 z-0 bg-slate-900">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"></div>
            {/* Background image placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black opacity-50"></div>
         </div>

         <div className="relative z-20 w-full max-w-[360px] mx-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
            {/* Confetti simulation using CSS */}
            <div className="absolute -top-12 -left-4 w-full h-32 pointer-events-none overflow-visible">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute w-2 h-2 rounded bg-yellow-400" 
                     style={{
                       top: `${Math.random() * 50}%`,
                       left: `${Math.random() * 100}%`,
                       transform: `rotate(${Math.random() * 360}deg)`,
                       backgroundColor: ['#f4c025', '#ef4444', '#3b82f6', '#10b981'][i%4]
                     }}></div>
              ))}
            </div>

            <div className="flex flex-col bg-background-light dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
               <div className="pt-10 pb-4 px-6 text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-4 shadow-inner ring-4 ring-primary/10">
                     <span className="text-5xl drop-shadow-sm">🎉</span>
                  </div>
                  <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-extrabold leading-tight mb-1">Great Job!</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Session completed successfully</p>
               </div>

               <div className="px-6 py-2">
                  <div className="flex flex-col sm:flex-row gap-4 p-5 bg-primary/10 border border-primary/30 rounded-xl relative overflow-hidden">
                     <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 blur-2xl rounded-full"></div>
                     <div className="flex flex-1 flex-col gap-1 items-center sm:items-start text-center sm:text-left relative z-10">
                        <div className="flex items-center gap-1.5 text-slate-900 dark:text-gray-100 opacity-70 mb-1">
                           <Icon name="timer" className="text-lg" />
                           <p className="text-xs font-semibold uppercase tracking-wider">Focus Duration</p>
                        </div>
                        <p className="text-slate-900 dark:text-white text-3xl font-bold leading-none tracking-tight">{duration} <span className="text-base font-medium opacity-60">min</span></p>
                     </div>
                     <div className="w-full h-px bg-primary/20 sm:w-px sm:h-auto"></div>
                     <div className="flex flex-1 flex-col gap-1 items-center sm:items-start text-center sm:text-left relative z-10">
                        <div className="flex items-center gap-1.5 text-slate-900 dark:text-gray-100 opacity-70 mb-1">
                           <Icon name="stars" className="text-lg" />
                           <p className="text-xs font-semibold uppercase tracking-wider">Rewards</p>
                        </div>
                        <p className="text-primary text-3xl font-bold leading-none tracking-tight">+{reward} <span className="text-base font-medium opacity-60 text-slate-900 dark:text-white">min</span></p>
                     </div>
                  </div>
               </div>
               
               <div className="px-6 pb-8 pt-6">
                  <button onClick={() => navigate('/home')} className="w-full relative overflow-hidden rounded-xl h-14 bg-primary hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center group shadow-lg shadow-primary/20 text-slate-900 text-lg font-bold tracking-wide">
                     Back to Home
                  </button>
                  <button onClick={() => navigate('/history')} className="mt-4 w-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-medium transition-colors">View detailed stats</button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // Failed State
  const progressPercent = targetMinutes > 0 ? Math.min(100, Math.round((accumulatedMinutes / targetMinutes) * 100)) : 0;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white h-full w-full flex flex-col items-center px-6 pt-12 pb-4">
       <div className="flex items-center w-full justify-between mb-8">
          <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
             <Icon name="close" />
          </button>
          <h2 className="text-lg font-bold">Session Summary</h2>
          <div className="w-10"></div>
       </div>

       <div className="flex flex-col items-center mb-8 animate-in zoom-in duration-300">
          <div className="text-[64px] leading-none mb-4 select-none">😐</div>
          <h1 className="text-3xl font-bold mb-2">Keep Going</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs">You stopped early, but every minute counts.</p>
       </div>

       <div className="w-full max-w-[480px] bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
          <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{taskName}</p>
                <div className="flex items-baseline gap-2 mt-1">
                   <span className="text-3xl font-bold">{accumulatedMinutes} min</span>
                   <span className="text-slate-500 text-sm font-medium">/ {targetMinutes} min</span>
                </div>
             </div>
             <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                <Icon name="warning" className="text-red-500 text-xs" />
                <span className="text-red-500 text-xs font-bold">Goal not met</span>
             </div>
          </div>
          <div className="flex flex-col gap-2">
             <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${progressPercent}%` }}
                ></div>
             </div>
             <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>0m</span>
                <span>{progressPercent}% Complete</span>
                <span>{targetMinutes}m</span>
             </div>
          </div>
       </div>

       <div className="flex w-full max-w-[480px] flex-col gap-3 mt-auto">
          <button onClick={() => navigate('/focus', { state: { mode: 'task', taskName, targetMinutes, accumulatedMinutes } })} className="w-full h-14 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-500/20">Try Again</button>
          <button onClick={() => navigate('/home')} className="w-full h-14 rounded-xl bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-primary font-bold text-base">Back to Home</button>
       </div>
    </div>
  );
};