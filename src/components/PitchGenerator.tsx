import React, { useMemo, useState } from 'react';
import type { Influencer } from '../types';
import { Copy, Mail, Check } from 'lucide-react';

interface PitchGeneratorProps {
  influencer: Influencer;
}

export const PitchGenerator: React.FC<PitchGeneratorProps> = ({ influencer }) => {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const pitch = useMemo(() => {
    const category = influencer.category.toLowerCase();
    const firstName = influencer.name.split(' ')[0];
    
    let subject = '';
    let body = '';

    if (category.includes('tech') || category.includes('dev') || category.includes('code')) {
      subject = `Exclusive Beta: Next-Gen AI Engine for ${influencer.name}`;
      body = `Hi ${firstName},

I've been following your content on ${influencer.platform} for a while - really loved your recent take on tech trends.

I'm reaching out from KM18 to introduce Abhed, a new privacy-focused AI engine designed for power users like yourself. It's not just another wrapper; we're building something that respects user sovereignty while delivering state-of-the-art performance.

We'd love to get your thoughts on it. Would you be open to an exclusive beta access key?

Best,
The Abhed Team`;
    } else if (category.includes('gaming') || category.includes('esports')) {
      subject = `Optimize your stream setup with Abhed AI 🚀`;
      body = `Hey ${firstName},

Huge fan of your streams! Your recent gameplay was insane.

I'm with the team behind Abhed. We've built a system optimization tool powered by AI that helps streamers maintain peak performance without sacrificing privacy or data. It's perfect for high-load streaming setups.

We're looking for top-tier creators to test it out before our public launch. Interested in giving it a spin?

GLHF,
The Abhed Team`;
    } else if (category.includes('finance') || category.includes('crypto') || category.includes('business')) {
      subject = `Institutional-grade data analytics for your audience`;
      body = `Hi ${firstName},

Your analysis on ${influencer.platform} is always top-notch. The depth you go into is rare.

I wanted to put Abhed on your radar. We're launching an institutional-grade data analytics platform that prioritizes E2EE and user privacy - something I think your audience would really value given the current climate.

We're currently inviting a select group of financial opinion leaders to review the platform. Let me know if you'd like a walkthrough.

Regards,
The Abhed Team`;
    } else {
      subject = `Collaboration Opportunity: Abhed x ${influencer.name}`;
      body = `Hi ${firstName},

We've been impressed by the community you've built on ${influencer.platform}. Your content really resonates with the values we're building at Abhed.

Abhed is a new privacy-first social ecosystem and productivity suite. We're looking for partners who value digital sovereignty and cutting-edge design.

We'd love to explore how we could work together for our upcoming launch.

Best,
The Abhed Team`;
    }

    return { subject, body };
  }, [influencer]);

  const copyToClipboard = (text: string, isSubject: boolean) => {
    navigator.clipboard.writeText(text);
    if (isSubject) {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  const openEmailClient = () => {
    const mailto = `mailto:${influencer.email}?subject=${encodeURIComponent(pitch.subject)}&body=${encodeURIComponent(pitch.body)}`;
    window.open(mailto, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="bg-km18-card p-4 rounded-lg border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Subject Line</label>
          <button 
            onClick={() => copyToClipboard(pitch.subject, true)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Copy Subject"
          >
            {copiedSubject ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-white font-medium text-sm">{pitch.subject}</p>
      </div>

      <div className="bg-km18-card p-4 rounded-lg border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Email Body</label>
          <button 
            onClick={() => copyToClipboard(pitch.body, false)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Copy Body"
          >
            {copiedBody ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
          {pitch.body}
        </pre>
      </div>

      <button
        onClick={openEmailClient}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-km18-purple to-km18-blue hover:from-km18-purple/80 hover:to-km18-blue/80 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95"
      >
        <Mail className="w-5 h-5" />
        Launch Email Client
      </button>
    </div>
  );
};