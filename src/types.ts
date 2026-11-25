export type PageId =
  | 'home'
  | 'pending'
  | 'your-problems'
  | 'send-problem'
  | 'live-agent';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ProblemComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export type PendingStatus = 'pending' | 'working';
export type UserFeedbackStatus = 'working';

export interface ProblemItem {
  id: string;
  number: number;
  label: string;
  title: string;
  imageUrl?: string;
  imageAlt: string;
  solutionShort: string;
  solutionFull: string[];
  likes: number;
  likedByMe: boolean;
  comments: ProblemComment[];
  createdAt: string;
  section: 'home' | 'pending' | 'user';
  pendingStatus?: PendingStatus;
  userFeedback?: UserFeedbackStatus;
  userEmail?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}
