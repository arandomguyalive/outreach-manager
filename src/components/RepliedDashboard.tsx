import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, IndianRupee, Users, CheckCircle } from 'lucide-react';
import type { Influencer } from '../types';
import { InfluencerCard } from './InfluencerCard';

interface RepliedDashboardProps {
  influencers: Influencer[];
  onClose: () => void;
  onSelectInfluencer: (influencer: Influencer) => void;
  onReplyClick?: (influencer: Influencer) => void;
}

export const RepliedDashboard: React.FC<RepliedDashboardProps> = ({ influencers, onClose, onSelectInfluencer, onReplyClick }) => {
  const TARGET_AMOUNT = 10000000; // 1 Crore
  const VALUE_PER_CREATOR = 20000;
  
  const currentRaised = influencers.length * VALUE_PER_CREATOR;
  const progressPercentage = Math.min((currentRaised / TARGET_AMOUNT) * 100, 100);
  const remainingAmount = Math.max(TARGET_AMOUNT - currentRaised, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-km18-card border border-white/10 w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-km18-purple/20 to-km18-blue/20">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-km18-cyan" />
              Interest Valuation Tracker
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Valuating high-interest signals and replies as potential initial backers/partners.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Stats Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Progress Card */}
          <div className="md:col-span-2 bg-black/20 rounded-xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-km18-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-end mb-4 relative z-10">
              <div>
                <p className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-1">Current Valuation</p>
                <div className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-km18-cyan">
                  {formatCurrency(currentRaised)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-1">Target</p>
                <p className="text-xl font-mono font-bold text-gray-300">{formatCurrency(TARGET_AMOUNT)}</p>
              </div>
            </div>

            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-km18-purple via-km18-pink to-km18-cyan shadow-[0_0_15px_rgba(0,212,229,0.5)]"
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 font-mono relative z-10">
              <span>{progressPercentage.toFixed(2)}% REACHED</span>
              <span>{formatCurrency(remainingAmount)} REMAINING</span>
            </div>
          </div>

          {/* Stats Details */}
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-km18-pink/20 rounded-lg">
                <Users className="w-6 h-6 text-km18-pink" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">Validated Interest</p>
                <p className="text-2xl font-bold text-white">{influencers.length}</p>
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <IndianRupee className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">Value Per Unit</p>
                <p className="text-2xl font-bold text-white">₹20,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="flex-1 overflow-y-auto p-6 border-t border-white/10 bg-black/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-km18-cyan" />
              Interested Titans & Signals
            </h3>
            <span className="text-xs text-gray-500 uppercase">
              Showing {influencers.length} items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {influencers.map(inf => (
              <InfluencerCard 
                key={inf.id} 
                influencer={inf} 
                onClick={onSelectInfluencer}
                onReplyClick={onReplyClick}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};