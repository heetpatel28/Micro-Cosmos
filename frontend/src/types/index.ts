/**
 * Type definitions for the Microservice Generator Dashboard
 */

export interface Domain {
  name: string;
}

export interface StackVersion {
  id: string;
  name: string;
  versions: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  domains: string[];
  serviceType: 'frontend' | 'backend' | 'infra';
  allowedStacks: StackVersion[];
}

export interface ConfigResponse {
  domains: string[];
  services: Service[];
}

export interface GenerationRequest {
  domain: string;
  service: string;
  serviceType: 'frontend' | 'backend' | 'infra';
  stack: string;
  version: string;
  serviceName?: string;
  port?: number;
  dbUrl?: string;
  jwtSecret?: string;
}

export interface GenerationResponse {
  success: boolean;
  data?: {
    jobId: string;
    status: string;
    message: string;
  };
  code?: string;
  message?: string;
  details?: any;
}

export interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SocketLogEvent {
  type: 'log' | 'progress' | 'done' | 'error';
  jobId: string;
  data: string | number | { downloadUrl: string } | { error: string };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface StepSelection {
  domain?: string;
  service?: string;
  serviceType?: 'frontend' | 'backend' | 'infra';
  stack?: string;
  version?: string;
}

export interface Step {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

