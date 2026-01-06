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
    const firstName = influencer.name.split(' ')[0];
    
    const subject = `Exclusive Access: Only 500 "Blacklist" Spots Available at ABHED`;
    const body = `Dear ${influencer.name},

I’m writing to you because of your unique influence in the digital space. We are currently opening the gates to ABHED ("The Fortress") and specifically inviting a select group of 500 creators to join our LIFETIME Blacklist.

The ABHED Blacklist is not just a status symbol—it is a permanent, sovereign clearance within our tiered security ecosystem. While others navigate the digital world as "users," Blacklist members operate as Architects of their own privacy.

Here is why the Blacklist is the ultimate tier for a creator like you:

* The Infinity Key (Lifetime Access): As one of the first 500, you bypass all recurring costs. You receive a Lifetime Professional Membership, granting you full access to high-bandwidth features, 4K Vortex rendering, and sovereign privacy controls forever.
* Forensic Protection: Content you share is protected by "Blacklist Security." This activates our proprietary "Hold-to-View" mechanic, preventing unauthorized screenshots and ensuring your media is only consumed by those you trust.
* The Blacklist Certificate: Your identity is verified and memorialized with a unique, on-chain digital certificate, marking you as one of the original 500 operatives who chose privacy over surveillance.
* Elite Visual Presence: Your profile will carry the Amber Neon signature, the "Infinity Key" badge, and the Blacklist ring—instantly signaling your status across the Signal Grid and the Vortex.

ABHED is a world of depth, moving beyond the flat, silent scrolling of the past. It’s a place where your content is treated with the weight and security it deserves.

We have reserved a slot for you. If you’re ready to secure your digital existence and join the initial 500, let me know, and I’ll send over your Access Key.

Stay Sovereign,

Kinjal Mishra
System Architect, ABHED
Author, The Inner Billionaire
Instagram: @iamkm18
The Digital Fortress`;

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
    const mailto = `mailto:${influencer.email}?cc=info@abhed.co&subject=${encodeURIComponent(pitch.subject)}&body=${encodeURIComponent(pitch.body)}`;
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