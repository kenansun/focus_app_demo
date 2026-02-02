import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/apps', label: 'Apps', icon: 'apps' },
    { path: '/tasks', label: 'Tasks', icon: 'check_circle' },
    { path: '/profile', label: 'Profile', icon: 'person' },
  ];

  if (['/focus', '/onboarding', '/analysis', '/block', '/rest', '/eyecare', '/simulation', '/success', '/fail'].some(path => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center max-w-md mx-auto h-16 pb-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 w-16 transition-colors ${
              isActive(item.path)
                ? 'text-primary'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Icon name={item.icon} filled={isActive(item.path)} className="text-2xl" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};