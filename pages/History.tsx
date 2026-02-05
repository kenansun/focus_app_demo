import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../src/db/db';
import { SessionService } from '../src/services/sessionService';
import { FocusSession } from '../src/db/types';
import { format, isToday, isYesterday, subDays, startOfDay } from 'date-fns';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('Last 7 Days');
  const [modeFilter, setModeFilter] = useState('All');
  
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // Dropdown Options
  const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'All Time'];
  const modeOptions = ['All', 'Focus Mode', 'Task Mode', 'Play Mode'];

  // Query Data from Dexie
  const historyData = useLiveQuery(async () => {
      let collection = db.sessions.orderBy('startTime').reverse();
      
      // Basic filtering at DB level could go here, but for complex filters with small datasets,
      // in-memory filtering after fetching recent items is often easier/faster for demos.
      // Let's fetch all for now or limit to reasonable count (e.g. 100)
      return await collection.limit(100).toArray();
  }, []);

  // Filtering Logic
  const filteredData = (historyData || []).filter(item => {
    const date = new Date(item.startTime);

    // Mode Filter
    if (modeFilter === 'Focus Mode' && item.mode !== 'focus') return false;
    if (modeFilter === 'Task Mode' && item.mode !== 'task') return false;
    if (modeFilter === 'Play Mode' && item.mode !== 'play') return false;

    // Date Filter
    if (dateFilter === 'Today') return isToday(date);
    if (dateFilter === 'Yesterday') return isYesterday(date);
    if (dateFilter === 'Last 7 Days') return date >= subDays(startOfDay(new Date()), 7);
    
    return true;
  });

  // Grouping Logic
  const groupedData = filteredData.reduce((groups, item) => {
    let dateLabel = '';
    const date = new Date(item.startTime);
    
    if (isToday(date)) dateLabel = 'Today';
    else if (isYesterday(date)) dateLabel = 'Yesterday';
    else dateLabel = format(date, 'MMM d, yyyy'); // e.g., Oct 28, 2023

    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(item);
    return groups;
  }, {} as Record<string, FocusSession[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedData).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    // Date string comparison (simple desc sort for other dates)
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Helper to format item title/subtitle
  const getItemDisplay = (item: FocusSession) => {
      let title = '';
      let subtitle = '';
      
      if (item.mode === 'focus') {
          title = `${Math.floor(item.durationMinutes)}m Focus`;
          subtitle = 'Efficiency Mode';
      } else if (item.mode === 'play') {
          title = `${Math.floor(item.durationMinutes)}m Play`;
          subtitle = 'Reward Spent';
      } else if (item.mode === 'task') {
          // Ideally we would join with Task table to get title, but for now we might not have it stored in session
          // We can assume 'Task Focus' or use taskId if we fetch it
          title = `Task Session`; 
          subtitle = `${Math.floor(item.durationMinutes)}m progress`;
      }

      return { title, subtitle };
  };

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
          <div className="col-span-3 flex flex-col gap-1.5 relative">
            <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1">Date Range</label>
            <div 
              onClick={() => { setShowDateDropdown(!showDateDropdown); setShowModeDropdown(false); }}
              className="group flex items-center w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 h-12 shadow-sm transition-all hover:border-primary/50 cursor-pointer"
            >
              <Icon name="calendar_month" className="text-primary text-[20px] mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-[13px] font-medium text-slate-900 dark:text-white truncate">{dateFilter}</span>
              <Icon name="arrow_drop_down" className={`ml-auto text-slate-400 text-[22px] transition-transform duration-200 ${showDateDropdown ? 'rotate-180' : ''}`} />
            </div>
            {/* Dropdown Menu */}
            {showDateDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                {dateOptions.map(opt => (
                  <div 
                    key={opt} 
                    onClick={() => { setDateFilter(opt); setShowDateDropdown(false); }}
                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer text-sm font-medium ${dateFilter === opt ? 'text-primary bg-primary/5' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
            {/* Overlay to close dropdown */}
            {showDateDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowDateDropdown(false)}></div>}
          </div>

          {/* Mode Selector */}
          <div className="col-span-2 flex flex-col gap-1.5 relative">
            <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1">Mode</label>
            <div 
              onClick={() => { setShowModeDropdown(!showModeDropdown); setShowDateDropdown(false); }}
              className="group flex items-center w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 h-12 shadow-sm cursor-pointer hover:border-primary/50 transition-all"
            >
              <span className="text-[13px] font-medium text-slate-900 dark:text-white flex-1 truncate pl-1">{modeFilter}</span>
              <Icon name="arrow_drop_down" className={`text-slate-400 text-[22px] transition-transform duration-200 ${showModeDropdown ? 'rotate-180' : ''}`} />
            </div>
             {/* Dropdown Menu */}
             {showModeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                {modeOptions.map(opt => (
                  <div 
                    key={opt} 
                    onClick={() => { setModeFilter(opt); setShowModeDropdown(false); }}
                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer text-sm font-medium ${modeFilter === opt ? 'text-primary bg-primary/5' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
            {/* Overlay to close dropdown */}
            {showModeDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowModeDropdown(false)}></div>}
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 flex flex-col gap-3 px-5 pb-24 overflow-y-auto no-scrollbar">
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Icon name="event_busy" className="text-4xl mb-2 opacity-50" />
            <p className="text-sm">No history found for this selection.</p>
          </div>
        ) : (
          sortedDates.map(date => (
            <React.Fragment key={date}>
              {/* Section Header */}
              <div className="flex items-center gap-2 mt-4 mb-1 opacity-60 first:mt-2">
                <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{date}</h3>
                <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
              </div>

              {groupedData[date].map(item => {
                const { title, subtitle } = getItemDisplay(item);
                return (
                <div key={item.id} className={`group flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer ${item.status === 'abandoned' ? 'opacity-80' : ''}`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`flex items-center justify-center rounded-2xl shrink-0 size-12 transition-transform duration-300 group-hover:scale-105 ${item.mode === 'focus' ? 'bg-blue-50 dark:bg-blue-500/10 text-primary' : (item.status === 'abandoned' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300')}`}>
                        <Icon name={item.mode === 'focus' ? 'schedule' : (item.status === 'abandoned' ? 'close' : 'track_changes')} className="text-[26px]" />
                      </div>
                      <div className="flex flex-col justify-center pt-0.5">
                        <p className={`text-[15px] font-bold leading-tight transition-colors ${item.status === 'abandoned' ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white group-hover:text-primary'}`}>{title}</p>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[13px] mt-1 font-medium">
                          <span>{subtitle}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {item.rewardChange > 0 && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/10 shadow-sm">
                          +{item.rewardChange}m Reward
                        </span>
                      )}
                      {item.rewardChange < 0 && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 text-[10px] font-bold border border-orange-200 dark:border-orange-500/20 shadow-sm">
                          {item.rewardChange}m Spent
                        </span>
                      )}
                      {item.status === 'abandoned' && (
                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold border border-red-200 dark:border-red-500/20 shadow-sm">
                           Given Up
                         </span>
                      )}
                      <p className="text-slate-400 text-[11px] font-medium mt-0.5">{format(new Date(item.startTime), 'h:mm a')}</p>
                    </div>
                  </div>
                </div>
              )})}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};