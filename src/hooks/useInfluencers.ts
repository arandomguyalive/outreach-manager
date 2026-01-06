import { useState, useEffect, useMemo } from 'react';
import type { Influencer, FilterState } from '../types';
import { parseRawLeads } from '../utils/parser';
import { RAW_LEADS_DATA } from '../data/raw_leads';

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

  const [liveDispatchedOffset, setLiveDispatchedOffset] = useState(0);
  const [liveOpenedOffset, setLiveOpenedOffset] = useState(0);

  useEffect(() => {
    // Simulate async load
    const data = parseRawLeads(RAW_LEADS_DATA);
    setInfluencers(data);
    setLoading(false);
  }, []);

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
    
    return {
      total: influencers.length,
      uniqueSent: influencers.filter(i => ['Sent', 'Delivered', 'Opened', 'Viewed', 'Replied'].includes(i.status)).length,
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