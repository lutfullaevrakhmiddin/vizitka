// Vizitka.me — Mobile landing page
// All sections compose into <Landing/>. Dark luxury aesthetic.

const VZ = {
  bg: '#07070f',
  purple: '#7c6bff',
  green: '#5dcaa5',
  amber: '#f0b429',
  rose: '#ff7eb3',
  surface: 'rgba(255,255,255,0.03)',
  surfaceHi: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.06)',
  borderHi: 'rgba(255,255,255,0.1)',
  text: '#f5f5fa',
  textMuted: 'rgba(245,245,250,0.55)',
  textDim: 'rgba(245,245,250,0.35)',
};

// ─────────────────────────────────────────────────────────────
// Top nav
// ─────────────────────────────────────────────────────────────
function VZTopBar({ accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 20px 4px', position: 'relative', zIndex: 5,
    }}>
      <div style={{
        fontSize: 17, fontWeight: 500, letterSpacing: -0.4,
        color: VZ.text, fontFamily: 'system-ui, -apple-system',
      }}>
        vizitka<span style={{ color: accent }}>.me</span>
      </div>
      <button style={{
        background: 'transparent',
        border: `1px solid ${accent}55`,
        color: VZ.text,
        fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
        padding: '7px 14px', borderRadius: 999,
        fontFamily: 'system-ui, -apple-system', cursor: 'pointer',
      }}>Kirish</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────
