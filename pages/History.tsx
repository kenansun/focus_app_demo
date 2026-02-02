import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const History: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header */}
      <div className="flex items-center bg-background-light/95 dark:bg-background-dark/95 p-4 pb-3 justify-between sticky top-0 z-50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50">
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95 duration-200"
        >
          <Icon name="arrow_back" className="text-[24px]" />
        </button>
        <h2 className="text-slate-900 dark:text-white text-[17px] font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Focus History
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="px-5 py-4 bg-background-light dark:bg-background-dark z-40 shrink-0">
        <div className="grid grid-cols-5 gap-3">
          {/* Date Range Selector */}
          <div className="col-span-3 flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1">Date Range</label>
            <div className="group flex items-center w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 h-12 shadow-sm transition-all hover:border-primary/50 cursor-pointer">
              <Icon name="calendar_month" className="text-primary text-[20px] mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-[13px] font-medium text-slate-900 dark:text-white truncate">Oct 24 - Oct 30</span>
            </div>
          </div>
          {/* Mode Selector */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1">Mode</label>
            <div className="group flex items-center w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 h-12 shadow-sm cursor-pointer hover:border-primary/50 transition-all">
              <span className="text-[13px] font-medium text-slate-900 dark:text-white flex-1 truncate pl-1">All</span>
              <Icon name="arrow_drop_down" className="text-slate-400 text-[22px] group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 flex flex-col gap-3 px-5 pb-24 overflow-y-auto no-scrollbar">
        {/* Section Header */}
        <div className="flex items-center gap-2 mt-2 mb-1 opacity-60">
          <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today</h3>
          <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
        </div>

        {/* Item 1: Type A (Efficiency) */}
        <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 shrink-0 size-12 text-primary group-hover:scale-105 transition-transform duration-300">
                <Icon name="schedule" className="text-[26px]" />
              </div>
              <div className="flex flex-col justify-center pt-0.5">
                <p className="text-slate-900 dark:text-white text-[15px] font-bold leading-tight group-hover:text-primary transition-colors">45m Focus</p>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[13px] mt-1 font-medium">
                  <span>Efficiency Mode</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/10 shadow-sm">
                +5m Reward
              </span>
              <p className="text-slate-400 text-[11px] font-medium">09:30 AM</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-2 mt-4 mb-1 opacity-60">
          <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Yesterday</h3>
          <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
        </div>

        {/* Item 2: Type B (Task) */}
        <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700/50 shrink-0 size-12 text-slate-600 dark:text-slate-300 group-hover:scale-105 transition-transform duration-300">
                <Icon name="track_changes" className="text-[26px]" />
              </div>
              <div className="flex flex-col justify-center pt-0.5">
                <p className="text-slate-900 dark:text-white text-[15px] font-bold leading-tight group-hover:text-primary transition-colors">Math Study</p>
                <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-1 font-normal">Goal: 30m / Actual: 35m</p>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
                Success
              </span>
              <p className="text-slate-400 text-[11px] font-medium">02:00 PM</p>
            </div>
          </div>
        </div>

        {/* Item 3: Type A (Efficiency) */}
        <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 shrink-0 size-12 text-primary group-hover:scale-105 transition-transform duration-300">
                <Icon name="schedule" className="text-[26px]" />
              </div>
              <div className="flex flex-col justify-center pt-0.5">
                <p className="text-slate-900 dark:text-white text-[15px] font-bold leading-tight group-hover:text-primary transition-colors">30m Focus</p>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[13px] mt-1 font-medium">
                  <span>Efficiency Mode</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/10 shadow-sm">
                +5m Reward
              </span>
              <p className="text-slate-400 text-[11px] font-medium">10:00 AM</p>
            </div>
          </div>
        </div>

        {/* Item 4: Type B (Task - Variation) */}
        <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700/50 shrink-0 size-12 text-slate-600 dark:text-slate-300 group-hover:scale-105 transition-transform duration-300">
                <Icon name="track_changes" className="text-[26px]" />
              </div>
              <div className="flex flex-col justify-center pt-0.5">
                <p className="text-slate-900 dark:text-white text-[15px] font-bold leading-tight group-hover:text-primary transition-colors">Reading</p>
                <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-1 font-normal">Goal: 60m / Actual: 62m</p>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                Success
              </span>
              <p className="text-slate-400 text-[11px] font-medium">08:00 AM</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-2 mt-4 mb-1 opacity-60">
          <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Oct 28</h3>
          <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
        </div>

        {/* Item 5: Type A (Efficiency - Past) */}
        <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer grayscale opacity-80 hover:grayscale-0 hover:opacity-100">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 shrink-0 size-12 text-primary">
                <Icon name="schedule" className="text-[26px]" />
              </div>
              <div className="flex flex-col justify-center pt-0.5">
                <p className="text-slate-900 dark:text-white text-[15px] font-bold leading-tight group-hover:text-primary transition-colors">20m Focus</p>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[13px] mt-1 font-medium">
                  <span>Efficiency Mode</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <p className="text-slate-400 text-[11px] font-medium mt-1">11:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};