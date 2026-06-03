# Polyflow Landing Page

A modern startup landing page and waitlist experience for **Polyflow**, a pre-seed company building speech feedback systems for under-resourced languages. The site communicates Polyflow’s mission, highlights its MVP focus on Haitian Creole, visualizes key opportunity regions, and captures early interest through a live Supabase-backed waitlist.

## Overview

Polyflow is building real-time speech feedback technology for under-resourced language communities. The MVP begins with Haitian Creole as a focused, high-impact starting point, addressing a meaningful gap in language technology while creating a scalable foundation for future expansion across many other underserved languages.

This landing page is designed to support that vision with premium branding, startup storytelling, geographic context, and a clear conversion path for users, supporters, and early partners.

## Why Polyflow

Polyflow starts with Haitian Creole because it offers both strong social impact and a practical product wedge. By giving underserved communities better speech feedback tools, the platform aims to improve access, communication confidence, and broader economic opportunity.

That first deployment also serves as a repeatable model. The long-term goal is to extend the same infrastructure and product strategy to hundreds of other under-resourced languages.

## Features

- **Premium startup landing page**  
  Built with a custom Vanilla CSS design system and a dark, polished visual identity tailored for a pre-seed product launch.

- **Mission-driven hero section**  
  Features the “Give Voice to the Under-Resourced” message, prominent call-to-action buttons, and space for a product demo video.

- **Live waitlist signup**  
  Captures user interest through a connected Supabase backend rather than a static or mock signup form.

- **Interactive hotspot map**  
  Uses Plotly.js to visualize target opportunity regions across North and South America, including Haiti, Miami, NYC/NJ, Boston, Philadelphia, Montreal, Havana, the Dominican Republic, and Chile.

- **Investor-friendly narrative**  
  Includes a clear “Why Polyflow?” section that explains the strategic decision to begin with Haitian Creole and scale from there.

## Design System

The site uses a custom design system built without generic component frameworks.

### Visual style

- Dark background using `#06060c`
- Ambient animated blobs using `#6366f1` and `#a855f7`
- Glassmorphism-inspired cards and overlays
- **Outfit** for headings
- **Inter** for body text

### UX goals

- Present Polyflow as a credible, high-conviction pre-seed company
- Make the value proposition immediately understandable
- Encourage waitlist conversion with minimal friction
- Balance product vision, impact, and startup polish

## Tech Stack

- **Frontend:** Next.js, HTML, CSS, JavaScript
- **Styling:** Custom Vanilla CSS design system
- **Data visualization:** Plotly.js
- **Backend / database:** Supabase
- **Deployment:** Vercel

## Current Functionality

### Waitlist

The waitlist flow is already connected to Supabase, allowing visitor submissions to be captured through a live backend workflow.

### Demo video

A product demo video will be added soon to replace the current placeholder in the hero section.

## Main Sections

1. **Hero**  
   Introduces Polyflow’s mission with a strong headline, CTA buttons, and upcoming demo placement.

2. **Why Polyflow**  
   Explains the company’s strategy, beginning with Haitian Creole as a high-impact initial market.

3. **Opportunity map**  
   Visualizes geographic hotspots relevant to Polyflow’s early focus and growth strategy.

4. **Waitlist form**  
   Collects early interest through a live backend-connected signup flow.

## Local Development

### Prerequisites

- Node.js 20+
- npm or another JavaScript package manager
- Supabase project credentials

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root and add the required Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Depending on your implementation, you may also need additional server-side Supabase credentials.

### Start the development server

```bash
npm run dev
```

### Open locally

Visit:

```text
http://localhost:3000
```

## Customization

### Demo video

The hero section is designed to support a product demo video and can be updated with:

- A local hosted file
- A YouTube embed
- A Vimeo embed
- A founder walkthrough or product teaser

### Waitlist flow

The signup flow is already connected to Supabase and can be extended with:

- Email confirmation
- Duplicate-entry protection
- Analytics events
- Admin dashboard views
- CRM or newsletter sync

### Map data

The Plotly map can be updated with dynamic datasets as your geographic targeting and market research evolve.

## Product Context

Most speech technologies are built for well-resourced languages, leaving many communities with limited access to feedback, speech support, and learning tools. Polyflow is focused on closing that gap by starting with Haitian Creole and building the infrastructure needed to support many more under-resourced languages over time.

## Future Improvements

- Add the live product demo video
- Add confirmation and success messaging for waitlist submissions
- Connect waitlist signups to email campaigns or CRM tooling
- Add founder, roadmap, and traction sections
- Expand the landing page with multilingual support
- Pull hotspot data from a live analytics source

## Deployment

The landing page is deployed on Vercel and uses Supabase for waitlist data handling.
