import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SessionService } from '../src/services/sessionService';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../src/db/db';
import { nativeBridge } from '../src/native/nativeBridge';

export const FocusTimer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useLiveQuery(() => db.profile.get('current-user'));
  
  // Initialize state logic
  const getInitialState = () => {
     // 1. If strictly restoring from Guard or Reload (no navigation state), check localStorage
     const savedSessionStr = localStorage.getItem('focus_session');
     
     // Check if we are starting a NEW session explicitly (passed via navigation state)
     const isNewSession = location.state && !location.state.fromGuard;

     if (isNewSession) {
         // Start fresh, overwrite any stale session
         const initialState = {
             mode: 'focus', // default
             taskName: '',
             taskId: undefined, // Add taskId support
             targetMinutes: 0,
             accumulatedMinutes: 0,
             ...location.state
         };
         
         // If we have accumulatedMinutes, initialize seconds from there
         if (initialState.mode === 'task' && initialState.accumulatedMinutes) {
             initialState.seconds = initialState.accumulatedMinutes * 60;
         } else {
             initialState.seconds = 0;
         }

         return {
             ...initialState,
             startTime: new Date().toISOString(), // Record start time
             isActive: true, // Start active
         };
     }

     // Otherwise, try to restore session
     if (savedSessionStr) {
         const session = JSON.parse(savedSessionStr);
         const lastUpdatedAt = typeof session.lastUpdatedAt === 'number' ? session.lastUpdatedAt : Date.now();
         const isActiveRestored = !!session.isActive;
         const deltaSeconds = isActiveRestored ? Math.floor((Date.now() - lastUpdatedAt) / 1000) : 0;
         const restoredSeconds = Math.max(0, (session.seconds || 0) + deltaSeconds);
         return { ...session, seconds: restoredSeconds, isActive: isActiveRestored, minimized: false };
     }

     // Fallback (should rarely happen if flow is correct)
     return { 
         mode: 'focus', 
         taskName: '', 
         taskId: undefined,
         targetMinutes: 0, 
         seconds: 0, 
         startTime: new Date().toISOString(),
         isActive: true,
         ...location.state 
     };
  };

  const [state] = useState(getInitialState);
  
  // Lift state up to mutable variables to persist current values
  const [seconds, setSeconds] = useState(state.seconds);
  const [isActive, setIsActive] = useState(state.isActive);
  const startTimeRef = useRef(state.startTime);
  
  // Extract constants from initial state (they don't change during session)
  const { mode, taskName, taskId, targetMinutes } = state;

  // Hold Logic State
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<any>(null);
  const HOLD_DURATION = 5000; // 5 seconds

  const playAllowanceSeconds = Math.max(0, Math.floor((profile?.rewardBalance || 0) * 60));

  // Persistence Effect
  useEffect(() => {
     const sessionData = {
         mode,
         taskName,
         taskId,
         targetMinutes,
         seconds, // Current seconds
         startTime: startTimeRef.current,
         isActive,
         lastUpdatedAt: Date.now(),
         minimized: false
         // We don't save isActive as true; restoring always defaults to false (paused)
     };
     
     if (mode) {
        localStorage.setItem('focus_session', JSON.stringify(sessionData));
     }
  }, [seconds, mode, taskName, taskId, targetMinutes, isActive]);

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s: number) => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    if (mode !== 'play') return;
    if (!isActive) return;
    if (playAllowanceSeconds <= 0) return;
    if (playAllowanceSeconds - seconds <= 0) {
      setIsHolding(false);
      finishSession();
    }
  }, [isActive, mode, playAllowanceSeconds, seconds]);

  // Hold Logic Effect
  useEffect(() => {
    if (isHolding) {
      holdIntervalRef.current = setInterval(async () => {
        setHoldProgress(prev => {
           const newProgress = prev + (50 / HOLD_DURATION) * 100;
           if (newProgress >= 100) {
               clearInterval(holdIntervalRef.current);
               // Clean exit logic
               finishSession();
               return 100;
           }
           return newProgress;
        });
      }, 50);
    } else {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setHoldProgress(0);
    }
    
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [isHolding, navigate]);

  useEffect(() => {
    if (isActive) {
      nativeBridge.startTimer(mode as any, { taskId, targetMinutes, startTime: startTimeRef.current });
    }
  }, [isActive]);

  useEffect(() => {
    const sub = nativeBridge.onTick((data) => {
      if (!isActive) return;
      setSeconds(s => s + Math.round(data.deltaMs / 1000));
    });
    const fin = nativeBridge.onFinish(() => {
      setIsActive(false);
    });
    return () => {
      sub.remove();
      fin.remove();
    };
  }, [isActive]);

  const finishSession = async () => {
      // 1. Calculate final duration
      // Note: In a real app, calculate diff between Now and StartTime - PausedTime for accuracy
      // Here we trust 'seconds' for simplicity
      const finalSeconds = seconds;
      const durationMinutes = finalSeconds / 60;
      if (durationMinutes < 5) {
        if (mode === 'play') {
          await SessionService.recordSession({
            mode,
            durationMinutes,
            startTime: startTimeRef.current,
            endTime: new Date().toISOString(),
            status: 'completed',
            taskId
          });
        }
        localStorage.removeItem('focus_session');
        navigate('/home');
        return;
      }
      
      // 2. Determine Status
      let status: 'completed' | 'abandoned' = 'completed';
      if (mode === 'task' && durationMinutes < targetMinutes) {
          status = 'abandoned'; // Or just 'active' if we allow pausing?
          // For demo: if you hold-to-stop before target, it's abandoned/failed
      }

      // 3. Record to DB
      try { await nativeBridge.stopTimer(); } catch {}
      const result = await SessionService.recordSession({
          mode,
          durationMinutes,
          startTime: startTimeRef.current,
          endTime: new Date().toISOString(),
          status,
          taskId
      });

      // 4. Clear local persistence
      localStorage.removeItem('focus_session');

      // 5. Navigate to Result
      if (mode === 'play') {
         navigate('/home');
         return;
      }
      if (mode === 'task') {
         const initialAccumulated = state.accumulatedMinutes || 0;
         const totalAccumulated = Math.floor(initialAccumulated + durationMinutes);
         const isTaskFail = totalAccumulated < targetMinutes;
         if (isTaskFail) {
           navigate('/fail', {
             state: {
               mode,
               taskName,
               accumulatedMinutes: totalAccumulated,
               targetMinutes,
               taskId
             }
           });
         } else {
           navigate('/success', {
             state: {
               mode,
               duration: Math.floor(durationMinutes),
               reward: result.rewardChange
             }
           });
         }
         return;
      }
      navigate('/home');
  };

  const startHold = () => setIsHolding(true);
  
  const endHold = () => {
      setIsHolding(false);
      setHoldProgress(0);
  };

  const handleMinimize = () => {
      try {
        const savedSessionStr = localStorage.getItem('focus_session');
        if (savedSessionStr) {
          const session = JSON.parse(savedSessionStr);
          localStorage.setItem('focus_session', JSON.stringify({ ...session, minimized: true, isActive, lastUpdatedAt: Date.now() }));
        }
      } catch {}
      try { nativeBridge.minimizeApp(); } catch {}
      navigate('/home');
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(Math.abs(totalSeconds) / 3600);
    const mins = Math.floor((Math.abs(totalSeconds) % 3600) / 60);
    const secs = Math.abs(totalSeconds) % 60;
    const format = (num: number) => num.toString().padStart(2, '0');
    return { h: format(hrs), m: format(mins), s: format(secs) };
  };

  const displaySeconds = mode === 'play' ? Math.max(0, playAllowanceSeconds - seconds) : seconds;
  const time = formatTime(displaySeconds);

  // Focus Rewards
  const FOCUS_REWARD_INTERVAL = 25 * 60; 
  const REWARD_PER_INTERVAL = 5; 
  const earnedRewards = Math.floor(seconds / FOCUS_REWARD_INTERVAL) * REWARD_PER_INTERVAL;
  const secondsUntilNextReward = FOCUS_REWARD_INTERVAL - (seconds % FOCUS_REWARD_INTERVAL);
  const nextRewardMins = Math.ceil(secondsUntilNextReward / 60);

  // Task Progress Calculation
  const currentMinutes = Math.floor(seconds / 60);
  const taskProgress = targetMinutes > 0 ? Math.round((currentMinutes / targetMinutes) * 100) : 0;

  const renderInfoPill = () => {
    if (mode === 'task') {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-[#1a232d] border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
           <Icon name="flag" className="text-primary text-[20px]" filled />
           {/* Displaying accumulated and goal times as percentages/ratio */}
           <p className="text-slate-600 dark:text-[#92adc9] text-sm font-medium leading-normal tracking-wide">
             {currentMinutes}m / {targetMinutes}m • {taskProgress}%
           </p>
        </div>
      );
    } 
    if (mode === 'focus') {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-[#1a232d] border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
           <Icon name="stars" className="text-yellow-500 text-[20px]" filled />
           <p className="text-slate-600 dark:text-[#92adc9] text-sm font-medium leading-normal tracking-wide">
             +{earnedRewards}m earned (Next in {nextRewardMins}m)
           </p>
        </div>
      );
    }
    // Play Mode
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-[#1a232d] border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
           <Icon name="timelapse" className="text-orange-500 text-[20px]" filled />
           <p className="text-slate-600 dark:text-[#92adc9] text-sm font-medium leading-normal tracking-wide">
             Remaining Play Time
           </p>
        </div>
    );
  };

  const renderIncentiveMessage = () => {
    if (mode === 'focus') {
        return <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 animate-pulse">Stay focused to earn more play time.</p>;
    }
    if (mode === 'task') {
        return <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 font-medium">{taskName}</p>;
    }
    return null;
  };

  // Button Labels & Colors
  const isPlayMode = mode === 'play';
  const isTaskMode = mode === 'task';
  
  let stopButtonText = "Stop Focus";
  if (isPlayMode) stopButtonText = "Stop Playing";
  if (isTaskMode) stopButtonText = "Stop Task";

  const pauseButtonText = isActive ? "Pause" : "Continue";
  const pauseIcon = isActive ? "pause" : "play_arrow";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white h-full w-full flex flex-col relative antialiased overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${mode === 'play' ? 'bg-orange-500/5 dark:bg-orange-500/10' : 'bg-primary/5 dark:bg-primary/10'} rounded-full blur-[120px]`}></div>
      </div>

      {/* Dev Navigation Overlay (Hidden in prod) */}
      <div className="absolute top-4 left-4 z-50 flex gap-2 opacity-0 hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-lg">
        <button onClick={() => navigate('/block')} className="text-xs bg-white text-black px-2 py-1 rounded">Block</button>
        <button onClick={() => navigate('/rest')} className="text-xs bg-white text-black px-2 py-1 rounded">Rest</button>
      </div>

      <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto px-6 pb-8 justify-between">
         <div className="flex-none h-12 w-full flex justify-end items-center">
            {/* Space for future controls */}
         </div>

         {/* Central Timer */}
         <div className="flex flex-col items-center justify-center flex-grow -mt-16 space-y-4">
            <div className="relative">
              <h1 className="text-7xl sm:text-8xl font-thin tracking-tighter tabular-nums text-slate-900 dark:text-white flex items-baseline select-none drop-shadow-2xl">
                <span>{time.h}</span>
                <span className={`animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] mx-1 relative -top-1 ${mode === 'play' ? 'text-orange-500' : 'text-primary'} ${!isActive ? 'opacity-30' : ''}`}>:</span>
                <span>{time.m}</span>
                <span className={`animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] mx-1 relative -top-1 ${mode === 'play' ? 'text-orange-500' : 'text-primary'} ${!isActive ? 'opacity-30' : ''}`}>:</span>
                <span>{time.s}</span>
              </h1>
              <div className={`absolute -inset-4 ${mode === 'play' ? 'bg-orange-500/5' : 'bg-primary/5'} blur-xl rounded-full -z-10 dark:opacity-50`}></div>
            </div>

            {renderInfoPill()}
            {renderIncentiveMessage()}
         </div>

         {/* Bottom Controls */}
         <div className="flex flex-col w-full gap-6 items-center">
            <div className="flex items-stretch gap-4 w-full">
               <button 
                onClick={handleMinimize}
                aria-label="Minimize" 
                className="flex items-center justify-center w-16 h-16 flex-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 dark:text-slate-400 hover:border-primary/50 hover:text-primary dark:hover:border-primary/50 dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 group"
               >
                 <Icon name="expand_more" className="text-3xl group-hover:scale-110 transition-transform" />
               </button>
               
               {/* Primary Pause/Continue Button */}
               <button 
                 onClick={() => setIsActive(!isActive)}
                 className={`flex-1 flex items-center justify-center gap-2 h-16 px-6 ${isPlayMode ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25' : 'bg-primary hover:bg-blue-600 shadow-primary/25'} text-white rounded-2xl shadow-lg transition-all duration-200 transform active:scale-[0.98] group`}
               >
                 <Icon name={pauseIcon} className="text-2xl group-hover:scale-110 transition-transform" />
                 <span className="text-lg font-bold tracking-wide">{pauseButtonText}</span>
               </button>
            </div>

            {/* Hold to Stop Button */}
            <div className="relative w-full flex flex-col items-center">
                {/* Hold Tooltip */}
                <div className={`absolute -top-7 flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 transition-opacity duration-300 ${isHolding || holdProgress > 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <Icon name="lock_clock" size={16} />
                    <span>Hold 5s to exit</span>
                </div>

                <button 
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                onTouchCancel={endHold}
                className="relative overflow-hidden flex items-center justify-center h-12 w-full max-w-[200px] rounded-xl bg-transparent border-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 font-bold tracking-wider uppercase transition-all duration-300 select-none active:scale-95"
                >
                    <div 
                        className="absolute left-0 bottom-0 top-0 bg-slate-200 dark:bg-slate-700/50 transition-all ease-linear"
                        style={{ width: `${holdProgress}%`, opacity: 0.3 }}
                    ></div>
                    <span className="relative z-10">{stopButtonText}</span>
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};
