# YesMan App — Deployment Guide

## Quick Start (Local)

```bash
cd yes-man-app
npm install
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
# Open http://localhost:3000
```

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...   # Required: Claude API key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel
# Follow prompts → add ANTHROPIC_API_KEY in Vercel dashboard
```

Or: push to GitHub → import in vercel.com → add env vars → deploy.

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # All locale-aware pages
│   │   ├── page.tsx           # Landing + Onboarding
│   │   ├── diagnostic/        # 20-question assessment
│   │   ├── dashboard/         # Home dashboard
│   │   ├── coach/             # AI coaching chat
│   │   ├── exercises/         # 30-day program
│   │   ├── progress/          # Analytics + achievements
│   │   └── settings/          # App settings
│   └── api/
│       └── coach/             # AI coach API (Anthropic)
├── components/
│   ├── ui/                    # Button, Card, Badge, etc.
│   └── navigation/            # Navbar, LanguageSwitcher
├── i18n/                      # next-intl config
├── lib/                       # utils, exercise data
├── stores/                    # Zustand state (localStorage)
└── types/                     # TypeScript types

messages/                      # Translation files
├── en.json
├── ru.json
├── he.json
└── de.json
```

## Supported Languages

| Code | Language | RTL |
|------|----------|-----|
| en | English | No |
| ru | Russian | No |
| he | Hebrew | Yes (auto) |
| de | German | No |

## Features

- Onboarding (4-step wizard)
- Diagnostic assessment (20 questions, severity scoring)
- Dashboard with streak tracking
- AI Coach (Claude Haiku, CBT-based, multilingual)
- 30-day exercise program (4 categories, 3 difficulty levels)
- Progress tracking + achievements
- Settings + language switch
- RTL layout for Hebrew

## AI Cost Estimate

At 500 active users doing 5 AI messages/day:
- ~2,500 API calls/day
- ~300K tokens/day (input+output, Haiku model)
- ~$0.15/day = ~$4.50/month at scale

## MVP Monetization (Add Stripe)

```bash
npm install @stripe/stripe-js stripe
```

Add paywall in `[locale]/exercises/page.tsx` after Day 7 check:
```typescript
if (exercise.day > 7 && !profile.isPro) {
  return <UpgradeModal />;
}
```

## Next Steps (Post-MVP)

1. Add Firebase auth (email magic link)
2. Share card generation (canvas API)
3. Stripe subscription integration
4. Telegram bot for Russian market
5. PWA + push notifications
6. Prompt caching for 90% AI cost reduction
