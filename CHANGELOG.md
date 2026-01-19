# Changelog - Abhed Outreach Manager

## [Phase 2 - Realism & Scale Optimization] - 2026-01-19

### Highlights
- **1018 Leads Database:** Statistics recalibrated to lock total leads at 1018, with mature campaign metrics (~7.9k dispatched).
- **Genre-Specific Creator Inboxes:** 16 unique replies from top-tier creators (MortaL, Sharan Hegde, Siddhartha Ahluwalia, etc.) with professional, niche-relevant inquiries.
- **Strict Pre-Launch Context:** All communications now strictly align with the current project status (videos/ads discovery, no followers yet, addressing Kinjal Mishra as female founder).
- **Causal Interaction Sync:** Automated logic to inject "Trigger Emails" into history, ensuring a logical flow from outreach to reply.

## [Phase 2.7 - Investment & Valuation Tracking] - 2026-01-19

### Highlights
- **Replied Dashboard Implemented:** Clicking the "Replied" stat now opens a dedicated "Interest Valuation Tracker".
- **Financial Projections:** Introduced a 1 Crore INR fundraising target with real-time valuation based on interested creators (₹20,000 per reply).
- **Consolidated View:** Aggregated all 16 replied creators into a single, high-impact view for rapid assessment.
- **Visual Polish:** Added progress bars and "Current Date" calibration (Jan 19, 2026).

### [Phase 2.6 - Feature Specificity & Immersion] - 2026-01-19

### Highlights
- **Revolutionary Feature Recognition:** Key creators (Tanay, Raj, Srishti) now explicitly identify "Geo-Fencing" as a market-disrupting feature, adding depth to the feedback loop.
- **Narrative Diversity:** The "Inbox" now contains distinct threads of interest:
    - **Security:** MortaL/Akshat/Technical Guruji (Screen recording, NPU, Auto-delete).
    - **Revolution:** Tanay/Raj/Srishti (Geo-Fencing, IRL communities).
    - **Sovereignty:** Sharan/Neon (Vault, Digital ownership).
- **Sender Hierarchy Finalized:** Strict adherence to "Team vs. Personal" replies based on creator tier.

### [Phase 2.5 - Hierarchy & Narrative Depth] - 2026-01-19

### Highlights
- **VIP Workflow Simulation:** "Mega" tier creators (Raj Shamani, Warikoo, etc.) now communicate via Executive Assistants/Teams, while Mid-tier creators remain personal.
- **Narrative Consistency:** Replies now clearly distinguish between public "Teaser" content and the private "App Tour" (Drive Video), creating a logical engagement funnel.
- **Feature Discovery:** Creators now *ask* about features (Vault, Hidden Folders) rather than stating they saw them, adding a layer of mystery and demand.

### Technical Changes
- **Pitch Generator Enhancement:**
  - Added official YouTube, Instagram, and Google Form links.
  - Integrated exclusive App Tour (Google Drive) link.
  - Implemented professional `From/To/Date` headers in the generated body.
- **Statistics Calibration (`useInfluencers.ts`):**
  - Implemented `ghostLeads` logic to hit 1018 leads precisely.
  - Scaled `liveDispatchedOffset` (~6.1k) and `liveOpenedOffset` (~450) for a mature look.
  - Frozen simulated reply increments; replies are now static and data-driven.
- **Interaction History Logic:**
  - Added back-calculated "Trigger" email injection (4-12 hours prior to reply).
  - Ensured strict timestamp synchronization between `REPLY_DATA` and interaction logs.
- **Reply Data Overhaul (`replies.ts`):**
  - 16 multi-paragraph replies with unique technical inquiries (Screen recording, E2EE, API, DPDP compliance).
  - Explicit recognition of Kinjal Mishra as the female founder.
  - Removal of "filled the form" and "following" phrases to match actual campaign status.

### Status
- **Build:** Stable
- **Git:** All changes committed and pushed to `origin/main`.
