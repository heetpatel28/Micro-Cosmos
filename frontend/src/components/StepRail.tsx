import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Step } from '../types';

interface StepRailProps {
  steps: Step[];
  currentStep: number;
}

const StepRail = ({ steps, currentStep }: StepRailProps) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="glass-card p-6 w-64"
    >
      <div className="flex flex-col gap-4 relative">
        {/* Vertical connector line */}
        <motion.div
          className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-700"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        
        {/* Active progress line */}
        <motion.div
          className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-neon-cyan to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ 
            scaleY: currentStep > 0 ? (currentStep / (steps.length - 1)) : 0,
            originY: 0
          }}
          transition={{ duration: 0.5 }}
          style={{ height: `${((currentStep) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'completed';
          const isPending = step.status === 'pending';

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 relative z-10"
            >
              {/* Step circle */}
              <motion.div
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center
                  ${isActive ? 'bg-neon-cyan shadow-neon-cyan' : ''}
                  ${isCompleted ? 'bg-emerald-500' : ''}
                  ${isPending ? 'bg-slate-700 border-2 border-slate-600' : ''}
                `}
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  boxShadow: isActive 
                    ? '0 0 20px rgba(0, 240, 255, 0.8)' 
                    : 'none',
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity },
                }}
                whileHover={{ scale: 1.1 }}
              >
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                )}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-neon-cyan"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
                {isPending && (
                  <div className="w-2 h-2 rounded-full bg-slate-500" />
                )}
              </motion.div>

              {/* Step label */}
              <motion.div
                className="flex-1 pt-2"
                animate={{
                  color: isActive ? '#00f0ff' : isCompleted ? '#10b981' : '#64748b',
                }}
              >
                <div className="text-xs text-slate-400 mb-1">Step {step.id}</div>
                <div className={`font-medium ${isActive ? 'neon-text' : ''}`}>
                  {step.label}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StepRail;
