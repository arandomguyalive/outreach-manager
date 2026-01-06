import { useState } from 'react';
import { useInfluencers } from './hooks/useInfluencers';
import { StatsCard } from './components/StatsCard';
import { InfluencerCard } from './components/InfluencerCard';
import { LiveCampaignBoard } from './components/LiveCampaignBoard';
import { Filters } from './components/Filters';
import { PitchGenerator } from './components/PitchGenerator';
import type { Influencer } from './types';
import { Users, Send, MailOpen, X, ExternalLink, RefreshCw, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { influencers, stats, loading, filters, setFilters, options } = useInfluencers();
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-km18-darker flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-km18-cyan animate-spin" />
          <p className="text-gray-400 font-mono animate-pulse">Initializing Abhed Outreach...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-km18-darker text-white font-sans selection:bg-km18-cyan selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-km18-purple/10 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-km18-blue/10 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Abhed Outreach
              </h1>
              <p className="text-gray-500 mt-1 font-mono text-sm">
                CAMPAIGN: LAUNCH_ALPHA_01 | TARGET: 980+ LEADS
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-400">Current Date</p>
              <p className="font-mono text-km18-cyan">Jan 06, 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard 
              label="Total Leads" 
              value={stats.total} 
              icon={Users} 
              color="#00D4E5" 
            />
            <StatsCard 
              label="Total Dispatched" 
              value={stats.totalEmailsDispatched} 
              icon={Zap} 
              color="#006096" 
              subtext={`~${(stats.totalEmailsDispatched / (stats.total || 1)).toFixed(1)} emails per lead`}
            />
            <StatsCard 
              label="Unique Contacted" 
              value={stats.uniqueSent} 
              icon={Send} 
              color="#8B5CF6" 
              subtext={`${((stats.uniqueSent / stats.total) * 100).toFixed(1)}% Coverage`}
            />
            <StatsCard 
              label="Opened" 
              value={stats.opened} 
              icon={MailOpen} 
              color="#EB7955" 
              subtext={`${((stats.opened / (stats.uniqueSent || 1)) * 100).toFixed(1)}% Unique Open Rate`}
            />
          </div>

          <LiveCampaignBoard />
        </header>

        <main>
          <Filters filters={filters} setFilters={setFilters} options={options} />

          <div className="mb-4 text-gray-400 text-sm flex justify-between items-center">
            <span>Showing {influencers.length} results</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {influencers.map(inf => (
              <InfluencerCard 
                key={inf.id} 
                influencer={inf} 
                onClick={setSelectedInfluencer} 
              />
            ))}
            {influencers.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">
                No influencers found matching your filters.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedInfluencer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInfluencer(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-km18-card border-l border-white/10 z-50 p-6 overflow-y-auto shadow-2xl"
            >
              <button 
                onClick={() => setSelectedInfluencer(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="mt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-km18-purple to-km18-blue flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-km18-purple/20">
                    {selectedInfluencer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedInfluencer.name}</h2>
                    <a 
                      href={`https://${selectedInfluencer.platform.toLowerCase()}.com/${selectedInfluencer.handle.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-km18-cyan flex items-center hover:underline"
                    >
                      {selectedInfluencer.handle} <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-gray-500 text-xs uppercase">Platform</p>
                    <p className="text-white font-medium">{selectedInfluencer.platform}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-gray-500 text-xs uppercase">Category</p>
                    <p className="text-white font-medium">{selectedInfluencer.category}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-gray-500 text-xs uppercase">Tier</p>
                    <p className="text-white font-medium">{selectedInfluencer.tier}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-gray-500 text-xs uppercase">Location</p>
                    <p className="text-white font-medium">{selectedInfluencer.country}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Send className="w-5 h-5 text-km18-cyan" />
                    Outreach Generator
                  </h3>
                  <PitchGenerator influencer={selectedInfluencer} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Interaction History</h3>
                  <div className="space-y-4">
                    {selectedInfluencer.history.length === 0 ? (
                      <p className="text-gray-500 italic text-sm">No interactions yet.</p>
                    ) : (
                      selectedInfluencer.history.slice().reverse().map(event => (
                        <div key={event.id} className="relative pl-6 border-l border-gray-700 pb-4 last:pb-0">
                          <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full ${event.type.includes('Opened') ? 'bg-green-500' : 'bg-blue-500'}`} />
                          <p className="text-sm font-medium text-white">{event.type}</p>
                          <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
