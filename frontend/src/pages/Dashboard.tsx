import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import StatusBar from "../components/StatusBar";
import StepRail from "../components/StepRail";
import StepPanels from "../components/StepPanels";
import LogsTerminal from "../components/LogsTerminal";
import ActionBar from "../components/ActionBar";
import ProgressBar from "../components/ProgressBar";
import { useGeneratorStore } from "../store/generatorStore";
import { fetchConfig, createGenerationJob, downloadGeneratedService } from "../services/api";
import { subscribeToJob } from "../services/socket";
import type { Step, Service, StackVersion } from "../types";

const TOTAL_STEPS = 5;

const Dashboard = () => {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const {
    domains,
    services,
    isLoadingConfig,
    selections,
    currentStep,
    jobId,
    isGenerating,
    progress,
    logs,
    downloadUrl,
    setConfig,
    setLoadingConfig,
    setSelection,
    setCurrentStep,
    setJobId,
    setIsGenerating,
    setProgress,
    addLog,
    clearLogs,
    setDownloadUrl,
    setError,
  } = useGeneratorStore();

  // Fetch configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      setLoadingConfig(true);
      try {
        const config = await fetchConfig();
        setConfig(config.domains, config.services);
        addLog("info", "✅ Configuration loaded successfully");
      } catch (err) {
        addLog(
          "error",
          `❌ Failed to load configuration: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      } finally {
        setLoadingConfig(false);
      }
    };

    loadConfig();
  }, [setLoadingConfig, setConfig, addLog]);

  // Subscribe to WebSocket updates when jobId changes
  useEffect(() => {
    if (jobId) {
      // Cleanup previous subscription if exists
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      // Subscribe to WebSocket updates
      unsubscribeRef.current = subscribeToJob(jobId, {
        onLog: (message) => {
          addLog("info", message);
        },
        onProgress: (prog) => {
          setProgress(prog);
        },
        onDone: (url) => {
          setDownloadUrl(url);
          setIsGenerating(false);
          addLog("success", "✅ Generation complete!");
          addLog("info", `📦 Ready for download: ${url}`);
        },
        onError: (err) => {
          setError(err);
          setIsGenerating(false);
          addLog("error", `❌ Generation failed: ${err}`);
        },
      });

      // Cleanup on unmount or when jobId changes
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    }
  }, [jobId, addLog, setProgress, setDownloadUrl, setIsGenerating, setError]);

  // Get options for current step
  const getOptionsForStep = (step: number): Array<{ id: string; label: string; description?: string }> => {
    switch (step) {
      case 1: // Domain
        return domains.map((domain: string) => ({
          id: domain,
          label: domain,
          description: `Generate services for ${domain} domain`,
        }));

      case 2: // Service
        if (!selections.domain) return [];
        const availableServices = services.filter((s: Service) => s.domains.includes(selections.domain!));
        return availableServices.map((service: Service) => ({
          id: service.id,
          label: service.name,
          description: service.description,
        }));

      case 3: // Stack
        if (!selections.service) return [];
        const selectedService = services.find((s: Service) => s.id === selections.service);
        if (!selectedService) return [];
        return selectedService.allowedStacks.map((stack: StackVersion) => ({
          id: stack.id,
          label: stack.name,
          description: `Available versions: ${stack.versions.join(", ")}`,
        }));

      case 4: // Version
        if (!selections.service || !selections.stack) return [];
        const service = services.find((s: Service) => s.id === selections.service);
        if (!service) return [];
        const stack = service.allowedStacks.find((s: StackVersion) => s.id === selections.stack);
        if (!stack) return [];
        return stack.versions.map((version: string) => ({
          id: version,
          label: `Version ${version}`,
          description: `Use ${stack.name} ${version}`,
        }));

      case 5: // Review
        return [
          {
            id: "review",
            label: "Review Selections",
            description: `Domain: ${selections.domain}, Service: ${selections.service}, Stack: ${selections.stack}, Version: ${selections.version}`,
          },
        ];

      default:
        return [];
    }
  };

  const handleSelect = useCallback(
    (value: string) => {
      const stepMapping: Array<keyof typeof selections> = [
        "domain",
        "service",
        "stack",
        "version",
      ];

      if (currentStep <= 4) {
        const key = stepMapping[currentStep - 1];
        setSelection(key, value);

        // If selecting service, also set serviceType
        if (key === "service") {
          const selectedService = services.find((s: Service) => s.id === value);
          if (selectedService) {
            setSelection("serviceType", selectedService.serviceType);
          }
        }

        addLog("info", `✓ Selected: ${value}`);
      }

      // Auto-advance to next step (except step 5)
      if (currentStep < TOTAL_STEPS) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 300);
      }
    },
    [currentStep, selections, services, setSelection, setCurrentStep, addLog]
  );

  const isSelectionValid = Boolean(
    selections.domain &&
    selections.service &&
    selections.stack &&
    selections.version
  );

  const handleGenerate = async () => {
    // Prevent duplicate requests
    if (isGenerating) return;

    // Validate all selections
    if (!isSelectionValid) {
      addLog("warning", "⚠️ Please complete all steps before generating");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    clearLogs();
    setError(null);

    try {
      addLog("info", "🚀 Initiating microservice generation...");

      const request = {
        domain: selections.domain!,
        service: selections.service!,
        serviceType: selections.serviceType!,
        stack: selections.stack!,
        version: selections.version!,
        serviceName: `${selections.service}-${Date.now()}`,
        port: 3000,
      };

      const response = await createGenerationJob(request);

      if (response.success && response.data) {
        const newJobId = response.data.jobId;
        setJobId(newJobId);
        addLog("info", `✅ Generation job created: ${newJobId}`);
        // WebSocket subscription will happen automatically via useEffect when jobId is set
      } else {
        throw new Error(response.message || 'Generation failed to start');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      const errorCode = err.response?.data?.code || "GENERATION_ERROR";

      setError(errorMessage);
      setIsGenerating(false);
      addLog("error", `❌ Failed: ${errorMessage}`);

      if (errorCode === 'COMPATIBILITY_ERROR') {
        addLog("warning", "⚠️ Please check your stack/version combination");
      }
    }
  };

  const handleDownload = () => {
    if (jobId && downloadUrl) {
      window.open(downloadGeneratedService(jobId), "_blank");
      addLog("success", "📥 Download initiated");
    } else if (jobId) {
      window.open(downloadGeneratedService(jobId), "_blank");
      addLog("info", "📥 Download initiated");
    } else {
      addLog("error", "❌ No download available");
    }
  };

  // Build step statuses
  const steps: Step[] = [
    {
      id: 1,
      label: "Domain",
      status: currentStep === 1 ? "active" : selections.domain ? "completed" : "pending",
    },
    {
      id: 2,
      label: "Service",
      status: currentStep === 2 ? "active" : selections.service ? "completed" : "pending",
    },
    {
      id: 3,
      label: "Stack",
      status: currentStep === 3 ? "active" : selections.stack ? "completed" : "pending",
    },
    {
      id: 4,
      label: "Version",
      status: currentStep === 4 ? "active" : selections.version ? "completed" : "pending",
    },
    {
      id: 5,
      label: "Generate",
      status: currentStep === 5 ? "active" : "pending",
    },
  ];

  const getSelectedValue = () => {
    const stepMapping: Array<keyof typeof selections> = [
      "domain",
      "service",
      "stack",
      "version",
    ];
    return currentStep <= 4 ? selections[stepMapping[currentStep - 1]] : undefined;
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex overflow-hidden">
      {/* Background effects can go here or be removed for cleaner look, trying to keep subtle */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-50" />
      </div>

      {/* LEFT PANEL: Vertical Stepper (Fixed ~280px) */}
      <div className="w-[280px] flex-none h-full border-r border-white/5 bg-slate-900/50 backdrop-blur-sm z-10 flex flex-col">
        <div className="p-6">
          <div
            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.location.reload()}
          >
            <img src="/logo.png" alt="Micro Cosmos Logo" className="w-12 h-12 object-contain" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-blue-500 bg-clip-text text-transparent leading-none">
                Micro Cosmos
              </h1>
              <p className="text-[10px] font-bold bg-gradient-to-r from-neon-cyan to-blue-500 bg-clip-text text-transparent mt-1 tracking-wide">
                Micro Sales , Macro Impact
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
          <StepRail steps={steps} currentStep={currentStep} />
        </div>
        <div className="p-4 border-t border-white/5 text-xs font-bold bg-gradient-to-r from-neon-cyan to-blue-500 bg-clip-text text-transparent text-center">
          v2.0.0 Enterprise Edition
        </div>
      </div>

      {/* CENTER PANEL: Flexible Main Content */}
      <div className="flex-1 min-w-0 h-full flex flex-col relative z-20 bg-slate-950/80">
        {/* Header */}
        <div className="flex-none p-4 border-b border-white/5">
          <StatusBar />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden relative p-6">
          {isLoadingConfig ? (
            <div className="h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading configuration...</p>
              </motion.div>
            </div>
          ) : (
            <div className="h-full">
              <StepPanels
                step={currentStep}
                selectedValue={getSelectedValue()}
                options={getOptionsForStep(currentStep)}
                onSelect={handleSelect}
                downloadUrl={downloadUrl}
                isComplete={!!downloadUrl && !isGenerating}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-none p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
          <ActionBar
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            isComplete={!!downloadUrl && !isGenerating}
            progress={progress}
            onDownload={handleDownload}
            disabled={!isSelectionValid}
          />
        </div>
      </div>

      {/* RIGHT PANEL: Live Logs (Fixed ~360px) */}
      <div className="w-[360px] flex-none h-full border-l border-white/5 bg-black/40 backdrop-blur-sm z-10 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <span className="font-mono text-sm text-slate-300">System Logs</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <LogsTerminal logs={logs} />
        </div>
        {isGenerating && (
          <div className="p-4 border-t border-white/5">
            <ProgressBar progress={progress} />
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;

