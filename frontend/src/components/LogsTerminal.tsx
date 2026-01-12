import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import type { LogEntry } from '../types';

interface LogsTerminalProps {
  logs: LogEntry[];
  autoScroll?: boolean;
}

const LogsTerminal = ({ logs }: LogsTerminalProps) => {
  const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (logs.length === 0) {
      setDisplayedLogs([]);
      return;
    }

    // Simulate typewriter effect by adding logs one by one
    const timeout = setTimeout(() => {
      setDisplayedLogs(logs);
    }, 100);

    return () => clearTimeout(timeout);
  }, [logs]);

  const getTypeStyles = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-emerald-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-cyan-400';
    }
  };

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
      default:
        return '→';
    }
  };

  return (
    <GlassCard className="h-full flex flex-col" glowColor="cyan">
      <div className="flex items-center gap-2 p-4 border-b border-slate-700/50">
        <Terminal className="w-5 h-5 text-neon-cyan" />
        <h3 className="font-semibold text-slate-200">System Logs</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-900/50 font-mono text-sm">
        <AnimatePresence mode="popLayout">
          {displayedLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 mb-2"
            >
              <span className="text-slate-500 text-xs flex-shrink-0">
                {log.timestamp}
              </span>
              <span className={`${getTypeStyles(log.type)} flex-shrink-0`}>
                {getIcon(log.type)}
              </span>
              <motion.span
                className={`${getTypeStyles(log.type)} flex-1`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {log.message}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {logs.length === 0 && (
          <div className="text-slate-500 italic">
            Waiting for system logs...
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default LogsTerminal;
