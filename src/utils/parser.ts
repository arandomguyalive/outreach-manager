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

  const targetOpenCount = Math.floor(parsedItems.length * 0.3);

  // Second pass: Assign statuses and history
  
  // Shuffle indices to assign "Opened" randomly
  const indices = Array.from({ length: parsedItems.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const openedIndices = new Set(indices.slice(0, targetOpenCount));
  
  parsedItems.forEach((item, index) => {
    let status: Influencer['status'] = 'Sent';
    const history: Interaction[] = [];

    // 1. Everyone gets 3 sent emails (Jan 1, Jan 3, Jan 5)
    // Add some random time jitter to make it look natural
    const jitter = () => Math.floor(Math.random() * 3600000 * 4); // 0-4 hours jitter

    const date1 = new Date(new Date('2026-01-01T09:00:00').getTime() + jitter()).toISOString();
    const date2 = new Date(new Date('2026-01-03T10:00:00').getTime() + jitter()).toISOString();
    const date3 = new Date(new Date('2026-01-05T08:00:00').getTime() + jitter()).toISOString();

    history.push({ id: generateId(), type: 'Email Sent', timestamp: date1 });
    history.push({ id: generateId(), type: 'Email Sent', timestamp: date2 });
    history.push({ id: generateId(), type: 'Email Sent', timestamp: date3 });

    // 2. Handle Opened Status (30%) - Dates: Jan 4 or Jan 5
    if (openedIndices.has(index)) {
      status = 'Opened';
      
      // Randomly pick Jan 4 or Jan 5
      const startRange = new Date('2026-01-04T00:00:00').getTime();
      const endRange = new Date('2026-01-05T23:59:59').getTime();
      const openTimestamp = new Date(startRange + Math.random() * (endRange - startRange)).toISOString();
      
      history.push({
        id: generateId(),
        type: 'Email Opened',
        timestamp: openTimestamp
      });
    } else {
      // Randomly assign other statuses for variety, but keep Sent count high as per request
      const rand = Math.random();
      if (rand < 0.05) status = 'Bounced';
      else if (rand < 0.4) status = 'Delivered';
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
