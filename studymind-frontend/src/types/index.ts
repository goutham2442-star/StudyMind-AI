export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  university?: string;
}

export interface Paper {
  id: string;
  user_id: string;
  title: string;
  file_url: string;
  subject: string;
  year?: number;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  paper_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface SavedQuestion {
  id: string;
  user_id: string;
  paper_id?: string;
  question: string;
  answer: string;
  created_at: string;
}

export interface ExamQuestion {
  id: string;
  paper_id: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
}

export interface KeyTopic {
  id: string;
  paper_id: string;
  title: string;
  summary: string;
  importance: number; // 1-10
}
