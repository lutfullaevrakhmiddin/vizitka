'use client'

import Link from 'next/link'

// ── Styles ─────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(16px,-12px) scale(1.04); }
    66%      { transform: translate(-10px,16px) scale(0.97); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes vzPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(93,202,165,0.5); }
    50%      { box-shadow: 0 0 0 7px rgba(93,202,165,0); }
  }
  @keyframes vzGlow {
    0%,100% { box-shadow: 0 6px 24px rgba(124,107,255,0.28), 0 0 0 0   rgba(124,107,255,0.12); }
    50%      { box-shadow: 0 10px 36px rgba(124,107,255,0.48), 0 0 0 5px rgba(124,107,255,0.08); }
  }
  @keyframes vzFloat {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-9px); }
  }
  .vz-scroll::-webkit-scrollbar { display: none; }
  .vz-scroll { scrollbar-width: none; -ms-overflow-style: none; }
  .btn-nav:hover       { background: rgba(124,107,255,0.12) !important; }
  .btn-secondary:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.12) !important; }
  .step-card:hover     { border-color: rgba(124,107,255,0.22) !important; background: rgba(124,107,255,0.03) !important; }
  .feature-card:hover  { border-color: rgba(255,255,255,0.1) !important; }
  .cta-main:hover      { background: #6a59ff !important; }
`

// ── Phone mockup ───────────────────────────────────────────────────────────────

function MiniRow({ bg, color, label, mono, btn }: {
  bg: string; color: string; label: string; mono?: boolean; btn: string
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 10px', borderRadius: 10,
      background: 'rgba(255,255,255,0.025)',
      border: '0.5px solid rgba(255,255,255,0.05)',
      marginBottom: 6,
    }}>
      <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, background: bg }} />
      <div style={{
        flex: 1, minWidth: 0, fontSize: 10, color: '#f0eeff',
        fontFamily: mono ? 'monospace' : 'inherit',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        letterSpacing: mono ? 0.3 : 0,
      }}>{label}</div>
      <div style={{
        fontSize: 9, color: color, fontWeight: 500, flexShrink: 0,
        padding: '3px 7px', borderRadius: 6,
        background: 'rgba(255,255,255,0.045)', letterSpacing: -0.1,
      }}>{btn}</div>
    </div>
  )
}

function PhoneMockup() {
  return (
    <div style={{
      width: 228, height: 456,
      borderRadius: 36, padding: 5,
      background: '#101018',
      border: '1.5px solid rgba(255,255,255,0.09)',
      boxShadow: [
        '0 28px 70px rgba(0,0,0,0.65)',
        '0 0 0 1px rgba(255,255,255,0.04)',
        '0 0 90px rgba(124,107,255,0.13)',
      ].join(', '),
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 31,
        background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)',
        overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 70, height: 20, borderRadius: 999, background: '#000', zIndex: 3,
        }} />
        {/* status bar fade */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 44, zIndex: 2,
          background: 'linear-gradient(180deg, rgba(13,13,26,0.9) 0%, rgba(13,13,26,0) 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{ padding: '44px 13px 13px', flex: 1 }}>
          {/* avatar + name */}
          <div style={{ textAlign: 'center', marginBottom: 13 }}>
            <div style={{
              width: 50, height: 50, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c6bff 0%, #a78bfa 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16, fontWeight: 600,
              margin: '0 auto 9px',
              boxShadow: '0 8px 24px rgba(124,107,255,0.45)',
            }}>SR</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#f0eeff', letterSpacing: -0.3 }}>Sardor Rahimov</div>
            <div style={{ fontSize: 10, color: 'rgba(240,238,255,0.4)', marginTop: 2 }}>Frontend Developer</div>
          </div>

          {/* tabs */}
          <div style={{
            display: 'flex', gap: 2, marginBottom: 11,
            background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: 3,
          }}>
            {['Haqida', 'Aloqa', 'Ijtimoiy'].map((t, i) => (
              <div key={t} style={{
                flex: 1, textAlign: 'center', fontSize: 9, fontWeight: i === 1 ? 500 : 400,
                padding: '5px 0', borderRadius: 6,
                color: i === 1 ? '#f0eeff' : 'rgba(240,238,255,0.3)',
                background: i === 1 ? 'rgba(124,107,255,0.22)' : 'transparent',
              }}>{t}</div>
            ))}
          </div>

          {/* contact rows */}
          <MiniRow bg="rgba(93,202,165,0.18)"  color="#5dcaa5" label="+998 90 123 45 67" btn="Qo'ng'iroq" />
          <MiniRow bg="rgba(124,107,255,0.18)" color="#a78bfa" label="**** **** **** 4782" mono btn="Nusxalash" />
          <MiniRow bg="rgba(34,158,217,0.2)"   color="#2AABEE" label="@sardor_dev" btn="Telegram" />

          {/* URL pill */}
          <div style={{
            marginTop: 14, padding: '7px 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#5dcaa5', flexShrink: 0 }} />
            <span style={{ fontSize: 9.5, color: 'rgba(240,238,255,0.3)', fontFamily: 'monospace' }}>
              vizitka.me/sardor
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase',
      color: 'rgba(240,238,255,0.28)', marginBottom: 18,
    }}>{children}</div>
  )
}

// ── Steps ──────────────────────────────────────────────────────────────────────

function StepsSection() {
  const steps = [
    { n: '01', title: "Ro'yxatdan o'ting",  desc: "Telegram yoki email orqali 30 soniyada" },
    { n: '02', title: "Ma'lumot kiriting",   desc: "Karta, telefon, ijtimoiy tarmoqlar" },
    { n: '03', title: "Havolani ulashing",   desc: "vizitka.me/ismingiz — hamma uchun tayyor" },
  ]
  return (
    <section style={{ padding: '40px 20px' }}>
      <SectionLabel>Qanday ishlaydi</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map(s => (
          <div key={s.n} className="step-card" style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: 16, borderRadius: 16,
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.07)',
            transition: 'all 0.2s',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: 'rgba(124,107,255,0.1)',
              border: '0.5px solid rgba(124,107,255,0.22)',
              color: '#a78bfa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, fontFamily: 'monospace', letterSpacing: 0.5,
            }}>{s.n}</div>
            <div style={{ paddingTop: 3 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#f0eeff', letterSpacing: -0.3 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(240,238,255,0.42)', marginTop: 5, lineHeight: 1.45 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Features 2×2 ──────────────────────────────────────────────────────────────

function FeaturesSection() {
  const items: Array<{ color: string; bg: string; title: string; desc: string; icon: React.ReactNode }> = [
    {
      color: '#a78bfa', bg: 'rgba(124,107,255,0.1)', title: 'Xavfsiz',
      desc: "Karta raqami hech kimga ko'rinmaydi",
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>,
    },
    {
      color: '#f0b429', bg: 'rgba(240,180,41,0.09)', title: 'Tez',
      desc: "1 daqiqada to'liq tayyor",
      icon: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>,
    },
    {
      color: '#5dcaa5', bg: 'rgba(93,202,165,0.09)', title: 'Qulay',
      desc: 'Bir teginishda nusxalash',
      icon: (
        <>
          <circle cx="12" cy="12" r="9"   stroke="currentColor" strokeWidth="1.8" fill="none"/>
          <circle cx="12" cy="12" r="4"   stroke="currentColor" strokeWidth="1.8" fill="none"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        </>
      ),
    },
    {
      color: '#ff7eb3', bg: 'rgba(255,126,179,0.09)', title: 'Bepul',
      desc: 'Asosiy funksiyalar bepul',
      icon: <path d="M12 21s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 10c0 6.5-7 11-7 11z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>,
    },
  ]
  return (
    <section style={{ padding: '0 20px 40px' }}>
      <SectionLabel>Nima uchun vizitka.me</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map(it => (
          <div key={it.title} className="feature-card" style={{
            padding: 16, borderRadius: 16,
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.07)',
            display: 'flex', flexDirection: 'column', minHeight: 134,
            transition: 'border-color 0.2s',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: it.bg, color: it.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 13,
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24">{it.icon}</svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#f0eeff', letterSpacing: -0.2 }}>{it.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(240,238,255,0.38)', marginTop: 5, lineHeight: 1.45 }}>{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Showcase (horizontal scroll) ──────────────────────────────────────────────

function ShowcaseSection() {
  const cards: Array<{
    accent: string; gradient: string; border: string
    avatar: string; name: string; role: string
    chips: [string, string][]
  }> = [
    {
      accent: '#7c6bff',
      gradient: 'linear-gradient(135deg, rgba(124,107,255,0.14) 0%, transparent 70%)',
      border: 'rgba(124,107,255,0.22)',
      avatar: 'SR', name: 'Sardor R.', role: 'Frontend Developer',
      chips: [['Telefon', '#f0eeff'], ['Telegram', '#2AABEE'], ['LinkedIn', '#5dcaa5']],
    },
    {
      accent: '#5dcaa5',
      gradient: 'linear-gradient(135deg, rgba(93,202,165,0.14) 0%, transparent 70%)',
      border: 'rgba(93,202,165,0.22)',
      avatar: 'MT', name: 'Malika T.', role: 'UX Designer',
      chips: [['Behance', '#5dcaa5'], ['Dribbble', '#ff7eb3'], ['Email', '#f0eeff']],
    },
    {
      accent: '#f0b429',
      gradient: 'linear-gradient(135deg, rgba(240,180,41,0.14) 0%, transparent 70%)',
      border: 'rgba(240,180,41,0.22)',
      avatar: 'BK', name: 'Bobur K.', role: 'Business Owner',
      chips: [['Karta', '#f0b429'], ['Click', '#5dcaa5'], ['Sayt', '#7c6bff']],
    },
  ]
  return (
    <section style={{ paddingBottom: 40 }}>
      <div style={{ padding: '0 20px' }}>
        <SectionLabel>Real vizitkalar</SectionLabel>
      </div>
      <div className="vz-scroll" style={{
        display: 'flex', gap: 12, overflowX: 'auto',
        padding: '4px 20px 8px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}>
        {cards.map((c, i) => (
          <div key={i} style={{
            flex: '0 0 auto', width: 214, borderRadius: 20,
            backgroundImage: c.gradient,
            backgroundColor: 'rgba(255,255,255,0.025)',
            border: `0.5px solid ${c.border}`,
            padding: 18, scrollSnapAlign: 'start',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -44, right: -44,
              width: 130, height: 130, borderRadius: '50%',
              background: `radial-gradient(circle, ${c.accent}28 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: `linear-gradient(135deg, ${c.accent} 0%, ${c.accent}99 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#07070f', fontSize: 13, fontWeight: 700,
              boxShadow: `0 6px 18px ${c.accent}44`,
            }}>{c.avatar}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#f0eeff', marginTop: 13, letterSpacing: -0.3 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.38)', marginTop: 2 }}>{c.role}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
              {c.chips.map(([label, color]) => (
                <div key={label} style={{
                  fontSize: 10, padding: '5px 9px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  border: `0.5px solid ${color === '#f0eeff' ? 'rgba(255,255,255,0.1)' : color + '44'}`,
                  color: color === '#f0eeff' ? 'rgba(240,238,255,0.55)' : color,
                }}>{label}</div>
              ))}
            </div>
            <div style={{
              marginTop: 14, paddingTop: 12,
              borderTop: '1px dashed rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: 10, color: 'rgba(240,238,255,0.22)',
              fontFamily: 'monospace', letterSpacing: 0.2,
            }}>
              <span>vizitka.me/{c.avatar.toLowerCase()}</span>
              <span style={{ color: c.accent }}>→</span>
            </div>
          </div>
        ))}
        <div style={{ flex: '0 0 8px' }} />
      </div>
    </section>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section style={{ padding: '0 20px 44px' }}>
      <div style={{
        borderRadius: 24, padding: '38px 24px 30px',
        background: 'radial-gradient(120% 100% at 50% 0%, rgba(124,107,255,0.13) 0%, rgba(124,107,255,0.04) 55%, transparent 85%)',
        border: '0.5px solid rgba(124,107,255,0.28)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -70, left: '50%', transform: 'translateX(-50%)',
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,107,255,0.22) 0%, transparent 60%)',
          filter: 'blur(28px)', pointerEvents: 'none',
        }} />
        <h2 style={{
          margin: 0, fontSize: 27, fontWeight: 500, letterSpacing: -0.7,
          color: '#f0eeff', lineHeight: 1.15, position: 'relative',
        }}>
          Hoziroq <span style={{ color: '#7c6bff' }}>boshlang</span>
        </h2>
        <p style={{
          fontSize: 14, color: 'rgba(240,238,255,0.42)', margin: '11px auto 0',
          maxWidth: 250, lineHeight: 1.55, position: 'relative',
        }}>
          Minglab odamlar allaqachon o'z vizitkasini yaratgan.
        </p>
        <Link href="/auth/register" className="cta-main" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 52, marginTop: 24, borderRadius: 14,
          background: '#7c6bff', color: '#fff',
          fontSize: 16, fontWeight: 500, letterSpacing: -0.2,
          fontFamily: 'inherit', cursor: 'pointer',
          textDecoration: 'none', boxSizing: 'border-box',
          animation: 'vzGlow 2.4s ease-in-out infinite',
          position: 'relative', transition: 'background 0.2s',
        }}>
          Bepul vizitka yaratish →
        </Link>
        <div style={{
          marginTop: 15, fontSize: 12, fontFamily: 'monospace',
          color: 'rgba(124,107,255,0.55)', letterSpacing: 0.4, position: 'relative',
        }}>
          vizitka.me/<span style={{ color: 'rgba(240,238,255,0.28)' }}>ismingiz</span>
        </div>
      </div>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* purple orb — top right */}
      <div style={{
        position: 'fixed', top: -130, right: -150,
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,107,255,0.38) 0%, rgba(124,107,255,0) 65%)',
        filter: 'blur(64px)', opacity: 0.65, pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat 14s ease-in-out infinite',
      }} />
      {/* rose orb — bottom left */}
      <div style={{
        position: 'fixed', bottom: '25%', left: -150,
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,126,179,0.28) 0%, rgba(255,126,179,0) 65%)',
        filter: 'blur(60px)', opacity: 0.45, pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat 17s ease-in-out infinite reverse',
      }} />

      <div style={{
        background: '#07070f', minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative',
      }}>
        <div style={{ width: '100%', maxWidth: 390, position: 'relative', zIndex: 1 }}>

          {/* ── Nav ── */}
          <nav style={{
            position: 'sticky', top: 0, zIndex: 20,
            background: 'rgba(7,7,15,0.82)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '15px 20px',
          }}>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.5, color: '#f0eeff' }}>
              vizitka<span style={{ color: '#7c6bff' }}>.me</span>
            </div>
            <Link href="/auth/login" className="btn-nav" style={{
              background: 'transparent',
              border: '1px solid rgba(124,107,255,0.32)',
              color: '#f0eeff',
              fontSize: 13, fontWeight: 500,
              padding: '8px 18px', borderRadius: 999,
              fontFamily: 'inherit', cursor: 'pointer',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}>Kirish</Link>
          </nav>

          {/* ── Hero ── */}
          <section style={{
            padding: '36px 20px 28px', textAlign: 'center',
            animation: 'fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            {/* status pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px 6px 10px', borderRadius: 999,
              background: 'rgba(93,202,165,0.07)',
              border: '1px solid rgba(93,202,165,0.2)',
              fontSize: 12, color: 'rgba(240,238,255,0.85)',
              marginBottom: 26,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#5dcaa5',
                boxShadow: '0 0 0 3px rgba(93,202,165,0.2)',
                display: 'inline-block', flexShrink: 0,
                animation: 'vzPulse 1.9s ease-in-out infinite',
              }} />
              Bepul · 1 daqiqada tayyor
            </div>

            <h1 style={{
              fontSize: 36, fontWeight: 500, lineHeight: 1.08,
              letterSpacing: -1.1, color: '#f0eeff',
              margin: '0 0 16px',
            }}>
              Sizning raqamli<br/>
              <span style={{ color: '#7c6bff' }}>vizitkaingiz</span> tayyor
            </h1>

            <p style={{
              fontSize: 15, lineHeight: 1.6, color: 'rgba(240,238,255,0.48)',
              margin: '0 auto 30px', maxWidth: 290,
            }}>
              Karta, kontaktlar, ijtimoiy tarmoqlar — hammasi bir havolada.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/auth/register" className="cta-main" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 52, borderRadius: 14, border: 'none',
                background: '#7c6bff', color: '#fff',
                fontSize: 16, fontWeight: 500, letterSpacing: -0.2,
                fontFamily: 'inherit', cursor: 'pointer',
                textDecoration: 'none', boxSizing: 'border-box',
                animation: 'vzGlow 2.4s ease-in-out infinite',
                transition: 'background 0.2s',
              }}>
                Bepul vizitka yaratish →
              </Link>
              <Link href="/sardor" className="btn-secondary" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 52, borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                color: 'rgba(240,238,255,0.5)',
                fontSize: 15, fontWeight: 400,
                fontFamily: 'inherit', cursor: 'pointer',
                textDecoration: 'none', boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}>
                Namuna ko'rish
              </Link>
            </div>

            {/* floating phone */}
            <div style={{
              marginTop: 48, display: 'flex', justifyContent: 'center',
              position: 'relative',
              animation: 'vzFloat 3.8s ease-in-out infinite',
            }}>
              {/* glow under phone */}
              <div style={{
                position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
                width: 180, height: 60, borderRadius: '50%',
                background: 'rgba(124,107,255,0.18)',
                filter: 'blur(24px)', pointerEvents: 'none',
              }} />
              <PhoneMockup />
            </div>
          </section>

          <StepsSection />
          <FeaturesSection />
          <ShowcaseSection />
          <FinalCTA />

          {/* ── Footer ── */}
          <footer style={{
            padding: '22px 20px 44px', textAlign: 'center',
            borderTop: '0.5px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#f0eeff', letterSpacing: -0.4, marginBottom: 6 }}>
              vizitka<span style={{ color: '#7c6bff' }}>.me</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.22)', letterSpacing: 0.1 }}>
              2025 · Barcha huquqlar himoyalangan
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}
