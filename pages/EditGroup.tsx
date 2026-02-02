import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { AppItem } from '../types';

const initialAddedApps: AppItem[] = [
  { id: '1', name: 'Slack', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg', category: 'Work', isAdded: true },
  { id: '2', name: 'Gmail', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg', category: 'Work', isAdded: true },
  { id: '3', name: 'Calendar', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg', category: 'Work', isAdded: true },
  { id: '4', name: 'Notes', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png', category: 'Work', isAdded: true },
];

const initialAvailableApps: AppItem[] = [
  { id: '5', name: 'Instagram', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg', category: 'Social', isAdded: false },
  { id: '6', name: 'TikTok', icon: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg', category: 'Social', isAdded: false },
  { id: '7', name: 'Spotify', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', category: 'Music', isAdded: false },
  { id: '8', name: 'Netflix', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg', category: 'Entertainment', isAdded: false },
  { id: '9', name: 'Twitter/X', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg', category: 'Social', isAdded: false },
  { id: '10', name: 'YouTube', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg', category: 'Video', isAdded: false },
];

export const EditGroup: React.FC = () => {
  const navigate = useNavigate();
  const [addedApps, setAddedApps] = useState<AppItem[]>(initialAddedApps);
  const [availableApps, setAvailableApps] = useState<AppItem[]>(initialAvailableApps);
  const [isAddedCollapsed, setIsAddedCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRemoveApp = (app: AppItem) => {
    setAddedApps(prev => prev.filter(a => a.id !== app.id));
    setAvailableApps(prev => [...prev, { ...app, isAdded: false }]);
  };

  const handleAddApp = (app: AppItem) => {
    setAvailableApps(prev => prev.filter(a => a.id !== app.id));
    setAddedApps(prev => [...prev, { ...app, isAdded: true }]);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
  };

  const filteredAddedApps = addedApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableApps = availableApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 w-full bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 h-14">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <Icon name="arrow_back_ios_new" />
          </button>
          <h1 className="text-base font-bold text-center flex-1 truncate px-2 dark:text-white">Edit "Deep Work"</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAddedCollapsed(!isAddedCollapsed)}
              className="flex items-center justify-center w-10 h-10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" 
              title={isAddedCollapsed ? "Expand" : "Collapse"}
            >
              <Icon name={isAddedCollapsed ? "keyboard_arrow_down" : "keyboard_arrow_up"} size={24} />
            </button>
            <button 
              onClick={() => navigate('/apps')}
              className="text-primary font-semibold text-base hover:text-primary/80 transition-colors"
            >
                Save
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col pb-8 overflow-y-auto">
        <div className="px-4 pt-4 pb-2 sticky top-0 z-40 bg-background-light dark:bg-background-dark">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" className="text-slate-400" />
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-slate-200/50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-surface-dark transition-all placeholder:text-slate-500 text-sm font-medium dark:text-white" 
              placeholder="Search installed apps..." 
              type="text" 
            />
          </div>
        </div>

        <section className="mt-4 px-4">
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer select-none group"
            onClick={() => setIsAddedCollapsed(!isAddedCollapsed)}
          >
            <div className="flex items-center gap-2">
               <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">Added to Group</h2>
               <Icon name={isAddedCollapsed ? "expand_more" : "expand_less"} className="text-slate-400 group-hover:text-slate-600" size={20} />
            </div>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">{filteredAddedApps.length} Apps</span>
          </div>
          
          {!isAddedCollapsed && (
            <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
              {filteredAddedApps.map(app => (
                <div 
                  key={app.id} 
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                  onClick={() => handleRemoveApp(app)}
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-white p-2 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                      <img 
                        src={app.icon} 
                        alt={app.name} 
                        className="w-10 h-10 object-contain"
                        onError={(e) => handleImageError(e, app.name)}
                      />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center shadow-md border-2 border-background-light dark:border-background-dark transition-transform hover:scale-110">
                      <Icon name="remove" size={14} className="font-bold" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-center truncate w-full dark:text-slate-300">{app.name}</span>
                </div>
              ))}
              {filteredAddedApps.length === 0 && (
                 <div className="col-span-4 text-center py-4 text-xs text-slate-400">
                    No apps match your search in this group.
                 </div>
              )}
            </div>
          )}
        </section>

        <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-6"></div>

        <section className="px-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Available Apps</h2>
          <div className="grid grid-cols-4 gap-4">
            {filteredAvailableApps.map(app => (
              <div 
                key={app.id} 
                className="flex flex-col items-center gap-2 group cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => handleAddApp(app)}
              >
                <div className="relative">
                   <div className="w-16 h-16 rounded-xl bg-white p-2 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <img 
                      src={app.icon} 
                      alt={app.name} 
                      className="w-10 h-10 object-contain" 
                      onError={(e) => handleImageError(e, app.name)}
                    />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-success text-white rounded-full flex items-center justify-center shadow-md border-2 border-background-light dark:border-background-dark transition-transform hover:scale-110">
                    <Icon name="add" size={14} className="font-bold" />
                  </div>
                </div>
                <span className="text-xs font-medium text-center truncate w-full dark:text-slate-300">{app.name}</span>
              </div>
            ))}
            {filteredAvailableApps.length === 0 && (
               <div className="col-span-4 text-center py-4 text-xs text-slate-400">
                  No other apps found.
               </div>
            )}
          </div>
          <div className="mt-8 mb-4 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-600">Showing all installed apps</p>
          </div>
        </section>
      </main>
    </div>
  );
};