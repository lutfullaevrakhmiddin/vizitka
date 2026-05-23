# Vizitka.me — Claude Code Instructions

## Project Overview
Personal digital business card platform for Uzbekistan market.
URL pattern: vizitka.me/[username]
Every visible UI text must be in **Uzbek language only**.
Stack: Next.js 14 (App Router, TypeScript), Tailwind CSS, shadcn/ui (Radix + Nova), Supabase, Telegraf.js, Vercel.

---

## Design System

### Colors (STRICT — never deviate)
```
Background:       #07070f
Card bg:          rgba(255,255,255,0.03)
Card border:      0.5px solid rgba(255,255,255,0.08)
Primary:          #7c6bff
Primary hover:    #6a59ff
Primary glow:     rgba(124,107,255,0.25)
Primary soft:     rgba(124,107,255,0.06)
Text primary:     #f0eeff
Text secondary:   rgba(240,238,255,0.45)
Text dim:         rgba(240,238,255,0.25)
Text muted:       rgba(240,238,255,0.18)
Success:          #5dcaa5
Warning:          #f0b429
Error:            #ff8080
Telegram:         #229ED9
```

### Typography
```
Font:         system-ui, sans-serif
Headings:     font-weight 500, letter-spacing -0.4px
Labels:       10-11px, UPPERCASE, letter-spacing 1px, color text-dim
Body:         13-15px
Monospace:    font-family monospace (URLs, card numbers, OTP)
```

### Spacing & Shape
```
Page padding:   24px 16px
Card radius:    24px
Input radius:   12px
Button radius:  12px
Method card:    14px
Max width:      390px — ALWAYS, desktop shows same as mobile (centered)
Min tap target: 44x44px
```

---

## Mobile-First Rules (CRITICAL — never break these)
- maxWidth 390px on every screen — desktop is same as mobile, centered
- No horizontal scroll ever
- All primary buttons: full width, min height 52px
- All inputs: min height 48px, font-size 15px (prevents iOS auto-zoom)
- Touch targets: min 44x44px
- No hover-only interactions
- Position fixed elements at bottom for thumb reach

---

## Animations (include on every page)

```css
@keyframes orbFloat {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(16px,-12px) scale(1.04); }
  66%      { transform: translate(-10px,16px) scale(0.97); }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes slideL {
  from { opacity:0; transform:translateX(28px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes slideR {
  from { opacity:0; transform:translateX(-28px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes checkPop {
  0%   { transform:scale(0) rotate(-15deg); opacity:0; }
  60%  { transform:scale(1.2); }
  100% { transform:scale(1); opacity:1; }
}
@keyframes ringPulse {
  0%   { transform:scale(1); opacity:0.6; }
  100% { transform:scale(2.2); opacity:0; }
}
@keyframes caretBlink {
  0%,100% { opacity:1; } 50% { opacity:0; }
}
```

### Background Orbs (every page — required)
```tsx
<div style={{position:'fixed',borderRadius:'50%',pointerEvents:'none',
  filter:'blur(70px)',zIndex:0,
  width:260,height:260,background:'rgba(124,107,255,0.09)',
  top:-70,right:-50,animation:'orbFloat 9s ease-in-out infinite'}} />
<div style={{position:'fixed',borderRadius:'50%',pointerEvents:'none',
  filter:'blur(70px)',zIndex:0,
  width:180,height:180,background:'rgba(255,107,157,0.05)',
  bottom:-30,left:-30,
  animation:'orbFloat 11s ease-in-out infinite reverse'}} />
```

---

## Reusable Component Patterns

### Page wrapper
```tsx
<main style={{
  background:'#07070f', minHeight:'100vh',
  display:'flex', alignItems:'center', justifyContent:'center',
  padding:'24px 16px', fontFamily:'system-ui,sans-serif',
  position:'relative', overflow:'hidden'
}}>
```

### Card
```tsx
<div style={{
  background:'rgba(255,255,255,0.03)',
  border:'0.5px solid rgba(255,255,255,0.08)',
  borderRadius:24, padding:'28px 22px 24px',
  width:'100%', maxWidth:390,
  position:'relative', zIndex:1,
  animation:'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both'
}}>
```

### Input
```tsx
<input style={{
  width:'100%', padding:'13px 14px',
  background:'rgba(255,255,255,0.04)',
  border:'0.5px solid rgba(255,255,255,0.08)',
  borderRadius:12, fontSize:15, color:'#f0eeff',
  fontFamily:'inherit', outline:'none',
  WebkitAppearance:'none', boxSizing:'border-box',
  transition:'border-color 0.2s, background 0.2s'
}} />
/* focus: borderColor rgba(124,107,255,0.5), background rgba(124,107,255,0.06) */
```

