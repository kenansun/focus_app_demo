import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Set New Goal</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <Icon name="close" />
          </button>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Task Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <Icon name="edit" className="text-lg" />
            </div>
            <input 
              type="text" 
              placeholder="Math Homework" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
            />
          </div>
        </div>

        <div className="mb-6">
           <div className="flex justify-between items-center mb-2">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Minimum Duration</label>
             <span className="text-xs text-primary font-medium">Recommended</span>
           </div>
           <div className="grid grid-cols-4 gap-3">
             {['30m', '45m', '60m', '90m'].map((time, idx) => (
               <button 
                key={time} 
                className={`py-2 rounded-xl text-sm font-medium border transition-all ${idx === 1 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 relative' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary'}`}
               >
                 {time}
                 {idx === 1 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-primary rounded-full"></span>}
               </button>
             ))}
           </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50 rounded-xl p-4 flex items-center gap-4 mb-6 relative overflow-hidden">
           <div className="w-10 h-10 rounded-full bg-white dark:bg-yellow-900/40 flex items-center justify-center text-yellow-500 shadow-sm shrink-0 z-10">
             <Icon name="stars" filled />
           </div>
           <div className="z-10">
             <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">Reward</p>
             <p className="text-sm font-semibold text-slate-900 dark:text-white">Earn: 5 min of Play</p>
           </div>
           <Icon name="emoji_events" className="absolute -right-2 -bottom-4 text-8xl text-yellow-500/10 rotate-12" filled />
        </div>

        <button 
          onClick={() => {
            onClose();
            navigate('/focus');
          }}
          className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
        >
          Start Task
          <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};