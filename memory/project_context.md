---
name: Yes Man App project context
description: Core facts about the Yes Man App project — tech stack, features, strategy
type: project
---

Full-stack Next.js 16 SaaS app built at C:\Users\evgen\.claude\projects\yes-man-app

**Tech:** Next.js 16 (App Router), TypeScript, Tailwind v4, next-intl, Anthropic Claude Haiku, Zustand (localStorage persist)

**Languages:** EN / RU / HE (RTL) / DE — translation files in /messages/

**Core modules:** Landing+Onboarding → Diagnostic (20q) → Dashboard → AI Coach → 30-day Exercises → Progress → Settings

**AI:** Claude Haiku via /api/coach, CBT-based system prompt, 500 token cap, multilingual response

**Strategy docs:** STARTUP_STRATEGY.md (monetization, retention, viral growth, investor pitch, unit economics), DEPLOYMENT.md

**Why:** Built as a complete team simulation (10 roles) including Product Architect through Release Manager. User requested 3 progressive stages: (1) build app, (2) startup transformation, (3) investor-ready scaling layer.
