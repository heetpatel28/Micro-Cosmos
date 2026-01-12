import { motion, AnimatePresence } from "framer-motion";
import { Code, Download, Loader2 } from "lucide-react";

interface ActionBarProps {
  onGenerate: () => void;
  isGenerating: boolean;
  isComplete: boolean;
  progress: number;
  onDownload: () => void;
  disabled?: boolean;
}

const ActionBar = ({
  onGenerate,
  isGenerating,
  isComplete,
  progress,
  onDownload,
  disabled,
}: ActionBarProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-sm text-slate-400 flex-1">
            {isComplete
              ? "✅ Microservice code generated successfully!"
              : isGenerating
                ? "⚙️ Generating microservice..."
                : "Ready to generate microservice code"}
          </div>

          {isGenerating && (
            <div className="w-48">
              <motion.div
                className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-cyan to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.button
              key="download"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownload}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 
                         text-white font-semibold rounded-lg
                         shadow-lg shadow-emerald-500/50
                         hover:shadow-emerald-500/70
                         transition-shadow flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download ZIP
            </motion.button>
          ) : (
            <motion.button
              key="generate"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGenerate}
              disabled={isGenerating || disabled}
              className="px-8 py-3 bg-gradient-to-r from-neon-cyan to-blue-500 
                         text-slate-900 font-bold rounded-lg
                         shadow-lg shadow-neon-cyan/50
                         hover:shadow-neon-cyan/70
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating... {Math.round(progress)}%
                </>
              ) : (
                <>
                  <Code className="w-5 h-5" />
                  Generate Code
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActionBar;
