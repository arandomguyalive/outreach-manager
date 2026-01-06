import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Zap, CheckCircle2, AlertCircle, Clock, Loader2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_ACTIONS = [
  "Dispatching automated follow-up #2...",
  "Analyzing engagement metrics...",
  "Server heartbeat: Stable",
  "Optimizing delivery route...",
  "Queue processing: Batch #492",
];

const MOCK_WAIT_ACTIONS = [
  "Rotating proxy IP address...",
  "Awaiting SMTP handshake...",
  "Queue buffer limit reached (98%). Pausing...",
  "Verifying DKIM signature...",
  "Rate limit approach. Cooling down..."
];

const MOCK_ERROR_ACTIONS = [
  "SMTP Error: 550 Requested action not taken",
  "Connection timed out (port 587)",
  "Bounced: User quota exceeded",
  "DNS Error: MX record not found",
  "Blocked by spam filter (Content-Type)"
];

const NAMES = ["Tanay", "Sharan", "Varun", "Kunal", "Hitesh", "MortaL", "Sc0ut", "Niharika", "Carry", "Gaurav"];

interface LiveCampaignBoardProps {
  onAction?: (type: 'sent') => void;
}

export const LiveCampaignBoard: React.FC<LiveCampaignBoardProps> = ({ onAction }) => {
  const [logs, setLogs] = useState<{ id: string; text: string; type: 'info' | 'success' | 'warning' | 'error' | 'wait' }[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const runLoop = () => {
      if (isPaused) return;

      // Randomize interval between 2s and 5s for realism
      const nextTick = Math.random() * 3000 + 2000;

      timeoutId = setTimeout(() => {
        // Update progress bar
        setProgress(p => (p >= 100 ? 0 : p + Math.random() * 5));

        // Add random log
        const randomAction = MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)];
        const randomWait = MOCK_WAIT_ACTIONS[Math.floor(Math.random() * MOCK_WAIT_ACTIONS.length)];
        const randomError = MOCK_ERROR_ACTIONS[Math.floor(Math.random() * MOCK_ERROR_ACTIONS.length)];
        const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
        
        const rand = Math.random();
        let type: 'info' | 'success' | 'warning' | 'error' | 'wait' = 'info';
        let text = '';

        if (rand < 0.30) {
          text = `Sent scheduled email to @${randomName}...`;
          type = 'info';
          if (onAction) onAction('sent');
        } else if (rand < 0.50) {
          text = `Email DELIVERED to @${randomName} (Latency: ${Math.floor(Math.random() * 800 + 120)}ms)`;
          type = 'success';
        } else if (rand < 0.60) {
          text = `Email OPENED by @${randomName} 🟢`;
          type = 'success';
        } else if (rand < 0.75) {
          text = randomWait;
          type = 'wait';
          // Pause the loop for a few seconds to simulate buffering
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), Math.random() * 4000 + 2000);
        } else if (rand < 0.85) {
          text = `Failed: @${randomName} - ${randomError}`;
          type = 'error';
        } else if (rand < 0.95) {
          text = randomAction;
          type = 'info';
        } else {
          text = `Rate limit warning for provider. Throttling...`;
          type = 'warning';
          // Throttle pause
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 3000);
        }

        const newLog = {
          id: Math.random().toString(36),
          text: `[${new Date().toLocaleTimeString()}] ${text}`,
          type
        };

        setLogs(prev => [...prev.slice(-8), newLog]);
        
        // Continue loop if not paused (handled by effect re-trigger on isPaused change)
        if (!isPaused) runLoop(); 

      }, nextTick);
    };

    runLoop();

    return () => clearTimeout(timeoutId);
  }, [isPaused, onAction]);

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
              log.type === 'error' ? 'text-red-500' :
              log.type === 'wait' ? 'text-gray-500 animate-pulse' :
              'text-blue-300'
            }`}
          >
            {log.type === 'success' && <CheckCircle2 className="w-3 h-3 shrink-0" />}
            {log.type === 'warning' && <AlertCircle className="w-3 h-3 shrink-0" />}
            {log.type === 'error' && <XCircle className="w-3 h-3 shrink-0" />}
            {log.type === 'wait' && <Loader2 className="w-3 h-3 shrink-0 animate-spin" />}
            {log.type === 'info' && <Zap className="w-3 h-3 shrink-0" />}
            <span>{log.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
