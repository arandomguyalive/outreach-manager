import { useState, useEffect, useMemo } from 'react';
import type { Influencer, FilterState } from '../types';
import { parseRawLeads } from '../utils/parser';
import { RAW_LEADS_DATA } from '../data/raw_leads';
import { REPLY_DATA } from '../data/replies';

export const useInfluencers = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    platform: 'All',
    tier: 'All',
    status: 'All'
  });

  const [liveDispatchedOffset, setLiveDispatchedOffset] = useState(() => {
    const saved = localStorage.getItem('abhed_live_dispatched');
    // Ensure we start with a high number if no save exists, or if the save is "low" (from previous testing)
    const val = saved ? parseInt(saved, 10) : 0;
    return val < 5000 ? 24892 : val;
  });
  const [liveOpenedOffset, setLiveOpenedOffset] = useState(() => {
    const saved = localStorage.getItem('abhed_live_opened');
    const val = saved ? parseInt(saved, 10) : 0;
    return val < 2000 ? 11240 : val;
  });

  useEffect(() => {
    const loadData = () => {
      const savedInfluencers = localStorage.getItem('abhed_influencers');
      let data: Influencer[] = [];

      if (savedInfluencers) {
        data = JSON.parse(savedInfluencers);
      } else {
        data = parseRawLeads(RAW_LEADS_DATA);
      }

      // Merge Replies (Idempotent check)
      const updatedData = data.map(inf => {
        const replyConfig = REPLY_DATA.find(r => r.handle.toLowerCase() === inf.handle.toLowerCase());
        
        // Only update if it hasn't been replied to yet OR if we want to enforce the reply data
        if (replyConfig) {
           // We enforce the reply status and data for these specific handles
           return {
             ...inf,
             status: 'Replied',
             replyDetails: {
               ...replyConfig.reply,
               to: 'info@abhed.co',
               timestamp: inf.replyDetails?.timestamp || new Date().toISOString()
             },
             // Ensure history has the reply event
             history: inf.history.some(h => h.type === 'Email Replied') 
               ? inf.history 
               : [...inf.history, {
                   id: 'reply-' + Math.random(),
                   type: 'Email Replied',
                   timestamp: new Date().toISOString(),
                   notes: 'Positive response received'
                 }]
           } as Influencer;
        }
        return inf;
      });

      setInfluencers(updatedData);
      localStorage.setItem('abhed_influencers', JSON.stringify(updatedData));
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('abhed_live_dispatched', liveDispatchedOffset.toString());
  }, [liveDispatchedOffset]);

  useEffect(() => {
    localStorage.setItem('abhed_live_opened', liveOpenedOffset.toString());
  }, [liveOpenedOffset]);

  const incrementDispatched = () => {
    setLiveDispatchedOffset(prev => prev + 1);
    // 30% chance to simulate an open for this new dispatch
    if (Math.random() < 0.3) {
      setTimeout(() => {
        setLiveOpenedOffset(prev => prev + 1);
      }, 2000 + Math.random() * 3000); // Delay open by 2-5 seconds for realism
    }
  };

  const filteredInfluencers = useMemo(() => {
    return influencers.filter(inf => {
      const matchesSearch = inf.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                            inf.handle.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || inf.category.includes(filters.category); // Loose matching for category
      const matchesPlatform = filters.platform === 'All' || inf.platform === filters.platform;
      const matchesTier = filters.tier === 'All' || inf.tier === filters.tier;
      const matchesStatus = filters.status === 'All' || inf.status === filters.status;

      return matchesSearch && matchesCategory && matchesPlatform && matchesTier && matchesStatus;
    });
  }, [influencers, filters]);

  const stats = useMemo(() => {
    const baseDispatched = influencers.reduce((acc, curr) => acc + curr.history.filter(h => h.type === 'Email Sent').length, 0);
    const baseOpened = influencers.filter(i => ['Opened', 'Viewed', 'Replied'].includes(i.status)).length;
    
    // Simulate a larger database than what is just in the current array
    const ghostLeads = 8450; 

    return {
      total: influencers.length + ghostLeads,
      uniqueSent: influencers.filter(i => ['Sent', 'Delivered', 'Opened', 'Viewed', 'Replied'].includes(i.status)).length + ghostLeads,
      totalEmailsDispatched: baseDispatched + liveDispatchedOffset,
      opened: baseOpened + liveOpenedOffset,
      replied: influencers.filter(i => i.status === 'Replied').length,
    };
  }, [influencers, liveDispatchedOffset, liveOpenedOffset]);

  const uniqueCategories = useMemo(() => Array.from(new Set(influencers.map(i => i.category))).sort(), [influencers]);
  const uniquePlatforms = useMemo(() => Array.from(new Set(influencers.map(i => i.platform))).sort(), [influencers]);
  const uniqueTiers = useMemo(() => Array.from(new Set(influencers.map(i => i.tier))).sort(), [influencers]);

  return {
    influencers: filteredInfluencers,
    allInfluencers: influencers,
    loading,
    filters,
    setFilters,
    stats,
    incrementDispatched,
    options: {
      categories: uniqueCategories,
      platforms: uniquePlatforms,
      tiers: uniqueTiers
    }
  };
};