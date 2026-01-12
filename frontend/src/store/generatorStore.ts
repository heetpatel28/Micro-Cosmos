import { create } from "zustand";
import type { StepSelection, LogEntry, Service } from "../types";

interface GeneratorState {
  // Configuration
  domains: string[];
  services: Service[];
  isLoadingConfig: boolean;

  // Selection state
  selections: StepSelection;
  currentStep: number;

  // Generation state
  jobId: string | null;
  isGenerating: boolean;
  progress: number;
  logs: LogEntry[];
  downloadUrl: string | null;
  error: string | null;

  // Actions
  setConfig: (domains: string[], services: Service[]) => void;
  setLoadingConfig: (loading: boolean) => void;
  setSelection: (key: keyof StepSelection, value: string) => void;
  setCurrentStep: (step: number) => void;
  setJobId: (jobId: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
  setProgress: (progress: number) => void;
  addLog: (type: LogEntry["type"], message: string) => void;
  clearLogs: () => void;
  setDownloadUrl: (url: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;


}

const initialState = {
  domains: [],
  services: [],
  isLoadingConfig: false,
  selections: {},
  currentStep: 1,
  jobId: null,
  isGenerating: false,
  progress: 0,
  logs: [],
  downloadUrl: null,
  error: null,
};

export const useGeneratorStore = create<GeneratorState>((set) => ({
  ...initialState,

  setConfig: (domains, services) => set({ domains, services }),
  setLoadingConfig: (loading) => set({ isLoadingConfig: loading }),

  setSelection: (key, value) =>
    set((state) => ({
      selections: { ...state.selections, [key]: value },
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  setJobId: (jobId) => set({ jobId }),

  setIsGenerating: (generating) => set({ isGenerating: generating }),

  setProgress: (progress) => set({ progress }),

  addLog: (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp,
      message,
      type,
    };
    set((state) => ({
      logs: [...state.logs, logEntry],
    }));
  },

  clearLogs: () => set({ logs: [] }),

  setDownloadUrl: (url) => set({ downloadUrl: url }),

  setError: (error) => set({ error }),

  reset: () => set({ ...initialState }),


}));
