import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

const ProgressBar = ({ progress, className = "" }: ProgressBarProps) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`relative w-full ${className}`}>
      {/* Background track */}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        {/* Progress fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-neon-cyan via-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>

      {/* Progress text */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-slate-400">Progress</span>
        <motion.span
          className="text-xs font-semibold text-neon-cyan"
          key={clampedProgress}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          {Math.round(clampedProgress)}%
        </motion.span>
      </div>
    </div>
  );
};

export default ProgressBar;

