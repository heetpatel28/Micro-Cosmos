import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./GlassCard";
import { Server, Layers, Code2, Package, Globe } from "lucide-react";
import ReviewPanel from "./ReviewPanel";

interface StepPanelsProps {
  step: number;
  selectedValue?: string;
  options: Array<{ id: string; label: string; description?: string }>;
  onSelect: (value: string) => void;
  downloadUrl?: string | null;
  isComplete?: boolean;
}

const stepConfigs = [
  {
    icon: Globe,
    title: "Select Domain",
    description: "Choose your business domain",
  },
  {
    icon: Server,
    title: "Select Service",
    description: "Choose the microservice type",
  },
  {
    icon: Layers,
    title: "Select Stack",
    description: "Choose your technology stack",
  },
  {
    icon: Code2,
    title: "Select Version",
    description: "Choose the stack version",
  },
  {
    icon: Package,
    title: "Review & Generate",
    description: "Review your selections and generate",
  },
];

const StepPanels = ({ step, selectedValue, options, onSelect, downloadUrl, isComplete }: StepPanelsProps) => {
  const config = stepConfigs[step - 1] || stepConfigs[0];
  const Icon = config.icon;

  // If we are on the final step and generation is complete, show the full Review UI
  if (step === 5 && isComplete && downloadUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Generation Complete</h2>
            <p className="text-sm text-slate-500">Review your generated code below</p>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ReviewPanel downloadUrl={downloadUrl} />
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <GlassCard
          className="p-8 h-full flex flex-col"
          glowColor={step % 2 === 0 ? "purple" : "blue"}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-blue-500/20">
              <Icon className="w-6 h-6 text-neon-cyan" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">{config.title}</h2>
              <p className="text-slate-400">{config.description}</p>
            </div>
          </div>

          {options.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg">
              <div className="text-center text-slate-500">
                <p>No options available</p>
                <p className="text-sm">Please complete previous steps</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {options.map((option, index) => {
                const isSelected = selectedValue === option.id;
                // Special styling for Review step summary items
                const isReviewItem = step === 5;
                const hasDescription = !!option.description;

                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={!isReviewItem ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isReviewItem ? { scale: 0.98 } : {}}
                    onClick={() => !isReviewItem && onSelect(option.id)}
                    className={`
                    group relative overflow-hidden rounded-xl border text-left transition-all duration-300
                    ${hasDescription ? 'p-5' : 'px-6 py-5 flex items-center'}
                    ${isSelected
                        ? "border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-neon-cyan/50 z-10"
                        : isReviewItem
                          ? "border-white/5 bg-white/5 cursor-default"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20"
                      }
                  `}
                  >
                    {/* Hover Gradient Overlay */}
                    {!isSelected && !isReviewItem && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    )}

                    <div className={`w-full flex justify-between relative z-10 ${hasDescription ? 'items-start' : 'items-center'}`}>
                      <div className="flex-1 min-w-0 pr-4">
                        <h3
                          className={`text-base font-bold tracking-wide truncate leading-relaxed transition-colors duration-300 ${isSelected ? "text-neon-cyan" : "text-slate-200 group-hover:text-white"
                            }`}
                        >
                          {option.label}
                        </h3>
                        {option.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                            {option.description}
                          </p>
                        )}
                      </div>

                      {isSelected && !isReviewItem && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-neon-cyan flex-none flex items-center justify-center shadow-lg shadow-neon-cyan/30"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};

export default StepPanels;

