import React from 'react';
import type { Influencer } from '../types';
import { Instagram, Youtube, Twitter, Linkedin, ExternalLink, Globe } from 'lucide-react';

interface InfluencerCardProps {
  influencer: Influencer;
  onClick: (influencer: Influencer) => void;
  onReplyClick?: (influencer: Influencer) => void;
}

const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return Instagram;
  if (p.includes('youtube')) return Youtube;
  if (p.includes('twitter')) return Twitter;
  if (p.includes('linkedin')) return Linkedin;
  return Globe;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New': return 'bg-gray-700 text-gray-300';
    case 'Sent': return 'bg-blue-900/50 text-blue-300 border-blue-700';
    case 'Delivered': return 'bg-indigo-900/50 text-indigo-300 border-indigo-700';
    case 'Opened': return 'bg-green-900/50 text-green-300 border-green-700';
    case 'Viewed': return 'bg-purple-900/50 text-purple-300 border-purple-700';
    case 'Replied': return 'bg-pink-900/50 text-pink-300 border-pink-700';
    case '⚠ Intercept': return 'bg-red-900/50 text-red-300 border-red-700 animate-pulse';
    case 'Bounced': return 'bg-red-900/50 text-red-300 border-red-700';
    default: return 'bg-gray-700 text-gray-300';
  }
};

export const InfluencerCard: React.FC<InfluencerCardProps> = ({ influencer, onClick, onReplyClick }) => {
  const Icon = getPlatformIcon(influencer.platform);
  const statusColor = getStatusColor(influencer.status);

  return (
    <div 
      onClick={() => onClick(influencer)}
      className={`glass-panel p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group border ${
        influencer.status === '⚠ Intercept' 
          ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
          : influencer.status === 'Replied'
            ? 'border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.1)]'
            : 'border-transparent hover:border-km18-cyan/30'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-km18-purple to-km18-blue flex items-center justify-center text-white font-bold text-lg">
            {influencer.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-semibold truncate max-w-[150px] group-hover:text-km18-cyan transition-colors">
              {influencer.name}
            </h4>
            <a 
              href={`https://${influencer.platform.toLowerCase()}.com/${influencer.handle.replace('@', '')}`} 
              target="_blank" 
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 text-xs flex items-center hover:text-white hover:underline"
            >
              {influencer.handle} <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${statusColor}`}>
            {influencer.status}
          </span>
          {(influencer.status === 'Replied' || influencer.status === '⚠ Intercept') && onReplyClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReplyClick(influencer);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all text-[10px] font-bold border ${
                influencer.status === '⚠ Intercept' 
                  ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-black'
                  : 'bg-km18-cyan/20 text-km18-cyan border-km18-cyan/30 hover:bg-km18-cyan hover:text-black'
              }`}
            >
              <ExternalLink className="w-3 h-3 rotate-45" />
              {influencer.status === '⚠ Intercept' ? 'SECURE REPLY' : 'REPLY'}
            </button>
          )}
          {influencer.outboundReply && (
             <span className="text-[9px] text-green-400 font-mono uppercase">Replied ✓</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
        <div className="flex items-center gap-1">
          <Icon className="w-3 h-3" />
          <span className="truncate">{influencer.platform}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">{influencer.tier}</span>
        </div>
        <div className="col-span-2 truncate">
          <span className="text-gray-500">Cat:</span> {influencer.category}
        </div>
      </div>

    </div>
  );
};