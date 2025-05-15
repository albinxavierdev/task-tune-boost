
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Task, Session, Points, Milestone, ChatMessage } from '../types';
import { 
  mockProjects, 
  mockTasks, 
  mockSessions, 
  mockPoints, 
  mockMilestones, 
  mockChatMessages 
} from '../mockData';

type DataContextType = {
  projects: Project[];
  tasks: Task[];
  sessions: Session[];
  points: Points[];
  milestones: Milestone[];
  chatMessages: ChatMessage[];
  totalPoints: number;
  
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Project>;
  updateProject: (project: Project) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<Task>;
  
  addSession: (session: Omit<Session, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Session>;
  updateSession: (session: Session) => Promise<Session>;
  deleteSession: (id: string) => Promise<void>;
  completeSession: (id: string) => Promise<void>;
  
  addChatMessage: (content: string) => Promise<ChatMessage>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children, userId }: { children: ReactNode, userId: string }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [points, setPoints] = useState<Points[]>(mockPoints);
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);

  const totalPoints = points.reduce((sum, point) => sum + point.amount, 0);

  // Project Functions
  const addProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const timestamp = new Date().toISOString();
    const newProject: Project = {
      id: Date.now().toString(),
      ...projectData,
      user_id: userId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    
    setProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = async (project: Project) => {
    const updatedProject = {
      ...project,
      updated_at: new Date().toISOString(),
    };
    
    setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
    return updatedProject;
  };

  const deleteProject = async (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    
    // Also delete associated tasks
    setTasks(tasks.filter(t => t.project_id !== id));
  };

  // Task Functions
  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const timestamp = new Date().toISOString();
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      user_id: userId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = async (task: Task) => {
    const updatedTask = {
      ...task,
      updated_at: new Date().toISOString(),
    };
    
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    return updatedTask;
  };

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completeTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    
    const updatedTask = {
      ...task,
      status: 'completed' as const,
      updated_at: new Date().toISOString(),
    };
    
    setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    
    // Add points for completing a task
    const timestamp = new Date().toISOString();
    const newPoints: Points = {
      id: Date.now().toString(),
      user_id: userId,
      amount: 5, // 5 points for completing a task
      source: 'task',
      source_id: id,
      created_at: timestamp,
    };
    
    setPoints([...points, newPoints]);
    
    // Check for milestones
    checkTaskMilestones();
    
    return updatedTask;
  };

  // Session Functions
  const addSession = async (sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const timestamp = new Date().toISOString();
    const newSession: Session = {
      id: Date.now().toString(),
      ...sessionData,
      user_id: userId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    
    setSessions([...sessions, newSession]);
    return newSession;
  };

  const updateSession = async (session: Session) => {
    const updatedSession = {
      ...session,
      updated_at: new Date().toISOString(),
    };
    
    setSessions(sessions.map(s => s.id === session.id ? updatedSession : s));
    return updatedSession;
  };

  const deleteSession = async (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const completeSession = async (id: string) => {
    // Add points for completing a session
    const timestamp = new Date().toISOString();
    const newPoints: Points = {
      id: Date.now().toString(),
      user_id: userId,
      amount: 10, // 10 points for completing a session
      source: 'session',
      source_id: id,
      created_at: timestamp,
    };
    
    setPoints([...points, newPoints]);
    
    // Check for milestones
    checkSessionMilestones();
  };

  // Chat Functions
  const addChatMessage = async (content: string) => {
    const timestamp = new Date().toISOString();
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user_id: userId,
      user_email: 'you@example.com', // Replace with actual user email in production
      content,
      created_at: timestamp,
    };
    
    setChatMessages([...chatMessages, newMessage]);
    return newMessage;
  };

  // Milestone checking functions
  const checkTaskMilestones = () => {
    // Task Streak: 5 tasks in 7 days
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    
    const completedTasksInLastWeek = tasks.filter(task => 
      task.status === 'completed' && 
      task.user_id === userId &&
      new Date(task.updated_at) >= oneWeekAgo
    );
    
    if (completedTasksInLastWeek.length >= 5) {
      // Check if milestone already exists
      const hasTaskStreakMilestone = milestones.some(m => 
        m.type === 'task_streak' && 
        m.user_id === userId
      );
      
      if (!hasTaskStreakMilestone) {
        const timestamp = new Date().toISOString();
        const newMilestone: Milestone = {
          id: Date.now().toString(),
          user_id: userId,
          type: 'task_streak',
          achieved_at: timestamp,
          created_at: timestamp,
        };
        
        setMilestones([...milestones, newMilestone]);
      }
    }
  };

  const checkSessionMilestones = () => {
    // Study Focus: 10 total hours of sessions
    const totalSessionMinutes = sessions.reduce((total, session) => total + session.duration, 0);
    const totalSessionHours = totalSessionMinutes / 60;
    
    if (totalSessionHours >= 10) {
      // Check if milestone already exists
      const hasStudyFocusMilestone = milestones.some(m => 
        m.type === 'study_focus' && 
        m.user_id === userId
      );
      
      if (!hasStudyFocusMilestone) {
        const timestamp = new Date().toISOString();
        const newMilestone: Milestone = {
          id: Date.now().toString(),
          user_id: userId,
          type: 'study_focus',
          achieved_at: timestamp,
          created_at: timestamp,
        };
        
        setMilestones([...milestones, newMilestone]);
      }
    }
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        sessions,
        points,
        milestones,
        chatMessages,
        totalPoints,
        
        addProject,
        updateProject,
        deleteProject,
        
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        
        addSession,
        updateSession,
        deleteSession,
        completeSession,
        
        addChatMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
