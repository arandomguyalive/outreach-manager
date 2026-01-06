import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Zap, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_ACTIONS = [
  "Dispatching automated follow-up #2...",
  "Analyzing engagement metrics...",
  "Server heartbeat: Stable",
  "Optimizing delivery route...",
  "Queue processing: Batch #492",
];

const NAMES = ["Tanay", "Sharan", "Varun", "Kunal", "Hitesh", "MortaL", "Sc0ut", "Niharika", "Carry", "Gaurav"];

interface LiveCampaignBoardProps {
  onAction?: (type: 'sent') => void;
}

export const LiveCampaignBoard: React.FC<LiveCampaignBoardProps> = ({ onAction }) => {
  const [logs, setLogs] = useState<{ id: string; text: string; type: 'info' | 'success' | 'warning' }[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update progress bar
      setProgress(p => (p >= 100 ? 0 : p + 2));

      // Add random log
      const randomAction = MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)];
      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
      
      const rand = Math.random();
      let type: 'info' | 'success' | 'warning' = 'info';
      let text = '';

      if (rand < 0.4) {
        text = `Sent scheduled email to @${randomName}...`;
        type = 'info';
        if (onAction) onAction('sent');
      } else if (rand < 0.7) {
        text = `Email DELIVERED to @${randomName} (Latency: 124ms)`;
        type = 'success';
      } else if (rand < 0.9) {
        text = randomAction;
        type = 'info';
      } else {
        text = `Rate limit warning for provider. Throttling...`;
        type = 'warning';
      }

      const newLog = {
        id: Math.random().toString(36),
        text: `[${new Date().toLocaleTimeString()}] ${text}`,
        type
      };

      setLogs(prev => [...prev.slice(-8), newLog]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/10 mb-8 relative overflow-hidden">
      {/* Pulse Effect */}
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-ping" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500" />

      <div className="flex items-center gap-3 mb-4">
        <Terminal className="w-5 h-5 text-km18-cyan" />
        <h3 className="text-white font-bold text-lg">Live Outreach Terminal</h3>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Current Batch Processing</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-km18-purple to-km18-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "linear" }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Auto-sending every 5 minutes • Next batch in {(5 - (progress / 20)).toFixed(1)}m
        </p>
      </div>

      <div className="bg-black/40 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto space-y-2 border border-white/5" ref={scrollRef}>
        {logs.map(log => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 ${
              log.type === 'success' ? 'text-green-400' : 
              log.type === 'warning' ? 'text-yellow-400' : 
              'text-blue-300'
            }`}
          >
            {log.type === 'success' && <CheckCircle2 className="w-3 h-3 shrink-0" />}
            {log.type === 'warning' && <AlertCircle className="w-3 h-3 shrink-0" />}
            {log.type === 'info' && <Zap className="w-3 h-3 shrink-0" />}
            <span>{log.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
