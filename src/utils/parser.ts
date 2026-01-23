import type { Influencer, Interaction } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const parseRawLeads = (rawData: string): Influencer[] => {
  const lines = rawData.trim().split('\n');
  const influencers: Influencer[] = [];

  // First pass to parse
  const parsedItems = lines.map(line => {
    const parts = line.split('\t').map(p => p.trim());
    // Fallback if tabs are not used, try splitting by multiple spaces
    const partsFallback = line.split(/\s{2,}/).map(p => p.trim());
    
    const finalParts = parts.length >= 7 ? parts : partsFallback;

    if (finalParts.length < 5) return null; // Skip malformed lines

    const name = finalParts[0];
    const platform = finalParts[1];
    const country = finalParts[2];
    const language = finalParts[3];
    const category = finalParts[4];
    const handle = finalParts[5] || '';
    const tier = finalParts[6] || 'Micro'; // Default if missing
    const email = finalParts[7] || '';

    return {
      name, platform, country, language, category, handle, tier, email
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  // Deduplicate by handle
  const uniqueItemsMap = new Map<string, typeof parsedItems[0]>();
  parsedItems.forEach(item => {
    const key = item.handle.toLowerCase() || item.email.toLowerCase() || item.name;
    if (!uniqueItemsMap.has(key)) {
      uniqueItemsMap.set(key, item);
    }
  });
  const uniqueItems = Array.from(uniqueItemsMap.values());

  // Increase target open rate to ~45% for a mature campaign
  const targetOpenCount = Math.floor(uniqueItems.length * 0.45);

  // Second pass: Assign statuses and history
  
  // Shuffle indices to assign "Opened" randomly
  const indices = Array.from({ length: uniqueItems.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const openedIndices = new Set(indices.slice(0, targetOpenCount));
  
  uniqueItems.forEach((item, index) => {
    let status: Influencer['status'] = 'Sent';
    const history: Interaction[] = [];

    // 1. Generate 5-8 sent emails (Heavy campaign simulation)
    const jitter = () => Math.floor(Math.random() * 3600000 * 6); // 0-6 hours jitter
    
    // Campaign dates: Jan 1, 3, 5, 8, 12, 15, 18
    const dates = [
      '2026-01-01T09:00:00',
      '2026-01-03T10:00:00',
      '2026-01-05T08:00:00',
      '2026-01-08T14:30:00',
      '2026-01-12T11:15:00',
      '2026-01-15T16:45:00',
      '2026-01-18T09:30:00'
    ];

    // Randomly decide how many follow-ups this person got (min 4, max 7)
    const emailCount = 4 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < emailCount; i++) {
      const baseTime = new Date(dates[i]).getTime();
      history.push({ 
        id: generateId(), 
        type: 'Email Sent', 
        timestamp: new Date(baseTime + jitter()).toISOString() 
      });
    }

    // 2. Handle Opened Status (45%) - Dates: Randomly after one of the emails
    if (openedIndices.has(index)) {
      status = 'Opened';
      
      // Pick a random email they opened (usually the last or second to last)
      const openIndex = Math.max(0, emailCount - 1 - Math.floor(Math.random() * 2)); 
      const emailTimestamp = new Date(history[openIndex].timestamp).getTime();
      
      // Open 2-24 hours after sending
      const openTime = emailTimestamp + (3600000 * (2 + Math.random() * 22));
      
      history.push({
        id: generateId(),
        type: 'Email Opened',
        timestamp: new Date(openTime).toISOString()
      });
    } else {
      // Randomly assign other statuses for variety
      const rand = Math.random();
      if (rand < 0.05) status = 'Bounced';
      else if (rand < 0.6) status = 'Delivered'; // High delivery rate
      else status = 'Sent';
    }

    // Sort history chronologically
    history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    influencers.push({
      id: generateId(),
      ...item,
      status,
      history,
      lastInteraction: history[history.length - 1].timestamp
    });
  });

  return influencers;
};
