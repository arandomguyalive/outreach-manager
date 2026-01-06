import type { Influencer, Interaction } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const CAMPAIGN_START = new Date('2026-01-01T00:00:00');
const NOW = new Date('2026-01-06T00:00:00');

export const parseRawLeads = (rawData: string): Influencer[] => {
  const lines = rawData.trim().split('\n');
  const influencers: Influencer[] = [];

  const targetOpenCount = 215;

  // First pass to parse
  const parsedItems = lines.map(line => {
    const parts = line.split('\t').map(p => p.trim());
    // Fallback if tabs are not used, try splitting by multiple spaces
    const partsFallback = line.split(/\s{2,}/).map(p => p.trim());
    
    const finalParts = parts.length >= 7 ? parts : partsFallback;

    // Handle potential missing fields or different structures
    // Expected: Name, Platform, Country, Language, Category, Handle, Tier, Email
    // Sometimes 8 cols, sometimes more or less.
    // We try to map them as best as possible.
    
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

  // Second pass to assign statuses to meet criteria
  // We want exactly 0 Replied, ~215 Opened.
  // The rest can be New, Sent, Delivered, Bounced.
  
  // Let's shuffle indices to assign "Opened" randomly
  const indices = Array.from({ length: parsedItems.length }, (_, i) => i);
  // Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const openedIndices = new Set(indices.slice(0, targetOpenCount));
  
  parsedItems.forEach((item, index) => {
    let status: Influencer['status'] = 'New';
    const history: Interaction[] = [];

    if (openedIndices.has(index)) {
      status = 'Opened';
      // Add Sent and Opened history
      const sentDate = getRandomDate(CAMPAIGN_START, NOW);
      const openedDate = getRandomDate(new Date(sentDate), NOW);
      
      history.push({
        id: generateId(),
        type: 'Email Sent',
        timestamp: sentDate
      });
      history.push({
        id: generateId(),
        type: 'Email Opened',
        timestamp: openedDate
      });
    } else {
      // Randomly assign other statuses
      const rand = Math.random();
      if (rand < 0.4) {
        status = 'Sent';
        history.push({
            id: generateId(),
            type: 'Email Sent',
            timestamp: getRandomDate(CAMPAIGN_START, NOW)
        });
      } else if (rand < 0.5) {
         status = 'Delivered';
         const sentDate = getRandomDate(CAMPAIGN_START, NOW);
         history.push({ id: generateId(), type: 'Email Sent', timestamp: sentDate });
         // Delivered slightly after
      } else if (rand < 0.55) {
          status = 'Bounced';
          const sentDate = getRandomDate(CAMPAIGN_START, NOW);
          history.push({ id: generateId(), type: 'Email Sent', timestamp: sentDate });
      }
      else {
        status = 'New';
      }
    }

    influencers.push({
      id: generateId(),
      ...item,
      status,
      history,
      lastInteraction: history.length > 0 ? history[history.length - 1].timestamp : undefined
    });
  });

  return influencers;
};