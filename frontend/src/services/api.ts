import axios from "axios";
import type { ConfigResponse, GenerationRequest, GenerationResponse, JobStatus } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});





/**
 * Fetch available configuration from backend
 */
export const fetchConfig = async (): Promise<ConfigResponse> => {
  const response = await api.get<ConfigResponse>("/config");
  return response.data;
};

/**
 * Create a generation job
 */
export const createGenerationJob = async (
  request: GenerationRequest
): Promise<GenerationResponse> => {
  const response = await api.post<GenerationResponse>("/generate", request);
  return response.data;
};

/**
 * Get job status
 */
export const getJobStatus = async (jobId: string): Promise<JobStatus> => {
  const response = await api.get<JobStatus>(`/jobs/${jobId}`);
  return response.data;
};

/**
 * Get download URL (triggers download)
 */
export const downloadGeneratedService = (jobId: string): string => {
  return `${API_BASE_URL}/download/${jobId}`;
};
