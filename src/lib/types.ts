
export type User = {
  id: string;
  email: string;
  created_at: string;
  avatar_url?: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  title: string;
  project_id: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed';
  user_id: string;
  created_at: string;
  updated_at: string;
  github_issue_id?: string;
};

export type Session = {
  id: string;
  title: string;
  start_time: string;
  duration: number; // in minutes
  zoom_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  google_event_id?: string;
};

export type Points = {
  id: string;
  user_id: string;
  amount: number;
  source: 'task' | 'session' | 'project';
  source_id: string;
  created_at: string;
};

export type Milestone = {
  id: string;
  user_id: string;
  type: 'task_streak' | 'study_focus' | 'project_finisher';
  achieved_at: string;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  user_email: string;
  content: string;
  created_at: string;
};

export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  url: string;
};

export type PlayerState = {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
};
