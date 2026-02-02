import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Group } from '../types';

const groups: Group[] = [
  { id: '1', name: 'Work', appCount: 8, icon: 'work', color: 'text-primary' },
  { id: '2', name: 'Social', appCount: 3, icon: 'chat_bubble', color: 'text-purple-500' },
  { id: '3', name: 'Games', appCount: 12, icon: 'sports_esports', color: 'text-orange-500' },
  { id: '4', name: 'Sleep', appCount: 2, icon: 'bedtime', color: 'text-indigo-500' },
  { id: '5', name: 'Creativity', appCount: 5, icon: 'palette', color: 'text-pink-500' },
];

export const AppGroups: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">App Groups</h1>
        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
          <Icon name="search" />
        </button>
      </header>
      
      <main className="flex-1 px-4 py-6 flex flex-col gap-4 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.id} className="group relative flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md hover:border-primary/20 dark:hover:border-primary/20">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center size-12 rounded-lg ${group.color.replace('text-', 'bg-')}/10 ${group.color}`}>
                <Icon name={group.icon} size={24} filled />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-base font-bold leading-tight text-slate-900 dark:text-white">{group.name}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{group.appCount} apps included</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => navigate(`/apps/edit/${group.id}`)}
                aria-label={`Edit ${group.name} Group`} 
                className="p-2 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Icon name="edit" size={20} />
              </button>
              <button 
                aria-label={`Delete ${group.name} Group`} 
                className="p-2 rounded-full text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors"
              >
                <Icon name="delete" size={20} />
              </button>
            </div>
          </div>
        ))}
      </main>

      <button className="fixed bottom-[100px] right-5 z-40 flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-blue-600 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20">
        <Icon name="add" size={28} />
      </button>
    </div>
  );
};