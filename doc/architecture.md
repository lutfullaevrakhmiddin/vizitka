# Arxitektura — Vizitka & Web

## Sahifalar xaritasi

vizitka.me/
├── /                          → Landing Page
├── /auth
│     ├── /register            → Usul tanlash (Telegram / Email)
│     ├── /register/verify     → Kodni tasdiqlash
│     ├── /register/username   → Username tanlash
│     ├── /register/password   → Parol o rnatish
│     ├── /login               → Kirish
│     └── /forgot              → Parolni tiklash
└── /[username]                → Vizitka sahifasi
      ├── Mehmon               → Faqat faol tablar
      └── Egasi                → + Tahrirlash paneli


## Texnologiyalar

Qatlam       | Texnologiya    | Sabab
-------------|----------------|-------------------------------
Frontend     | Next.js 14     | SEO, App Router, mobile-first
Stil         | Tailwind CSS   | Tez, responsive
Komponentlar | shadcn/ui      | Professional, tayyor
Database     | Supabase       | Auth + DB + Storage + RLS
Deploy       | Vercel         | Student Pack, bepul
Bot          | Telegraf.js    | Telegram kod yuborish
IDE          | VS Code        | Engil (8GB RAM)


## Kerakli .env kalitlari

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_APP_URL=https://vizitka.me


## Fayl strukturasi

vizitka/
├── doc/
├── app/
│     ├── page.tsx              ← Landing
│     ├── auth/
│     └── [username]/
│           └── page.tsx        ← Vizitka + Tahrirlash
├── components/
│     ├── ui/                   ← shadcn/ui
│     ├── blocks/               ← har bir blok turi
│     ├── editor/               ← tahrirlash paneli
│     └── landing/
├── lib/
│     ├── supabase/
│     └── utils.ts
├── types/
│     └── index.ts
├── .env.local                  ← GITGA YUKLANMAYDI
└── .env.example
