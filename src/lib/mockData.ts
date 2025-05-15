
import { Project, Task, Session, Points, Milestone, ChatMessage, MusicTrack } from './types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Portfolio Website',
    description: 'Personal portfolio website to showcase projects',
    user_id: '1',
    created_at: '2023-05-10T10:00:00Z',
    updated_at: '2023-05-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'E-commerce App',
    description: 'Online store application with React and Node.js',
    user_id: '1',
    created_at: '2023-05-15T10:00:00Z',
    updated_at: '2023-05-15T10:00:00Z',
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage',
    project_id: '1',
    due_date: '2023-05-20T10:00:00Z',
    priority: 'high',
    status: 'completed',
    user_id: '1',
    created_at: '2023-05-10T10:00:00Z',
    updated_at: '2023-05-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Implement responsive layout',
    project_id: '1',
    due_date: '2023-05-25T10:00:00Z',
    priority: 'medium',
    status: 'in_progress',
    user_id: '1',
    created_at: '2023-05-12T10:00:00Z',
    updated_at: '2023-05-12T10:00:00Z',
  },
  {
    id: '3',
    title: 'Set up product database',
    project_id: '2',
    due_date: '2023-05-30T10:00:00Z',
    priority: 'high',
    status: 'not_started',
    user_id: '1',
    created_at: '2023-05-15T10:00:00Z',
    updated_at: '2023-05-15T10:00:00Z',
  },
];

export const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Learn React Hooks',
    start_time: '2023-05-20T15:00:00Z',
    duration: 60, // 60 minutes
    zoom_url: 'https://zoom.us/j/123456789',
    user_id: '1',
    created_at: '2023-05-10T10:00:00Z',
    updated_at: '2023-05-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Database Design Workshop',
    start_time: '2023-05-25T18:00:00Z',
    duration: 120, // 120 minutes
    user_id: '1',
    created_at: '2023-05-15T10:00:00Z',
    updated_at: '2023-05-15T10:00:00Z',
  },
];

export const mockPoints: Points[] = [
  {
    id: '1',
    user_id: '1',
    amount: 5,
    source: 'task',
    source_id: '1',
    created_at: '2023-05-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: '1',
    amount: 10,
    source: 'session',
    source_id: '1',
    created_at: '2023-05-20T16:00:00Z',
  },
];

export const mockMilestones: Milestone[] = [
  {
    id: '1',
    user_id: '1',
    type: 'task_streak',
    achieved_at: '2023-05-15T10:00:00Z',
    created_at: '2023-05-15T10:00:00Z',
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    user_id: '2',
    user_email: 'jane@example.com',
    content: 'Has anyone used the new React 18 features yet?',
    created_at: '2023-05-19T14:30:00Z',
  },
  {
    id: '2',
    user_id: '1',
    user_email: 'john@example.com',
    content: 'Yes, I\'ve been using concurrent mode. It\'s pretty good for handling loading states.',
    created_at: '2023-05-19T14:32:00Z',
  },
  {
    id: '3',
    user_id: '3',
    user_email: 'sam@example.com',
    content: 'I\'m planning to start a study session on React 18 next week if anyone wants to join.',
    created_at: '2023-05-19T14:35:00Z',
  },
];

export const mockMusicTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Coding Focus',
    artist: 'Chillhop Music',
    url: 'https://samplelib.com/lib/preview/mp3/sample-15s.mp3',
  },
  {
    id: '2',
    title: 'Deep Concentration',
    artist: 'Lo-Fi Beats',
    url: 'https://samplelib.com/lib/preview/mp3/sample-12s.mp3',
  },
  {
    id: '3',
    title: 'Study Session',
    artist: 'Ambient Tunes',
    url: 'https://samplelib.com/lib/preview/mp3/sample-9s.mp3',
  },
  {
    id: '4',
    title: 'Midnight Coding',
    artist: 'Chill Vibes',
    url: 'https://samplelib.com/lib/preview/mp3/sample-6s.mp3',
  },
];
