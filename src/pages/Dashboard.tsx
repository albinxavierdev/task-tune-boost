
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useData } from '@/lib/data/DataContext';
import { useI18n } from '@/lib/i18n';
import { format } from 'date-fns';
import { Check, Clock, Trophy, Download } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    tasks, 
    sessions, 
    totalPoints, 
    milestones, 
    chatMessages,
    completeTask
  } = useData();
  const { t } = useI18n();
  const navigate = useNavigate();
  
  // Get upcoming tasks (not completed and due date in the future)
  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed' && new Date(task.due_date) > new Date())
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);
  
  // Get upcoming sessions (start time in the future)
  const upcomingSessions = sessions
    .filter(session => new Date(session.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 3);
  
  // Get recent chat messages
  const recentMessages = [...chatMessages]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);
  
  // Function to export data as CSV
  const exportDataAsCSV = () => {
    // Prepare tasks data
    const tasksData = tasks.map(task => ({
      type: 'Task',
      title: task.title,
      status: task.status,
      due_date: task.due_date,
      priority: task.priority,
      created_at: task.created_at
    }));
    
    // Prepare sessions data
    const sessionsData = sessions.map(session => ({
      type: 'Session',
      title: session.title,
      start_time: session.start_time,
      duration: session.duration,
      created_at: session.created_at
    }));
    
    // Combine data
    const data = [...tasksData, ...sessionsData];
    
    // Convert to CSV
    const headers = ['type', 'title', 'status', 'due_date', 'priority', 'start_time', 'duration', 'created_at'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers
          .map(header => row[header as keyof typeof row] || '')
          .map(cell => `"${cell}"`)
          .join(',')
      )
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `devfocus_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleTaskComplete = (taskId: string) => {
    completeTask(taskId);
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };
  
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} ${t('minutes')}`;
    } else if (mins === 0) {
      return `${hours} ${t('hours')}`;
    } else {
      return `${hours} ${t('hours')} ${mins} ${t('minutes')}`;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t('welcomeBack')}, {user?.email?.split('@')[0]}</h1>
        <p className="text-muted-foreground">Here's an overview of your productivity</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Points card */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">{t('yourPoints')}</h2>
          </div>
          <div className="text-3xl font-bold text-primary">{totalPoints}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Keep completing tasks to earn more!
          </p>
        </div>
        
        {/* Milestones card */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">{t('yourMilestones')}</h2>
          </div>
          {milestones.length > 0 ? (
            <ul className="space-y-2">
              {milestones.map((milestone) => (
                <li key={milestone.id} className="flex items-center">
                  <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                  <span>
                    {milestone.type === 'task_streak' && t('taskStreak')}
                    {milestone.type === 'study_focus' && t('studyFocus')}
                    {milestone.type === 'project_finisher' && t('projectFinisher')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Complete tasks and sessions to earn milestones
            </p>
          )}
        </div>
        
        {/* Export data card */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">{t('exportData')}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Export your tasks and sessions data as CSV
          </p>
          <button
            onClick={exportDataAsCSV}
            className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Upcoming tasks */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">{t('upcomingTasks')}</h2>
            <button 
              onClick={() => navigate('/projects')}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </div>
          
          {upcomingTasks.length > 0 ? (
            <ul className="space-y-3">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{task.title}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          task.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : task.priority === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Due: {formatDate(task.due_date)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleTaskComplete(task.id)}
                      className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No upcoming tasks</p>
              <button
                onClick={() => navigate('/projects')}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Create a task
              </button>
            </div>
          )}
        </div>
        
        {/* Upcoming sessions */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">{t('upcomingSessions')}</h2>
            <button 
              onClick={() => navigate('/sessions')}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </div>
          
          {upcomingSessions.length > 0 ? (
            <ul className="space-y-3">
              {upcomingSessions.map((session) => (
                <li key={session.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-foreground flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{session.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(session.start_time)} at {formatTime(session.start_time)}
                        <span className="mx-1">•</span>
                        {formatDuration(session.duration)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No upcoming sessions</p>
              <button
                onClick={() => navigate('/sessions')}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Schedule a session
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent chat */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">{t('chatRoom')}</h2>
          <button 
            onClick={() => navigate('/chat')}
            className="text-sm text-primary hover:underline"
          >
            Join chat
          </button>
        </div>
        
        {recentMessages.length > 0 ? (
          <div className="space-y-3">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-foreground flex items-center justify-center">
                  <span className="text-xs font-medium">{message.user_email.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{message.user_email.split('@')[0]}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {format(new Date(message.created_at), 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No recent messages</p>
            <button
              onClick={() => navigate('/chat')}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Start chatting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