### Primary button
```tsx
<button style={{
  width:'100%', padding:15,
  background:'#7c6bff', border:'none', borderRadius:12,
  fontSize:15, fontWeight:500, color:'#fff',
  cursor:'pointer', fontFamily:'inherit',
  transition:'background 0.2s, transform 0.1s, box-shadow 0.2s'
}}>
/* hover: background #6a59ff, boxShadow 0 8px 24px rgba(124,107,255,0.25) */
/* active: transform scale(0.98) */
/* disabled: opacity 0.4 */
```

### Section label
```tsx
<span style={{
  fontSize:11, fontWeight:500,
  color:'rgba(240,238,255,0.3)',
  letterSpacing:1, textTransform:'uppercase'
}}>
```

### Brand
```tsx
<div style={{fontSize:19, fontWeight:500, color:'#f0eeff', letterSpacing:-0.4}}>
  vizitka<span style={{color:'#7c6bff'}}>.me</span>
</div>
```

---

## Pages Status
```
/                   ✅ Done (landing page — mehmon uchun)
/auth/login         ✅ Done
/auth/register      ✅ Done (3 steps: method → OTP → username+password)
/auth/verify        ⬜ Pending
/auth/forgot        ⬜ Pending
/[username]         ✅ Done (guest/static view — barcha 4 tab)
/dashboard          ⬜ Redirect → /[username]?edit=true
```

---

## Landing Page — / (app/page.tsx)
Sections (top → bottom):
```
Nav          sticky, blurred — vizitka.me brand + "Kirish" → /auth/login
Hero         status pill · h1 · tagline · 2 CTA buttons · floating phone mockup
Steps        "Qanday ishlaydi" — 3 numbered step cards (01/02/03)
Features     "Nima uchun vizitka.me" — 2×2 grid (Xavfsiz · Tez · Qulay · Bepul)
Showcase     "Real vizitkalar" — horizontal scroll, 3 sample profile cards
CTA          purple gradient card — "Hoziroq boshlang" + primary button
Footer       brand + copyright
```
Animations used: `orbFloat`, `fadeUp`, `vzPulse`, `vzGlow`, `vzFloat`

---

## Vizitka Page — Tab Structure
```
Tab 1: Haqida      → avatar, ism familiya, kasb, kompaniya, shahar, bio (160 belgi)
Tab 2: Aloqa       → telefon, email, karta (HIDDEN, copy only), click, payme
Tab 3: Ijtimoiy    → 2-column grid, 6 social cards (Telegram/Instagram/LinkedIn/GitHub/YouTube/TikTok)
Tab 4: Qo'shimcha  → xizmatlar (2 ta), hujjatlar (PDF card — ko'rish + yuklab olish)
```

### Mehmon vs Egasi
```
Mehmon:  faqat faol tablar, karta faqat [Nusxalash] tugmasi
Egasi:   hammasi + tahrirlash paneli (yoqish/ochirish/tartib)
QR kod:  ikkalasi ham koradi, egasi yuklab oladi
```

---

## Supabase Schema
```sql
profiles: id(uuid,PK→auth.users), username(unique), full_name, bio(max160),
          occupation, company, city, avatar_url, created_at, updated_at

tabs:     id, profile_id(FK), slug, label, is_active, is_visible, sort_order

blocks:   id, profile_id(FK), tab_slug, type, value, label,
          is_visible, is_active, sort_order
          types: phone|email|card|click|payme|telegram|instagram|
                 linkedin|github|youtube|tiktok|website|pdf|service
```

### RLS Rules
```sql
profiles: public SELECT, owner-only ALL (auth.uid() = id)
tabs:     SELECT where is_visible=true OR owner, owner-only ALL
blocks:   SELECT where is_visible=true OR owner, owner-only ALL
```

---

## Security
- Card number: NEVER render on screen. Clipboard API only. Show last 4 digits max.
- All DB mutations require authenticated user
- .env.local never committed (in .gitignore)
- Username: set once (free), changeable (premium) with redirect

---

## Code Style
- TypeScript always, no `any`
- Inline styles preferred (pixel-perfect control)
- `use client` only when using useState/useEffect/events
- suppressHydrationWarning on all inputs
- All user-facing strings in Uzbek
- No console.log in production code

## Git Convention
```
feat:  yangi xususiyat
fix:   xatolik tuzatish
docs:  hujjat
chore: sozlash/konfiguratsiya
```

## Documentation
Read these files before any task:
- doc/progress.md   — what is done / pending
- doc/architecture.md — project structure
- doc/features.md   — all features and tabs
- doc/design.md     — UI/UX decisions
- doc/decisions.md  — why we chose X
- doc/resources.md  — available tools

