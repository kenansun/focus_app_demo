import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { useNavigate } from 'react-router-dom';
import { GoalModal } from '../components/GoalModal';
import { useLiveQuery } from 'dexie-react-hooks';
import { TaskService } from '../src/services/taskService';
import { SessionService } from '../src/services/sessionService';
import { TaskEntity } from '../src/db/types';
import { db } from '../src/db/db';

export const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Live Query for real-time task updates
  const tasks = useLiveQuery(() => TaskService.getActiveTasks(), []) || [];
  const recentTaskLogs = useLiveQuery(async () => {
    const sessions = await SessionService.getRecentTaskSessions(2);
    const pairs = await Promise.all(sessions.map(async s => ({
      session: s,
      task: s.taskId ? await db.tasks.get(s.taskId) : null
    })));
    return pairs;
  }, []) || [];

  const handleStartTask = (task: TaskEntity) => {
    navigate('/focus', { 
      state: { 
        mode: 'task', 
        taskName: task.title,
        taskId: task.id,
        targetMinutes: task.targetMinutes, 
        accumulatedMinutes: task.accumulatedMinutes
      } 
    });
  };

  const handleGiveUp = async (task: TaskEntity) => {
    // Mark as abandoned
    await TaskService.updateStatus(task.id, 'abandoned');
  };

  const handleComplete = async (task: TaskEntity) => {
    // Mark as completed
    await TaskService.updateStatus(task.id, 'completed');
  };

  const handleGoalCreate = async (title: string, targetMinutes: number, rewardMinutes: number) => {
      await TaskService.createTask(title, targetMinutes, rewardMinutes);
      setShowGoalModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
         <div className="flex items-center justify-between p-4 pt-12 pb-3"> 
            <div className="w-10"></div> 
            <h1 className="text-lg font-bold tracking-tight text-center flex-1 dark:text-white">My Tasks</h1>
            <div className="w-10 flex justify-end">
               <button className="text-slate-500 hover:text-primary transition-colors">
                  <Icon name="more_horiz" />
               </button>
            </div>
         </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold tracking-tight dark:text-white">Active Tasks</h2>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">{tasks.length} Active</span>
         </div>
         
         <div className="flex flex-col gap-4 mb-8">
            {tasks.map(task => {
              const progressPercent = Math.min(100, Math.round((task.accumulatedMinutes / task.targetMinutes) * 100));
              const isCompleted = task.accumulatedMinutes >= task.targetMinutes;
              const potentialReward = Number(((task.rewardOnComplete ?? (task.targetMinutes * 0.2))).toFixed(1));

              return (
                <div key={task.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                      <Icon name="trophy" className="text-sm filled text-yellow-500" />
                      +{potentialReward}m Play
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                      <div>
                        <h3 className="text-lg font-bold leading-tight dark:text-white">{task.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 flex items-center gap-1">
                            <Icon name="timer" className="text-base" /> Target &gt; {task.targetMinutes}m
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span>{task.accumulatedMinutes}m accumulated</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full w-1/2 transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} 
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button 
                          onClick={() => handleStartTask(task)} 
                          className="flex-1 bg-primary hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                        >
                            <Icon name="play_arrow" className="text-lg filled" /> Continue
                        </button>
                        
                        {isCompleted ? (
                           <button 
                             onClick={() => handleComplete(task)}
                             className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors border border-green-200 dark:border-green-800 flex items-center gap-1"
                           >
                             <Icon name="check" className="text-lg font-bold" /> Complete
                           </button>
                        ) : (
                           <button 
                             onClick={() => handleGiveUp(task)}
                             className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors border border-slate-200 dark:border-slate-600"
                           >
                             Abandon
                           </button>
                        )}
                      </div>
                  </div>
                </div>
              );
            })}
         </div>

         <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">History</h2>
            <button 
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All
            </button>
         </div>
         <div className="flex flex-col gap-3">
           {recentTaskLogs.length === 0 ? (
             <div className="p-8 text-center">
               <p className="text-sm text-slate-400">No recent task sessions</p>
             </div>
           ) : (
             recentTaskLogs.map(({ session, task }) => {
               const title = task?.title || 'Task';
               const minutes = Number(session.durationMinutes.toFixed(1));
               const statusColor = session.status === 'completed' ? 'text-emerald-600' : 'text-red-500';
               const statusBg = session.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-red-100 dark:bg-red-900/20';
               const statusBorder = session.status === 'completed' ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-800';
               return (
                 <div key={session.id} className={`flex items-center justify-between bg-white dark:bg-surface-dark rounded-xl p-4 border ${statusBorder}`}>
                   <div className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                       <Icon name="flag" />
                     </div>
                     <div>
                       <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400">{minutes} min</p>
                     </div>
                   </div>
                   <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBg} ${statusColor}`}>
                     {session.status}
                   </div>
                 </div>
               );
             })
           )}
         </div>
      </main>
      
      <div className="absolute bottom-24 right-4 z-40">
         <button 
           onClick={() => setShowGoalModal(true)}
           className="bg-primary hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-blue-500/40 transition-transform active:scale-95"
         >
            <Icon name="add" className="text-3xl" />
         </button>
      </div>

      <GoalModal 
        isOpen={showGoalModal} 
        onClose={() => setShowGoalModal(false)}
        onSubmit={handleGoalCreate} // Assuming GoalModal accepts this prop now
      />
    </div>
  );
};
