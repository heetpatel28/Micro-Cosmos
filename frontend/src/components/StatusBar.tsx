import { motion } from 'framer-motion';
import { Shield, Zap, CheckCircle2 } from 'lucide-react';

const StatusBar = () => {
  const statusItems = [
    { icon: CheckCircle2, label: 'System Operational', status: 'operational', color: 'text-emerald-400' },
    { icon: Shield, label: 'Security Active', status: 'secure', color: 'text-blue-400' },
    { icon: Zap, label: 'Performance Optimal', status: 'optimal', color: 'text-cyan-400' },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card p-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold neon-text">Microservice Generator</h1>
        <div className="h-4 w-px bg-slate-700" />
        <span className="text-sm text-slate-400">Developer Portal</span>
      </div>
      
      <div className="flex items-center gap-6">
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.status}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs text-slate-400">{item.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StatusBar;

