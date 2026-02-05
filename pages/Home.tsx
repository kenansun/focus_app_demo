import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../src/db/db';
import { SessionService } from '../src/services/sessionService';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Live Queries for real-time updates
  const profile = useLiveQuery(() => db.profile.get('current-user'));
  const settings = useLiveQuery(() => db.settings.get('global-settings'));
  const todayFocusMinutes = useLiveQuery(() => SessionService.getTodayFocusMinutes());

  // Format time (minutes) to HH:MM
  const formatTime = (minutes: number = 0) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const todayGoal = settings?.dailyGoalMinutes || 240; 
  const progressPercent = Math.min(100, Math.round(((todayFocusMinutes || 0) / todayGoal) * 100));
  const goalHours = Math.floor(todayGoal / 60);
  const goalMins = todayGoal % 60;
  const canPlay = (profile?.rewardBalance || 0) > 0;

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white dark:border-slate-700 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'User'}`} alt="Avatar" className="w-full h-full" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Good Morning,</p>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{profile?.username || 'User'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => navigate('/history')}
             className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
             title="View History"
           >
             <Icon name="history" className="text-slate-600 dark:text-slate-300" />
           </button>
           <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
             <Icon name="notifications" className="text-slate-600 dark:text-slate-300" filled />
             <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
           </button>
        </div>
      </header>

      {/* Main Stats Card */}
      <section className="px-6 mb-6">
        <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="timer" className="text-primary text-xl" filled />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Today's Focus</span>
          </div>
          <div className="mb-1">
            <span className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
              {formatTime(todayFocusMinutes)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">Goal: {goalHours}h {goalMins > 0 ? `${goalMins}m` : '00m'}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
             <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Reward Balance</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{Number((profile?.rewardBalance ?? 0)).toFixed(1)} min</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
               <Icon name="card_giftcard" className="text-xl" />
             </div>
          </div>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="px-6 mb-6 grid grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('/focus', { state: { mode: 'focus' } })}
          className="bg-[#118ab2] rounded-3xl p-5 text-white h-48 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all"></div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Icon name="shield_lock" className="text-2xl" filled />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-1">Focus Mode</h3>
            <p className="text-xs text-white/80 leading-relaxed">Earn time by blocking apps</p>
          </div>
        </div>

        <div 
          onClick={canPlay ? () => navigate('/focus', { state: { mode: 'play' } }) : undefined}
          aria-disabled={!canPlay}
          className={`rounded-3xl p-5 text-white h-48 flex flex-col justify-between relative overflow-hidden group transition-opacity ${
            canPlay 
              ? 'bg-[#f4c025] cursor-pointer hover:opacity-90' 
              : 'bg-slate-300 cursor-not-allowed opacity-60 grayscale'
          }`}
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all"></div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Icon name="sports_esports" className="text-2xl" filled />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-1">Play Mode</h3>
            <p className="text-xs text-white/80 leading-relaxed">{Number((profile?.rewardBalance ?? 0)).toFixed(1)} mins available</p>
          </div>
        </div>
      </section>

      {/* Daily Goal Widget (Static for now, could be dynamic later) */}
      <section className="px-6 mb-6">
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
               <Icon name="flag" className="text-purple-500" filled />
               <span className="font-bold text-slate-900 dark:text-white">Daily Goal</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Reach 4 hours of focus time today.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md font-medium">Focus</span>
              <span className="text-xs text-slate-400">Ends 11:59 PM</span>
            </div>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path 
                  className="text-purple-500 transition-all duration-1000" 
                  strokeDasharray={`${progressPercent}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                />
             </svg>
             <span className="absolute text-xs font-bold text-purple-500">{progressPercent}%</span>
          </div>
        </div>
      </section>

      {/* Mini Stats (Mock for now) */}
      <section className="px-6 grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
           <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <Icon name="trending_up" />
           </div>
           <div>
              <p className="text-xs text-slate-500">Total Focus</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {(() => {
                  const total = profile?.totalFocusTime ?? 0;
                  const h = Math.floor(total / 60);
                  let m = Number((total - h * 60).toFixed(1));
                  let hh = h;
                  if (m >= 60) { hh += 1; m = 0.0; }
                  return `${hh}h ${m.toFixed(1)}m`;
                })()}
              </p>
           </div>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
           <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Icon name="local_fire_department" />
           </div>
           <div>
              <p className="text-xs text-slate-500">Streak</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{profile?.streakDays || 0} days</p>
           </div>
        </div>
      </section>
    </div>
  );
};
