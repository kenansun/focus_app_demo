import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

// Mock Data
const MOCK_HISTORY = [
  { id: 1, type: 'focus', title: '45m Focus', subtitle: 'Efficiency Mode', time: '09:30 AM', date: 'Today', duration: 45, reward: 5, status: 'completed' },
  { id: 2, type: 'task', title: 'Math Study', subtitle: 'Goal: 30m / Actual: 35m', time: '02:00 PM', date: 'Yesterday', duration: 35, reward: 0, status: 'success' },
  { id: 3, type: 'focus', title: '30m Focus', subtitle: 'Efficiency Mode', time: '10:00 AM', date: 'Yesterday', duration: 30, reward: 5, status: 'completed' },
  { id: 4, type: 'task', title: 'Reading', subtitle: 'Goal: 60m / Actual: 62m', time: '08:00 AM', date: 'Yesterday', duration: 62, reward: 0, status: 'success' },
  { id: 5, type: 'focus', title: '20m Focus', subtitle: 'Efficiency Mode', time: '11:00 AM', date: 'Oct 28', duration: 20, reward: 0, status: 'completed' },
  { id: 6, type: 'task', title: 'Physics', subtitle: 'Goal: 45m / Actual: 20m', time: '04:00 PM', date: 'Oct 28', duration: 20, reward: 0, status: 'failed' },
];

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('Last 7 Days');
  const [modeFilter, setModeFilter] = useState('All');
  
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // Dropdown Options
  const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Custom Range'];
  const modeOptions = ['All', 'Focus Mode', 'Task Mode'];

  // Filtering Logic
  const filteredData = MOCK_HISTORY.filter(item => {
    // Mode Filter
    if (modeFilter === 'Focus Mode' && item.type !== 'focus') return false;
    if (modeFilter === 'Task Mode' && item.type !== 'task') return false;

    // Date Filter (Mock Logic)
    if (dateFilter === 'Today' && item.date !== 'Today') return false;
    if (dateFilter === 'Yesterday' && item.date !== 'Yesterday') return false;
    if (dateFilter === 'Last 7 Days') return true; // Show all for demo
    
    return true;
  });

  // Grouping Logic
  const groupedData = filteredData.reduce((groups, item) => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
    return groups;
  }, {} as Record<string, typeof MOCK_HISTORY>);

  // Sort dates to ensure Today/Yesterday come first (simple check for demo)
  const sortedDates = Object.keys(groupedData).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return 0;
  });

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

              {groupedData[date].map(item => (
                <div key={item.id} className={`group flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer ${item.status === 'failed' ? 'opacity-80' : ''}`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`flex items-center justify-center rounded-2xl shrink-0 size-12 transition-transform duration-300 group-hover:scale-105 ${item.type === 'focus' ? 'bg-blue-50 dark:bg-blue-500/10 text-primary' : (item.status === 'failed' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300')}`}>
                        <Icon name={item.type === 'focus' ? 'schedule' : (item.status === 'failed' ? 'close' : 'track_changes')} className="text-[26px]" />
                      </div>
                      <div className="flex flex-col justify-center pt-0.5">
                        <p className={`text-[15px] font-bold leading-tight transition-colors ${item.status === 'failed' ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white group-hover:text-primary'}`}>{item.title}</p>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[13px] mt-1 font-medium">
                          <span>{item.subtitle}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {item.reward > 0 && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/10 shadow-sm">
                          +{item.reward}m Reward
                        </span>
                      )}
                      {item.type === 'task' && item.status === 'success' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                          <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                          Success
                        </span>
                      )}
                      {item.status === 'failed' && (
                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold border border-red-200 dark:border-red-500/20 shadow-sm">
                           Given Up
                         </span>
                      )}
                      <p className="text-slate-400 text-[11px] font-medium mt-0.5">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};