import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Shield, Brain, BookOpen, Zap } from 'lucide-react';
import type { Influencer } from '../types';

interface ReplyModalProps {
  influencer: Influencer;
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, body: string) => void;
}

const RESPONSE_TEMPLATES = [
  {
    id: 'grant',
    label: 'Grant Access',
    text: "Access credentials generated. Your node has been whitelisted for the Alpha Vortex. Welcome to the sovereign web. \n\nCheck your secure drive for the keyfile."
  },
  {
    id: 'stealth',
    label: 'Stealth Protocol',
    text: "We are currently operating in deep stealth. I have flagged your profile for high-priority access once we lift the embargo. \n\nStay tuned."
  },
  {
    id: 'technical',
    label: 'Architects Note',
    text: "Appreciate the deep dive. The goal is total data sovereignty—no middleman, no metadata. \n\nWould love to walk you through the P2P architecture personally."
  },
  {
    id: 'meeting',
    label: 'Secure Sync',
    text: "Your vision aligns with the protocol. Let's take this offline. \n\nI'm available for a secure sync this week to discuss the roadmap."
  }
];

export const ReplyModal: React.FC<ReplyModalProps> = ({ influencer, isOpen, onClose, onSend }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (influencer.replyDetails) {
      setSubject(`Re: ${influencer.replyDetails.subject}`);
    } else {
      setSubject(`Re: The Blacklist // ABHED`);
    }
  }, [influencer]);

  const handleSend = async () => {
    setIsSending(true);
    // Simulate encryption and sending delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    onSend(subject, body);
    setIsSending(false);
    setIsSent(true);
    setTimeout(() => {
      onClose();
      setIsSent(false);
      setBody('');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0c] border border-km18-cyan/30 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl shadow-km18-cyan/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-km18-purple/20 to-km18-cyan/20 p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-km18-cyan/20 flex items-center justify-center border border-km18-cyan/40 text-km18-cyan">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold leading-none">Drafting Outbound Response</h3>
              <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest font-mono">Secure Node: KM18-ENCRYPT-ALPHA</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Incoming Reference */}
          {influencer.replyDetails && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-xs">
              <span className="text-km18-cyan font-mono uppercase text-[9px] block mb-1">Incoming Signal From {influencer.handle}</span>
              <p className="text-gray-400 italic line-clamp-2">"{influencer.replyDetails.body}"</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Recipient</label>
              <div className="bg-white/5 border border-white/10 p-2 rounded text-sm text-gray-300 font-mono">
                {influencer.name} ({influencer.email})
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-2 rounded text-sm text-white focus:outline-none focus:border-km18-cyan transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Body</label>
                <div className="flex gap-2">
                  {RESPONSE_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setBody(template.text)}
                      className="text-[9px] bg-km18-cyan/10 text-km18-cyan border border-km18-cyan/20 px-2 py-1 rounded hover:bg-km18-cyan hover:text-black transition-colors font-mono uppercase flex items-center gap-1"
                    >
                      <Zap className="w-2 h-2" />
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Compose your sovereign response..."
                rows={10}
                className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white focus:outline-none focus:border-km18-cyan transition-colors resize-none font-sans leading-relaxed"
              />
            </div>
          </div>

          {/* Footer / Actions */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase font-mono">
                <Shield className="w-3 h-3 text-km18-cyan" />
                <span>E2EE Active</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase font-mono">
                <Brain className="w-3 h-3 text-km18-purple" />
                <span>Kinjal Mishra</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase font-mono">
                <BookOpen className="w-3 h-3 text-km18-orange" />
                <span>ABHED Protocol</span>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={isSending || isSent || !body.trim()}
              className={`flex items-center gap-2 px-6 py-2 rounded font-bold transition-all ${
                isSent 
                  ? 'bg-green-600 text-white' 
                  : isSending 
                    ? 'bg-km18-cyan/20 text-km18-cyan cursor-wait' 
                    : 'bg-km18-cyan text-black hover:bg-white hover:scale-105 active:scale-95'
              } disabled:opacity-50 disabled:scale-100`}
            >
              {isSent ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  DISPATCHED
                </>
              ) : isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-km18-cyan border-t-transparent rounded-full animate-spin" />
                  ENCRYPTING...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  SEND RESPONSE
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar (Visible during sending) */}
        {isSending && (
          <div className="h-1 w-full bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-km18-cyan animate-[shimmer_2s_infinite] w-1/3" />
          </div>
        )}
      </div>
    </div>
  );
};
