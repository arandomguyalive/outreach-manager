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
  status: 'New' | 'Sent' | 'Delivered' | 'Opened' | 'Viewed' | 'Replied' | 'Bounced' | '⚠ Intercept';
  lastInteraction?: string;
  history: Interaction[];
  isSelected?: boolean;
  replyDetails?: {
    subject: string;
    body: string;
    from: string;
    to: string;
    timestamp: string;
  };
  outboundReply?: {
    subject: string;
    body: string;
    timestamp: string;
  };
}

export interface Interaction {
  id: string;
  type: 'Email Sent' | 'Email Opened' | 'Email Replied' | 'Link Clicked' | 'Signal Detected';
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
