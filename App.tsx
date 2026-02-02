import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;