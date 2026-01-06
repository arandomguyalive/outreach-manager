export interface Influencer {
  id: string;
  name: string;
  platform: string;
  country: string;
  language: string;
  category: string;
  handle: string;
  tier: string;
  email: string;
  status: 'New' | 'Sent' | 'Delivered' | 'Opened' | 'Viewed' | 'Replied' | 'Bounced';
  lastInteraction?: string;
  history: Interaction[];
  isSelected?: boolean;
}

export interface Interaction {
  id: string;
  type: 'Email Sent' | 'Email Opened' | 'Email Replied' | 'Link Clicked';
  timestamp: string;
  notes?: string;
}

export interface FilterState {
  search: string;
  category: string;
  platform: string;
  tier: string;
  status: string;
}
