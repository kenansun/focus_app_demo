import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { LocalIcon } from '../components/LocalIcon';
import { Permission, PermissionStatus } from '../types';

const initialPermissions: Permission[] = [
  { id: '1', name: 'Accessibility Service', description: 'Required to detect distracting apps.', icon: 'touch_app', status: PermissionStatus.Pending },
  { id: '2', name: 'Display over other apps', description: 'Allows us to show the Focus shield.', icon: 'layers', status: PermissionStatus.Pending },
  { id: '3', name: 'Usage Access', description: 'To calculate screen time & rewards.', icon: 'data_usage', status: PermissionStatus.Pending },
  { id: '4', name: 'Device Admin', description: 'Prevents accidental uninstalling.', icon: 'admin_panel_settings', status: PermissionStatus.Pending },
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'permissions' | 'analysis'>('permissions');
  const [permissions, setPermissions] = useState(initialPermissions);

  const togglePermission = (id: string) => {
    setPermissions(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === PermissionStatus.Granted ? PermissionStatus.Pending : PermissionStatus.Granted } : p
    ));
  };

  const handleEnableAll = () => {
    setPermissions(prev => prev.map(p => ({ ...p, status: PermissionStatus.Granted })));
    setTimeout(() => setStep('analysis'), 800);
  };

  if (step === 'analysis') {
    return <AnalysisStep onComplete={() => navigate('/home')} />;
  }

  return (
    <div className="h-full w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col">
       <div className="flex-1 flex flex-col min-h-0 pt-4 max-w-md mx-auto w-full">
         <div className="px-6 pb-0 flex justify-center shrink-0">
            <div className="w-full aspect-[2/1] max-h-[140px] bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative">
               {/* Illustration Placeholder */}
               <div className="absolute inset-0 flex items-center justify-center">
                 <LocalIcon name="security" className="text-primary/20" size={72} />
               </div>
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaFy-ZvfeI0-UkRsB_dyX07H5P1AyRtq5DnPHJ7n5mwvxRxklwQzk-7SyIiRppTTU7LXf4BFfiLnKDgC9AYxsYQ6hbtXg3xrr4tGsT9VATT_Md2lDCdheGjNBeJnDuRQTw4XGYTRY1n26mnHCFYFNsqb7_YwrB81V0MXOusmQwuuOrxbVWzVHgEQQu0PZfjpeYfybLW5bo3MH_0InSe7xG7pI-w3gMY7HmBU9hK3TnbZPAloMMBRC7KSI4iLUe6ei7TWVwzeuu7z0" alt="Shield" className="w-full h-full object-cover" />
            </div>
         </div>
         <div className="px-6 py-4 text-center shrink-0">
            <h1 className="text-xl font-bold leading-tight mb-2">To help you stay disciplined, we need a few permissions.</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your data stays on your device. We use these strictly to manage Focus and Play modes.</p>
         </div>

         <div className="flex-1 px-4 py-2 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {permissions.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark px-3 py-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                   <div className="flex items-center gap-3 flex-1">
                      <div className="text-primary flex items-center justify-center rounded-full bg-primary/10 shrink-0 size-8">
                         <LocalIcon name={p.icon as any} size={20} />
                      </div>
                      <div className="flex flex-col justify-center">
                         <p className="text-sm font-semibold leading-tight mb-0.5">{p.name}</p>
                         <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{p.description}</p>
                      </div>
                   </div>
                   <div className="shrink-0">
                      <label className={`relative flex h-[24px] w-[40px] cursor-pointer items-center rounded-full border-none p-0.5 transition-colors ${p.status === PermissionStatus.Granted ? 'bg-primary justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}>
                         <input type="checkbox" className="invisible absolute" checked={p.status === PermissionStatus.Granted} onChange={() => togglePermission(p.id)} />
                         <div className="h-[20px] w-[20px] rounded-full bg-white shadow-sm transform transition-transform"></div>
                      </label>
                   </div>
                </div>
              ))}
            </div>
         </div>
         
         <div className="flex items-center justify-center gap-1.5 pb-2 pt-0 opacity-70 shrink-0">
            <LocalIcon name="verified_user" className="text-slate-400" size={16} />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Privacy Protected & Secure</span>
         </div>

         <div className="px-6 pb-6 pt-2 shrink-0 z-10">
            <button onClick={handleEnableAll} className="w-full bg-primary hover:bg-blue-600 text-white font-bold text-base py-3.5 rounded-xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all mb-3">Enable All</button>
            <button onClick={() => setStep('analysis')} className="w-full text-slate-500 dark:text-slate-400 font-medium text-xs hover:text-primary transition-colors">Skip for now</button>
         </div>
       </div>
    </div>
  );
};

const AnalysisStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col overflow-x-hidden">
       <div className="flex items-center p-4 pb-2 justify-between z-10 sticky top-0 backdrop-blur-md bg-opacity-90">
          <div className="flex size-12 shrink-0 items-center cursor-pointer">
             <LocalIcon name="arrow_back" size={24} />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Analyzing Library</h2>
       </div>

       <div className="relative flex flex-col items-center justify-center py-12 mt-4 mb-2">
          {/* Radar Deco */}
          <div className="absolute w-[280px] h-[280px] rounded-full border border-primary/10 bg-primary/5 animate-pulse"></div>
          <div className="absolute w-[220px] h-[220px] rounded-full border border-primary/20"></div>
          <div className="absolute w-[160px] h-[160px] rounded-full border-2 border-primary/30 shadow-[0_0_15px_rgba(19,127,236,0.3)]"></div>
          <div className="z-10 flex flex-col items-center justify-center">
             <h1 className="text-6xl font-bold leading-tight text-center">128</h1>
             <p className="text-primary font-medium text-base pt-1 tracking-wide uppercase text-sm">Apps Found</p>
          </div>
       </div>

       <div className="px-4 pb-2">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold">Categorization Results</h3>
             <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Auto-sorted</span>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-3 p-4 pb-32">
          {['Social', 'Games', 'Study', 'Work'].map((cat, i) => (
             <div key={cat} className="flex flex-col gap-3 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                   <div className={`size-10 rounded-lg flex items-center justify-center ${i===0?'bg-blue-100 text-blue-600':i===1?'bg-purple-100 text-purple-600':i===2?'bg-green-100 text-green-600':'bg-orange-100 text-orange-600'}`}>
                      <LocalIcon name={i===0?'group':i===1?'sports_esports':i===2?'school':'work'} />
                   </div>
                   <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">{[14,5,3,8][i]}</span>
                </div>
                <div>
                   <p className="text-base font-bold leading-normal">{cat}</p>
                   <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Sample apps...</p>
                </div>
             </div>
          ))}
          <div className="col-span-2 flex flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 shadow-inner border border-transparent dark:border-slate-700">
             <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                   <LocalIcon name="category" />
                </div>
                <div>
                   <p className="text-base font-bold leading-normal">Uncategorized</p>
                   <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Review needed</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">2</span>
                <LocalIcon name="chevron_right" className="text-slate-400" />
             </div>
          </div>
       </div>

       <div className="fixed bottom-0 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex flex-col gap-3 max-w-md mx-auto">
             <button onClick={() => navigate('/apps')} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-transparent border border-primary text-primary hover:bg-primary/5 transition-colors text-base font-bold">Adjust Categories</button>
             <button onClick={onComplete} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary hover:bg-blue-600 transition-colors text-white shadow-lg shadow-blue-500/30 text-base font-bold">Confirm & Continue</button>
          </div>
       </div>
    </div>
  );
};
