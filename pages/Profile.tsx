import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-background-dark overflow-y-auto pb-24">
       <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 py-3">
             <div className="w-10"></div>
             <h2 className="text-lg font-bold leading-tight tracking-tight text-center dark:text-white">Profile</h2>
             <div className="w-10 flex justify-end">
                <button 
                  onClick={() => navigate('/settings')}
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                   <Icon name="settings" />
                </button>
             </div>
          </div>
       </header>

       <section className="flex flex-col items-center pt-8 pb-6 px-4">
          <div className="relative mb-4">
             <div className="h-28 w-28 rounded-full bg-slate-100 bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full" />
             </div>
             <div className="absolute bottom-0 right-0 bg-primary h-8 w-8 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 text-white">
                <Icon name="edit" className="text-sm font-bold" />
             </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Alex Doe</h1>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
             <Icon name="bolt" className="text-primary text-sm filled" />
             <p className="text-primary text-sm font-semibold">Total Focus: 124h 15m</p>
          </div>
       </section>

       <section className="px-4 mb-8">
          <div className="bg-slate-50 dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Weekly Focus Trend</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Past 7 days performance</p>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-2xl font-bold text-slate-900 dark:text-white">32h</span>
                   <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      <Icon name="trending_up" size={14} />
                      <span>+12%</span>
                   </div>
                </div>
             </div>
             {/* Simple CSS Bar Chart Simulation */}
             <div className="h-40 flex items-end justify-between gap-2 sm:gap-4">
                {[45, 60, 85, 30, 70, 50, 20].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="w-full bg-white dark:bg-slate-800 rounded-t-sm relative h-32 flex items-end overflow-hidden">
                       <div className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-sm transition-all group-hover:opacity-80" style={{ height: `${h}%` }}></div>
                    </div>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${i===2 ? 'text-primary font-bold' : 'text-gray-400'}`}>
                      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                    </span>
                  </div>
                ))}
             </div>
          </div>
       </section>
       
       <div className="flex flex-col gap-6 px-4">
          <section>
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-4 mb-2">General</h3>
             <div className="bg-slate-50 dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                         <Icon name="timer" size={20} />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Lock screen timer</span>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                   </label>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                         <Icon name="notifications" size={20} />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Notification style</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Banner</span>
                      <Icon name="chevron_right" className="text-gray-400 text-lg" />
                   </div>
                </div>
             </div>
          </section>

          <section>
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-4 mb-2">About</h3>
             <div className="bg-slate-50 dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-500/10 flex items-center justify-center text-gray-500">
                         <Icon name="info" size={20} />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Version</span>
                   </div>
                   <span className="text-sm text-gray-500 font-medium">1.0.2</span>
                </div>
             </div>
          </section>

          <div className="mt-2 mb-6">
             <button className="w-full p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 text-sm font-medium hover:bg-red-500/10 transition-colors">Log Out</button>
          </div>
       </div>
    </div>
  );
};