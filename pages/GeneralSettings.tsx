import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const GeneralSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Helper to load number from local storage with default
  const usePersistedNumber = (key: string, defaultValue: number) => {
    return useState(() => {
      const saved = localStorage.getItem(key);
      return saved !== null ? Number(saved) : defaultValue;
    });
  };

  const [focusDuration, setFocusDuration] = usePersistedNumber('settings_focusDuration', 25);
  const [rewardDuration, setRewardDuration] = usePersistedNumber('settings_rewardDuration', 5);
  const [usageThreshold, setUsageThreshold] = usePersistedNumber('settings_usageThreshold', 45);
  const [restDuration, setRestDuration] = usePersistedNumber('settings_restDuration', 20);
  const [skipsLimit, setSkipsLimit] = usePersistedNumber('settings_skipsLimit', 3);
  
  const [permissions, setPermissions] = useState(() => {
    const stored = localStorage.getItem('settings_permissions');
    return stored ? JSON.parse(stored) : {
      accessibility: true,
      overlay: true,
      usage: false,
      admin: false
    };
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Save to localStorage
    localStorage.setItem('settings_focusDuration', String(focusDuration));
    localStorage.setItem('settings_rewardDuration', String(rewardDuration));
    localStorage.setItem('settings_usageThreshold', String(usageThreshold));
    localStorage.setItem('settings_restDuration', String(restDuration));
    localStorage.setItem('settings_skipsLimit', String(skipsLimit));
    localStorage.setItem('settings_permissions', JSON.stringify(permissions));

    // Simulate network/processing delay for better UX
    setTimeout(() => {
      setIsSaving(false);
      navigate(-1);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased overflow-y-auto pb-8">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between px-4 h-14">
            <button 
                onClick={() => navigate(-1)} 
                className="text-primary hover:text-blue-600 flex items-center gap-1 transition-colors group"
                disabled={isSaving}
            >
                <Icon name="arrow_back_ios" className="text-[20px] group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-base font-normal">Back</span>
            </button>
            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight absolute left-1/2 -translate-x-1/2">
                General Settings
            </h1>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`font-medium text-base transition-all flex items-center gap-2 ${isSaving ? 'text-green-500' : 'text-primary hover:text-blue-600'}`}
            >
                {isSaving ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></span>
                    <span>Saving</span>
                  </>
                ) : (
                  'Save'
                )}
            </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`w-full max-w-md mx-auto flex flex-col px-4 pt-2 transition-opacity duration-300 ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Section A: Reward Rules */}
        <section className="mt-6">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider ml-4 mb-2">
                Reward Rules
            </h3>
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {/* Focus Duration Row */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <label className="flex-1 text-base font-medium text-slate-900 dark:text-white cursor-pointer" htmlFor="focus-duration">
                        Focus Duration <span className="text-slate-400 font-normal text-sm ml-1">(min)</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <input 
                            id="focus-duration" 
                            type="number" 
                            value={focusDuration}
                            onChange={(e) => setFocusDuration(Number(e.target.value))}
                            className="w-20 text-right bg-transparent border-none focus:ring-0 text-primary font-medium text-lg p-0 placeholder:text-slate-300" 
                        />
                        <Icon name="edit" className="text-slate-300 text-[20px]" />
                    </div>
                </div>
                {/* Reward Duration Row */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <label className="flex-1 text-base font-medium text-slate-900 dark:text-white cursor-pointer" htmlFor="reward-duration">
                        Reward Duration <span className="text-slate-400 font-normal text-sm ml-1">(min)</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <input 
                            id="reward-duration" 
                            type="number" 
                            value={rewardDuration}
                            onChange={(e) => setRewardDuration(Number(e.target.value))}
                            className="w-20 text-right bg-transparent border-none focus:ring-0 text-primary font-medium text-lg p-0 placeholder:text-slate-300" 
                        />
                        <Icon name="edit" className="text-slate-300 text-[20px]" />
                    </div>
                </div>
            </div>
            {/* Meta Text */}
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-relaxed mt-2 px-4">
                Earn {rewardDuration} minutes of play for every {focusDuration} minutes of focus.
            </p>
        </section>

        {/* Section B: Eye Care (Global Rest) */}
        <section className="mt-8">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider ml-4 mb-2">
                Eye Care (Global Rest)
            </h3>
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {/* Usage Threshold */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <label className="flex-1 text-base font-medium text-slate-900 dark:text-white">
                        Usage Threshold <span className="text-slate-400 font-normal text-sm ml-1">(min)</span>
                    </label>
                    <input 
                        type="number" 
                        value={usageThreshold}
                        onChange={(e) => setUsageThreshold(Number(e.target.value))}
                        className="w-20 text-right bg-transparent border-none focus:ring-0 text-primary font-medium text-lg p-0" 
                    />
                </div>
                {/* Rest Duration */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <label className="flex-1 text-base font-medium text-slate-900 dark:text-white">
                        Rest Duration <span className="text-slate-400 font-normal text-sm ml-1">(sec)</span>
                    </label>
                    <input 
                        type="number" 
                        value={restDuration}
                        onChange={(e) => setRestDuration(Number(e.target.value))}
                        className="w-20 text-right bg-transparent border-none focus:ring-0 text-primary font-medium text-lg p-0" 
                    />
                </div>
                {/* Daily Skips Limit */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <label className="flex-1 text-base font-medium text-slate-900 dark:text-white">
                        Daily Skips Limit
                    </label>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setSkipsLimit(Math.max(0, skipsLimit - 1))}
                            className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                        >
                            <Icon name="remove" className="text-[20px]" />
                        </button>
                        <span className="text-slate-900 dark:text-white font-medium text-lg w-4 text-center">{skipsLimit}</span>
                        <button 
                            onClick={() => setSkipsLimit(skipsLimit + 1)}
                            className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                        >
                            <Icon name="add" className="text-[20px]" />
                        </button>
                    </div>
                </div>
                {/* Force Unlock PIN Action */}
                <div className="p-4 bg-white dark:bg-surface-dark">
                    <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all active:scale-[0.98] shadow-sm shadow-blue-200 dark:shadow-none">
                        <Icon name="lock" className="text-[20px]" filled />
                        Set Force Unlock PIN
                    </button>
                </div>
            </div>
        </section>

        {/* Section C: Permissions */}
        <section className="mt-8 mb-6">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider ml-4 mb-2">
                Permissions
            </h3>
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {/* Accessibility Service */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark">
                    <div className="flex items-center gap-2 flex-1 pr-4">
                        <span className="text-base font-medium text-slate-900 dark:text-white">Accessibility Service</span>
                        <Icon name="info" className="text-slate-400 text-[18px] cursor-help" title="Required to detect app usage" />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={permissions.accessibility} onChange={() => togglePermission('accessibility')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                {/* Display Over Other Apps */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark">
                    <div className="flex items-center gap-2 flex-1 pr-4">
                        <span className="text-base font-medium text-slate-900 dark:text-white">Overlay Permission</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={permissions.overlay} onChange={() => togglePermission('overlay')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                {/* Usage Access */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark">
                    <div className="flex items-center gap-2 flex-1 pr-4">
                        <span className="text-base font-medium text-slate-900 dark:text-white">Usage Access</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={permissions.usage} onChange={() => togglePermission('usage')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                {/* Device Admin */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark">
                    <div className="flex items-center gap-2 flex-1 pr-4">
                        <span className="text-base font-medium text-slate-900 dark:text-white">Device Admin</span>
                        <Icon name="info" className="text-slate-400 text-[18px] cursor-help" title="Prevents app uninstallation during focus" />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={permissions.admin} onChange={() => togglePermission('admin')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
            {/* Footer Note */}
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-relaxed mt-2 px-4">
                These permissions are required to block apps effectively and ensure the focus mode works as intended.
            </p>
        </section>
      </main>
    </div>
  );
};