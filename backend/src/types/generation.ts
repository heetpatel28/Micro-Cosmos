import { GenerationRequest } from '../config/staticConfig.js';

export interface GenerationJob {
  id: string;
  request: GenerationRequest;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  downloadUrl?: string;
  error?: string;
  errorCode?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface SocketLogEvent {
  type: 'log' | 'progress' | 'done' | 'error';
  jobId: string;
  data: string | number | { downloadUrl: string } | { error: string, code?: string };
}

