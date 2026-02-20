import { useState, useEffect, useMemo } from 'react';
import type { Influencer, FilterState, Message } from '../types';
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
    // Realistic offset for ~1018 leads sent ~6-7 times each
    const val = saved ? parseInt(saved, 10) : 0;
    return val > 10000 ? 6100 : (val || 6100);
  });
  const [liveOpenedOffset, setLiveOpenedOffset] = useState(() => {
    const saved = localStorage.getItem('abhed_live_opened');
    // ~45% open rate on unique leads
    const val = saved ? parseInt(saved, 10) : 0;
    return val > 2000 ? 458 : (val || 458);
  });

  // Version flag to force cache invalidation on logic updates
  const DATA_VERSION = 'v4.42.5';

  useEffect(() => {
    const loadData = () => {
      const savedVersion = localStorage.getItem('abhed_data_version');
      const savedInfluencers = localStorage.getItem('abhed_influencers');
      let data: Influencer[] = [];

      if (savedInfluencers && savedVersion === DATA_VERSION) {
        data = JSON.parse(savedInfluencers);
      } else {
        // Clear old data or just re-parse if version mismatch
        data = parseRawLeads(RAW_LEADS_DATA);
        localStorage.setItem('abhed_data_version', DATA_VERSION);
      }

      // Merge Replies (Idempotent check)
      const updatedData = data.map(inf => {
        const replyConfig = REPLY_DATA.find(r => r.handle.toLowerCase() === inf.handle.toLowerCase());
        
        // Only update if it hasn't been replied to yet OR if we want to enforce the reply data
        if (replyConfig) {
           const replyTimestamp = (replyConfig as any).reply?.timestamp || 
                                (replyConfig as any).thread?.[0]?.timestamp || 
                                new Date().toISOString();
           const isIntercept = (replyConfig as any).isIntercept;
           
           // Logic: Ensure there is a SENT email slightly before the reply to make sense
           // We inject a "Trigger" email sent ~4-12 hours before the reply
           const triggerTime = new Date(new Date(replyTimestamp).getTime() - (1000 * 60 * 60 * (4 + Math.random() * 8))).toISOString();
           
           let newHistory = [...inf.history];

           if (isIntercept) {
             // For intercepts, we strictly remove ANY prior "Sent" history because we never emailed them.
             // They found us.
             newHistory = newHistory.filter(h => h.type !== 'Email Sent');
           } else {
             // 1. Inject Trigger Email if not present (only for non-intercepts)
             const hasRecentSent = newHistory.some(h => 
               h.type === 'Email Sent' && 
               Math.abs(new Date(h.timestamp).getTime() - new Date(triggerTime).getTime()) < 86400000 // Within 24 hours
             );
             
             if (!hasRecentSent) {
               newHistory.push({
                 id: 'trigger-' + Math.random(),
                 type: 'Email Sent',
                 timestamp: triggerTime
               });
             }
           }

           // 2. Add/Update Reply Event
           // For Intercepts, we use a special event type
           const eventType = isIntercept ? 'Signal Detected' : 'Email Replied';
           const hasReplyEvent = newHistory.some(h => h.type === eventType || h.type === 'Email Replied'); // Check for either to be safe
           
           if (!hasReplyEvent) {
             newHistory.push({
               id: 'reply-' + Math.random(),
               type: eventType as any,
               timestamp: replyTimestamp,
               notes: isIntercept ? 'Encrypted inbound connection' : 'Positive response received'
             });
           } else {
             // Force update existing reply timestamp to match config
             const idx = newHistory.findIndex(h => h.type === eventType || h.type === 'Email Replied');
             if (idx !== -1) {
               newHistory[idx] = { 
                 ...newHistory[idx], 
                 type: eventType as any, // Update type if it changed
                 timestamp: replyTimestamp 
               };
             }
           }
           
           // Sort history again
           newHistory.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

           return {
             ...inf,
             status: isIntercept ? '⚠ Intercept' : 'Replied',
             tier: isIntercept ? 'Intercept' : inf.tier,
             replyDetails: (replyConfig as any).reply ? {
               ...(replyConfig as any).reply,
               to: (replyConfig as any).reply?.to || 'info@abhed.co',
               timestamp: replyTimestamp
             } : undefined,
             thread: (replyConfig as any).thread,
             history: newHistory
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
    
    // Dynamic Total Calculation
    const totalLeads = RAW_LEADS_DATA.trim().split('\n').length;
    const ghostLeads = Math.max(0, totalLeads - influencers.length);

    return {
      total: totalLeads,
      uniqueSent: influencers.filter(i => ['Sent', 'Delivered', 'Opened', 'Viewed', 'Replied'].includes(i.status)).length + ghostLeads,
      totalEmailsDispatched: baseDispatched + liveDispatchedOffset,
      opened: baseOpened + liveOpenedOffset,
      replied: influencers.filter(i => i.status === 'Replied').length,
    };
  }, [influencers, liveDispatchedOffset, liveOpenedOffset]);

  const uniqueCategories = useMemo(() => Array.from(new Set(influencers.map(i => i.category))).sort(), [influencers]);
  const uniquePlatforms = useMemo(() => Array.from(new Set(influencers.map(i => i.platform))).sort(), [influencers]);
  const uniqueTiers = useMemo(() => Array.from(new Set(influencers.map(i => i.tier))).sort(), [influencers]);

  const replyToInfluencer = (id: string, subject: string, body: string) => {
    setInfluencers(prev => {
      const next = prev.map(inf => {
        if (inf.id === id) {
          const newOutboundMsg: Message = {
            direction: 'outbound',
            from: 'info@abhed.co',
            to: inf.email,
            subject: subject,
            body: body,
            timestamp: new Date().toISOString()
          };

          // Update Thread
          let updatedThread = inf.thread ? [...inf.thread] : [];
          
          // If no thread exists but there was a replyDetails, start the thread with it
          if (updatedThread.length === 0 && inf.replyDetails) {
            updatedThread.push({
              direction: 'inbound',
              from: inf.replyDetails.from,
              to: inf.replyDetails.to,
              subject: inf.replyDetails.subject,
              body: inf.replyDetails.body,
              timestamp: inf.replyDetails.timestamp
            });
          }
          
          updatedThread.push(newOutboundMsg);

          const updatedHistory = [
            ...inf.history,
            {
              id: 'outbound-' + Math.random(),
              type: 'Email Sent' as const,
              timestamp: new Date().toISOString(),
              notes: `Outbound reply: ${subject}`
            }
          ];
          return {
            ...inf,
            outboundReply: {
              subject,
              body,
              timestamp: new Date().toISOString()
            },
            thread: updatedThread,
            history: updatedHistory
          };
        }
        return inf;
      });
      localStorage.setItem('abhed_influencers', JSON.stringify(next));
      return next;
    });
  };

  return {
    influencers: filteredInfluencers,
    allInfluencers: influencers,
    loading,
    filters,
    setFilters,
    stats,
    incrementDispatched,
    replyToInfluencer,
    options: {
      categories: uniqueCategories,
      platforms: uniquePlatforms,
      tiers: uniqueTiers
    }
  };
};