import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Tasks } from './pages/Tasks';
import { AppGroups } from './pages/AppGroups';
import { EditGroup } from './pages/EditGroup';
import { Profile } from './pages/Profile';
import { FocusTimer } from './pages/FocusTimer';
import { Onboarding } from './pages/Onboarding';
import { SessionResult } from './pages/SessionResult';
import { GeneralSettings } from './pages/GeneralSettings';
import { History } from './pages/History';
import { BlockScreen, RestReminder, EyeCare, FloatingBubble } from './pages/Overlays';

// Guard component to handle session persistence
const SessionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      try {
        const savedSession = localStorage.getItem('focus_session');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          // Only force redirect for Focus and Play modes
          if ((session.mode === 'focus' || session.mode === 'play') && location.pathname !== '/focus') {
             // Pass the saved state to the route so FocusTimer can hydrate
             navigate('/focus', { state: { ...session, fromGuard: true } });
          }
        }
      } catch (e) {
        console.error("Session parse error", e);
      }
    };
    
    checkSession();
    // Check on focus window focus as well
    window.addEventListener('focus', checkSession);
    return () => window.removeEventListener('focus', checkSession);
  }, [location, navigate]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <SessionGuard>
        <div className="h-full w-full overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden relative">
            <Routes>
              <Route path="/" element={<Navigate to="/onboarding" replace />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<Home />} />
              <Route path="/apps" element={<AppGroups />} />
              <Route path="/apps/edit/:id" element={<EditGroup />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<GeneralSettings />} />
              <Route path="/history" element={<History />} />
              
              {/* Focus Flow */}
              <Route path="/focus" element={<FocusTimer />} />
              <Route path="/success" element={<SessionResult />} />
              <Route path="/fail" element={<SessionResult />} />
              
              {/* Simulations / Overlays */}
              <Route path="/block" element={<BlockScreen />} />
              <Route path="/rest" element={<RestReminder />} />
              <Route path="/eyecare" element={<EyeCare />} />
              <Route path="/simulation" element={<FloatingBubble />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </SessionGuard>
    </Router>
  );
};

export default App;