function VZHero({ accent }) {
  return (
    <section style={{ padding: '24px 20px 12px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
      {/* status pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 12px 6px 10px', borderRadius: 999,
        background: 'rgba(93,202,165,0.08)',
        border: '1px solid rgba(93,202,165,0.2)',
        fontSize: 11, color: VZ.text, letterSpacing: -0.1,
        marginBottom: 22,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: 999, background: VZ.green,
          boxShadow: `0 0 0 4px ${VZ.green}22`,
          animation: 'vzPulse 1.6s ease-in-out infinite',
        }} />
        Bepul · 1 daqiqada tayyor
      </div>

      <h1 style={{
        fontSize: 32, fontWeight: 500, lineHeight: 1.1,
        letterSpacing: -0.8, color: VZ.text, margin: 0,
        textWrap: 'balance',
      }}>
        Sizning raqamli<br/>
        <span style={{ color: accent }}>vizitkaingiz</span> tayyor
      </h1>

      <p style={{
        fontSize: 14, lineHeight: 1.5, color: VZ.textMuted,
        margin: '14px auto 0', maxWidth: 300, fontWeight: 400,
      }}>
        Karta, kontaktlar, ijtimoiy tarmoqlar —<br/>
        hammasi bir sahifada.
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 26 }}>
        <button style={{
          height: 52, borderRadius: 14, border: 'none',
          background: accent, color: '#fff',
          fontSize: 16, fontWeight: 500, letterSpacing: -0.2,
          fontFamily: 'system-ui, -apple-system', cursor: 'pointer',
          boxShadow: `0 0 0 0 ${accent}55`,
          animation: 'vzGlow 2.4s ease-in-out infinite',
          position: 'relative',
        }}>
          Bepul vizitka yaratish <span style={{ marginLeft: 4 }}>→</span>
        </button>
        <button style={{
          height: 52, borderRadius: 14,
          background: VZ.surface,
          border: `1px solid ${VZ.border}`,
          color: VZ.textMuted,
          fontSize: 16, fontWeight: 400, letterSpacing: -0.2,
          fontFamily: 'system-ui, -apple-system', cursor: 'pointer',
        }}>
          Namuna ko'rish
        </button>
      </div>

      {/* Phone mockup */}
      <div style={{
        marginTop: 36, display: 'flex', justifyContent: 'center',
        animation: 'vzFloat 3.6s ease-in-out infinite',
      }}>
        <VZPhoneMockup accent={accent} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Phone mockup (inside hero)
// ─────────────────────────────────────────────────────────────
function VZPhoneMockup({ accent }) {
  const W = 232, H = 470;
  return (
    <div style={{
      width: W, height: H, borderRadius: 36,
      background: '#111114',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px ${accent}18`,
      padding: 6, position: 'relative',
      fontFamily: 'system-ui, -apple-system',
    }}>
      {/* notch */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        width: 64, height: 18, borderRadius: 999, background: '#000', zIndex: 2,
      }} />
      {/* screen */}
      <div style={{
        width: '100%', height: '100%', borderRadius: 30,
        background: 'linear-gradient(180deg, #0c0c14 0%, #0a0a12 100%)',
        overflow: 'hidden', position: 'relative',
        padding: '34px 14px 14px', boxSizing: 'border-box',
      }}>
        {/* avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999,
            background: `linear-gradient(135deg, ${accent} 0%, #4a3dd1 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 18, fontWeight: 500, letterSpacing: -0.3,
            boxShadow: `0 8px 24px ${accent}55`,
          }}>SR</div>
        </div>
        {/* name */}
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: VZ.text, letterSpacing: -0.3 }}>Sardor Rahimov</div>
          <div style={{ fontSize: 10, color: VZ.textMuted, marginTop: 3, letterSpacing: 0.1 }}>Frontend Developer</div>
        </div>
        {/* tabs */}
        <div style={{
          display: 'flex', gap: 4, marginTop: 14,
          background: 'rgba(255,255,255,0.04)', borderRadius: 10,
          padding: 3,
        }}>
          {['Haqida', 'Aloqa', 'Ijtimoiy'].map((t, i) => (
            <div key={t} style={{
              flex: 1, textAlign: 'center', fontSize: 9.5, fontWeight: 500,
              padding: '6px 0', borderRadius: 7,
              color: i === 1 ? '#fff' : VZ.textMuted,
              background: i === 1 ? 'rgba(255,255,255,0.08)' : 'transparent',
              letterSpacing: -0.1,
            }}>{t}</div>
          ))}
        </div>
        {/* contact cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 12 }}>
          <MiniContact
            iconBg={VZ.green} iconBgSoft="rgba(93,202,165,0.12)"
            icon={
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" stroke="#fff" strokeWidth="2.2"/>
              </svg>
            }
            label="+998 90 123 45 67" font="system" btn="Nusxa"
          />
          <MiniContact
            iconBg={accent} iconBgSoft={`${accent}1f`}
            icon={
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="#fff" strokeWidth="2.2"/>
                <path d="M2 10h20" stroke="#fff" strokeWidth="2.2"/>
              </svg>
            }
            label="**** **** **** 4782" font="mono" btn="Nusxalash"
          />
          <MiniContact
            iconBg={VZ.green} iconBgSoft="rgba(93,202,165,0.12)"
            icon={
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            }
            label="To'lov qilish" font="system" btn="O'tish"
          />
        </div>
      </div>
    </div>
  );
}

function MiniContact({ icon, iconBg, iconBgSoft, label, btn, font }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9,
      padding: '9px 10px', borderRadius: 12,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8,
        background: iconBgSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, color: iconBg,
      }}>
        <div style={{ color: iconBg }}>{React.cloneElement(icon, { stroke: iconBg })}</div>
      </div>
      <div style={{
        flex: 1, minWidth: 0, fontSize: 10.5,
        color: VZ.text,
        fontFamily: font === 'mono' ? 'ui-monospace, Menlo, monospace' : 'inherit',
        letterSpacing: font === 'mono' ? 0.4 : -0.1,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{label}</div>
      <div style={{
        fontSize: 9, color: VZ.textMuted, fontWeight: 500,
        padding: '4px 8px', borderRadius: 6,
        background: 'rgba(255,255,255,0.04)',
        flexShrink: 0, letterSpacing: -0.1,
      }}>{btn}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section 2 — How it works
// ─────────────────────────────────────────────────────────────
function VZSteps({ accent }) {
  const steps = [
    { n: '01', t: "Ro'yxatdan o'ting", d: "Telegram yoki email orqali 30 soniyada" },
    { n: '02', t: "Ma'lumot kiriting", d: "Karta, telefon, ijtimoiy tarmoqlar" },
    { n: '03', t: "Havolani ulashing", d: "vizitka.me/ismingiz tayyor" },
  ];
  return (
    <section style={{ padding: '40px 20px' }}>
      <SectionLabel>QANDAY ISHLAYDI</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: 16, borderRadius: 16,
            background: VZ.surface,
            border: `1px solid ${VZ.border}`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${accent}14`,
              border: `1px solid ${accent}33`,
              color: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 500, letterSpacing: 0.3,
              fontFamily: 'ui-monospace, Menlo, monospace',
              flexShrink: 0,
            }}>{s.n}</div>
            <div style={{ flex: 1, paddingTop: 2 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: VZ.text, letterSpacing: -0.3 }}>{s.t}</div>
              <div style={{ fontSize: 13, color: VZ.textMuted, marginTop: 4, lineHeight: 1.4 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Section 3 — Trust features (2x2)
// ─────────────────────────────────────────────────────────────
function VZFeatures({ accent }) {
  const items = [
    { c: accent,    bg: `${accent}14`, t: 'Xavfsiz', d: "Karta raqami hech kimga ko'rinmaydi",
      ic: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round"/> },
    { c: VZ.amber,  bg: 'rgba(240,180,41,0.10)', t: 'Tez', d: '1 daqiqada to\'liq tayyor',
      ic: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round"/> },
    { c: VZ.green,  bg: 'rgba(93,202,165,0.10)', t: 'Qulay', d: 'Bir teginishda nusxalash',
      ic: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></> },
    { c: VZ.rose,   bg: 'rgba(255,126,179,0.10)', t: 'Bepul', d: 'Asosiy funksiyalar bepul',
      ic: <><path d="M12 21s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 10c0 6.5-7 11-7 11z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round"/></> },
  ];
  return (
    <section style={{ padding: '0 20px 40px' }}>
      <SectionLabel>NIMA UCHUN VIZITKA.ME</SectionLabel>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16,
      }}>
        {items.map(it => (
          <div key={it.t} style={{
            padding: 16, borderRadius: 16,
            background: VZ.surface,
            border: `1px solid ${VZ.border}`,
            minHeight: 132, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: it.bg, color: it.c,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24">{it.ic}</svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: VZ.text, letterSpacing: -0.2 }}>{it.t}</div>
            <div style={{ fontSize: 12, color: VZ.textMuted, marginTop: 4, lineHeight: 1.4 }}>{it.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Section 4 — Real vizitkas showcase
// ─────────────────────────────────────────────────────────────
function VZShowcase({ accent }) {
  const cards = [
    {
      tone: accent, gradient: `linear-gradient(135deg, ${accent}22 0%, transparent 70%)`,
      avatar: 'SR', name: 'Sardor R.', role: 'Frontend Developer',
      chips: [['Telefon', '#fff'], ['Telegram', accent], ['LinkedIn', VZ.green]],
    },
    {
      tone: VZ.green, gradient: 'linear-gradient(135deg, rgba(93,202,165,0.18) 0%, transparent 70%)',
      avatar: 'MT', name: 'Malika T.', role: 'UX Designer',
      chips: [['Behance', VZ.green], ['Dribbble', VZ.rose], ['Email', '#fff']],
    },
    {
      tone: VZ.amber, gradient: 'linear-gradient(135deg, rgba(240,180,41,0.18) 0%, transparent 70%)',
      avatar: 'BK', name: 'Bobur K.', role: 'Business Owner',
      chips: [['Karta', VZ.amber], ['Telefon', '#fff'], ['Sayt', accent]],
    },
  ];
  return (
    <section style={{ paddingBottom: 40 }}>
      <div style={{ padding: '0 20px' }}>
        <SectionLabel>REAL VIZITKALAR</SectionLabel>
      </div>
      <div style={{
        display: 'flex', gap: 12, overflowX: 'auto',
        padding: '16px 20px 8px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }} className="vz-scroll">
        {cards.map((c, i) => (
          <div key={i} style={{
            flex: '0 0 auto', width: 220, borderRadius: 20,
            background: `${VZ.surface}, ${c.gradient}`,
            backgroundColor: 'rgba(255,255,255,0.025)',
            backgroundImage: c.gradient,
            border: `1px solid ${c.tone}33`,
            padding: 18, scrollSnapAlign: 'start',
            position: 'relative', overflow: 'hidden',
            ...(i === 2 ? {
              fontFamily: '-apple-system',
              lineHeight: 1.4,
              backgroundPosition: 'center center',
              border: '1px solid rgb(240, 143, 41)',
            } : {}),
          }}>
            {/* corner glow */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 120, height: 120, borderRadius: 999,
              background: `radial-gradient(circle, ${c.tone}33 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{
              width: 44, height: 44, borderRadius: 999,
              background: `linear-gradient(135deg, ${c.tone} 0%, ${c.tone}88 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0a0a12', fontSize: 14, fontWeight: 600, letterSpacing: -0.2,
              boxShadow: `0 6px 16px ${c.tone}44`,
            }}>{c.avatar}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: VZ.text, marginTop: 14, letterSpacing: -0.3 }}>{c.name}</div>
            <div style={{ fontSize: 11.5, color: VZ.textMuted, marginTop: 2, letterSpacing: -0.1 }}>{c.role}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
              {c.chips.map(([label, color]) => (
                <div key={label} style={{
                  fontSize: 10, padding: '5px 9px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${color === '#fff' ? 'rgba(255,255,255,0.1)' : color + '44'}`,
                  color: color === '#fff' ? VZ.text : color, letterSpacing: -0.1,
                }}>{label}</div>
              ))}
            </div>
            <div style={{
              marginTop: 14, paddingTop: 12,
              borderTop: '1px dashed rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: 10, color: VZ.textDim,
              fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: 0.2,
            }}>
              <span>vizitka.me/{c.avatar.toLowerCase()}</span>
              <span style={{ color: c.tone }}>→</span>
            </div>
          </div>
        ))}
        <div style={{ flex: '0 0 8px' }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Section 5 — Final CTA
// ─────────────────────────────────────────────────────────────
function VZFinalCTA({ accent }) {
  return (
    <section style={{ padding: '0 20px 40px' }}>
      <div style={{
        borderRadius: 24, padding: '36px 24px 28px',
        background: `radial-gradient(120% 100% at 50% 0%, ${accent}1a 0%, ${accent}05 50%, transparent 80%)`,
        border: `1px solid ${accent}33`,
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
          width: 180, height: 180, borderRadius: 999,
          background: `radial-gradient(circle, ${accent}22 0%, transparent 60%)`,
          filter: 'blur(20px)', pointerEvents: 'none',
        }} />
        <h2 style={{
          margin: 0, fontSize: 26, fontWeight: 500, letterSpacing: -0.6,
          color: VZ.text, lineHeight: 1.15, position: 'relative',
        }}>
          Hoziroq <span style={{ color: accent }}>boshlang</span>
        </h2>
        <p style={{
          fontSize: 13, color: VZ.textMuted, margin: '10px auto 0',
          maxWidth: 240, lineHeight: 1.5, position: 'relative',
        }}>
          Minglab odamlar allaqachon yaratgan.
        </p>
        <button style={{
          width: '100%', height: 50, marginTop: 22,
          borderRadius: 14, border: 'none',
          background: accent, color: '#fff',
          fontSize: 15, fontWeight: 500, letterSpacing: -0.2,
          fontFamily: 'system-ui, -apple-system', cursor: 'pointer',
          animation: 'vzGlow 2.4s ease-in-out infinite',
          position: 'relative',
        }}>
          Bepul vizitka yaratish →
        </button>
        <div style={{
          marginTop: 14, fontSize: 12,
          fontFamily: 'ui-monospace, Menlo, monospace',
          color: `${accent}aa`, letterSpacing: 0.3, position: 'relative',
        }}>
          vizitka.me/<span style={{ color: VZ.textMuted }}>ismingiz</span>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function VZFooter({ accent }) {
  return (
    <footer style={{
      padding: '20px 20px 40px', textAlign: 'center',
      borderTop: `1px solid ${VZ.border}`,
    }}>
      <div style={{
        fontSize: 14, fontWeight: 500, color: VZ.text,
        letterSpacing: -0.3, marginBottom: 6,
      }}>
        vizitka<span style={{ color: accent }}>.me</span>
      </div>
      <div style={{ fontSize: 11, color: VZ.textDim, letterSpacing: -0.1 }}>
        2025 · Barcha huquqlar himoyalangan
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 500, letterSpacing: 1.4,
      color: VZ.textMuted, textTransform: 'uppercase',
      fontFamily: 'ui-monospace, Menlo, monospace',
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Background orbs
// ─────────────────────────────────────────────────────────────
function VZOrbs({ accent }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      pointerEvents: 'none', zIndex: 0,
    }}>
      <div style={{
        position: 'absolute', top: -120, right: -140,
        width: 360, height: 360, borderRadius: 999,
        background: `radial-gradient(circle, ${accent}55 0%, ${accent}00 60%)`,
        filter: 'blur(60px)', opacity: 0.7,
        animation: 'vzOrb1 14s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: 200, left: -140,
        width: 320, height: 320, borderRadius: 999,
        background: `radial-gradient(circle, ${VZ.rose}44 0%, ${VZ.rose}00 60%)`,
        filter: 'blur(60px)', opacity: 0.55,
        animation: 'vzOrb2 16s ease-in-out infinite',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────
function VizitkaLanding({ accent = VZ.purple }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: VZ.bg, color: VZ.text,
      fontFamily: 'system-ui, -apple-system, "SF Pro Display", sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      <VZOrbs accent={accent} />
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        paddingTop: 44, /* status bar */
      }} className="vz-scroll">
        <VZTopBar accent={accent} />
        <VZHero accent={accent} />
        <VZSteps accent={accent} />
        <VZFeatures accent={accent} />
        <VZShowcase accent={accent} />
        <VZFinalCTA accent={accent} />
        <VZFooter accent={accent} />
        <div style={{ height: 34 }} /> {/* home indicator */}
      </div>
    </div>
  );
}

Object.assign(window, { VizitkaLanding, VZ });
