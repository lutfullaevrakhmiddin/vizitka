'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Styles ─────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(16px,-12px) scale(1.04); }
    66%      { transform: translate(-10px,16px) scale(0.97); }
  }
  @keyframes glowPulse {
    0%,100% { box-shadow: 0 4px 16px rgba(124,107,255,0.3); }
    50%      { box-shadow: 0 4px 28px rgba(124,107,255,0.6), 0 0 0 5px rgba(124,107,255,0.1); }
  }
  @keyframes tabIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes chevronBounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(6px); }
  }
  .btn-create:hover     { background: #6a59ff !important; }
  .btn-outline:hover    { background: rgba(124,107,255,0.16) !important; }
  .tab-btn:hover        { color: rgba(240,238,255,0.6) !important; }
  .cta-banner-btn:hover { background: rgba(124,107,255,0.15) !important; transform: scale(1.02); }
  .c-btn-ghost:hover    { background: rgba(255,255,255,0.1) !important; }
  .c-btn-primary:hover  { background: rgba(124,107,255,0.25) !important; }
`

// ── Tabs ───────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'haqida',    label: 'Haqida' },
  { id: 'aloqa',     label: 'Aloqa' },
  { id: 'ijtimoiy',  label: 'Ijtimoiy' },
  { id: 'qoshimcha', label: "Qo'shimcha" },
] as const

type TabId = typeof TABS[number]['id']

// ── Icons (header) ─────────────────────────────────────────────────────────────

function IconPin() {
  return (
    <svg width={11} height={11} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M8 14s5-4.5 5-8.5A5 5 0 003 5.5C3 9.5 8 14 8 14z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="5.5" r="1.7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function IconLink() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6.5 9.5l3-3M7 4.5l1.5-1.5a2.8 2.8 0 014 4L11 8.5M9 11.5L7.5 13a2.8 2.8 0 01-4-4L5 7.5"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// ── Icons (haqida cards) ───────────────────────────────────────────────────────

function IconBriefcase({ color }: { color: string }) {
  return (
    <svg width={17} height={17} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="7" width="16" height="10" rx="2" stroke={color} strokeWidth="1.4" />
      <path d="M13 7V5.5A1.5 1.5 0 0011.5 4h-3A1.5 1.5 0 007 5.5V7" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2 11.5h16" stroke={color} strokeWidth="1.4" />
    </svg>
  )
}

function IconBuilding({ color }: { color: string }) {
  return (
    <svg width={17} height={17} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="1.5" stroke={color} strokeWidth="1.4" />
      <path d="M7 17V12h6v5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <rect x="6.5" y="6" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1.2" />
      <rect x="10.5" y="6" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1.2" />
    </svg>
  )
}

function IconMapPin({ color }: { color: string }) {
  return (
    <svg width={17} height={17} viewBox="0 0 20 20" fill="none">
      <path d="M10 18s7-5.6 7-10.5a7 7 0 00-14 0C3 12.4 10 18 10 18z" stroke={color} strokeWidth="1.4" />
      <circle cx="10" cy="7.5" r="2.5" stroke={color} strokeWidth="1.4" />
    </svg>
  )
}

function IconQuote({ color }: { color: string }) {
  return (
    <svg width={17} height={17} viewBox="0 0 20 20" fill="none">
      <path d="M4 13.5c0-3 1.8-5.5 5-6.5L10 9c-2 .8-3 2.3-3 4.5v1H4v-1zM11 13.5c0-3 1.8-5.5 5-6.5L17 9c-2 .8-3 2.3-3 4.5v1h-3v-1z"
        fill={color} />
    </svg>
  )
}

function IconChevronsDown({ color }: { color: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 20 20" fill="none">
      <path d="M5 6l5 5 5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11l5 5 5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Icons (aloqa actions) ──────────────────────────────────────────────────────

function IconPhone({ color }: { color: string }) {
  return (
    <svg width={17} height={17} viewBox="0 0 20 20" fill="none">
      <path d="M5 3.5l2.5-1L9.5 6.5 7.8 8a8 8 0 004.2 4.2l1.5-1.7 3.5 2-1 2.5a1.6 1.6 0 01-1.8 1A13.5 13.5 0 014 4.5a1.6 1.6 0 011-1z"
        stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconPhoneCall({ color }: { color: string }) {
  return (
    <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <path d="M4 2.8l2-.7L7.5 5l-1.2 1a6 6 0 003.2 3.2l1-1.2 3.5 1.5-.7 2a1.2 1.2 0 01-1.4.7 10.5 10.5 0 01-7.7-7.7 1.2 1.2 0 01.8-1.5z"
        stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M11 2a3 3 0 012.5 3M10 1a4.5 4.5 0 014 4.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function IconCopy({ color }: { color: string }) {
  return (
    <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.3" />
      <path d="M3.5 11V3.5A1 1 0 014.5 2.5H11" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function IconExternalLink({ color }: { color: string }) {
  return (
    <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <path d="M6.5 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3.5M10 2h4v4M8 8l6-6"
        stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconArrowRight({ color }: { color: string }) {
  return (
    <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCreditCard({ color }: { color: string }) {
  return (
    <svg width={17} height={17} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4.5" width="16" height="11" rx="2" stroke={color} strokeWidth="1.4" />
      <path d="M2 8.5h16" stroke={color} strokeWidth="1.4" />
      <rect x="5" y="11.5" width="3" height="1.5" rx="0.5" fill={color} />
    </svg>
  )
}

// ── Brand logos ────────────────────────────────────────────────────────────────

function GmailIcon() {
  return (
    <svg width={22} height={17} viewBox="0 0 22 17" fill="none">
      <path d="M0 2.5V16a1 1 0 001 1h4V7.5L0 2.5z" fill="#EA4335" />
      <path d="M22 2.5V16a1 1 0 01-1 1h-4V7.5l5-5z" fill="#FBBC05" />
      <path d="M5 7.5V17h12V7.5L11 12 5 7.5z" fill="#4285F4" />
      <path d="M0 1.5A1 1 0 011 .5h20a1 1 0 011 1V2.5L11 9.5 0 2.5V1.5z" fill="#EA4335" />
    </svg>
  )
}

function ClickLogo() {
  return (
    <svg width={38} height={38} viewBox="0 0 38 38">
      <rect width="38" height="38" rx="6" fill="#00C26E" />
      <text x="19" y="24" textAnchor="middle" fill="white"
        fontSize="11" fontWeight="700" fontFamily="system-ui,-apple-system">
        Click
      </text>
    </svg>
  )
}

function PaymeLogo() {
  return (
    <svg width={38} height={38} viewBox="0 0 38 38">
      <rect width="38" height="38" rx="6" fill="#FF6B00" />
      <text x="19" y="24" textAnchor="middle" fill="white"
        fontSize="10" fontWeight="700" fontFamily="system-ui,-apple-system">
        Payme
      </text>
    </svg>
  )
}

// ── Shared: Conversion banner ──────────────────────────────────────────────────

function ConversionBanner() {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />
      <p style={{ fontSize: 13, color: 'rgba(240,238,255,0.3)', textAlign: 'center', margin: '0 0 14px' }}>
        Siz ham professional vizitkaga ega bo'ling
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <span style={{ animation: 'chevronBounce 1.2s ease-in-out infinite', display: 'inline-flex' }}>
          <IconChevronsDown color="rgba(124,107,255,0.5)" />
        </span>
      </div>
      <a
        href="/auth/register"
        className="cta-banner-btn"
        style={{
          display: 'block', width: '100%', padding: 13,
          border: '1px solid rgba(124,107,255,0.35)',
          borderRadius: 12,
          background: 'rgba(124,107,255,0.08)',
          color: '#a78bfa',
          fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
          textAlign: 'center', textDecoration: 'none',
          transition: 'background 0.2s, transform 0.2s',
          boxSizing: 'border-box',
        }}
      >
        Bepul vizitka yaratish →
      </a>
    </div>
  )
}

// ── Haqida: info card ──────────────────────────────────────────────────────────

function InfoCard({
  iconBg, icon, label, value, valueMuted = false,
}: {
  iconBg: string; icon: React.ReactNode; label: string; value: string; valueMuted?: boolean
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '0.5px solid rgba(255,255,255,0.06)',
      borderRadius: 14, padding: '14px 15px',
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,238,255,0.25)', marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, color: valueMuted ? 'rgba(240,238,255,0.45)' : '#f0eeff', lineHeight: valueMuted ? 1.7 : 1.4 }}>
          {value}
        </div>
      </div>
    </div>
  )
}

function HaqidaTab() {
  return (
    <div>
      <InfoCard iconBg="rgba(124,107,255,0.1)" icon={<IconBriefcase color="#a78bfa" />} label="Kasb" value="Frontend Developer" />
      <InfoCard iconBg="rgba(93,202,165,0.1)"  icon={<IconBuilding color="#5dcaa5" />}  label="Kompaniya" value="Uzum Technologies" />
      <InfoCard iconBg="rgba(240,180,41,0.08)" icon={<IconMapPin color="#f0b429" />}    label="Shahar" value="Toshkent, O'zbekiston" />
      <InfoCard iconBg="rgba(124,107,255,0.1)" icon={<IconQuote color="#a78bfa" />}     label="Bio"
        value="React va Next.js da zamonaviy veb ilovalar yarataman. 5 yillik tajriba." valueMuted />
      <ConversionBanner />
    </div>
  )
}

// ── Aloqa: contact card + button ───────────────────────────────────────────────

function ContactCard({
  iconBg, icon, label, value, mono = false, children,
}: {
  iconBg: string; icon: React.ReactNode; label: string; value: string; mono?: boolean; children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '0.5px solid rgba(255,255,255,0.06)',
      borderRadius: 14, padding: '14px 15px', marginBottom: 10,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.25)', marginBottom: 3 }}>
            {label}
          </div>
          <div style={{
            fontSize: 14, color: '#f0eeff',
            fontFamily: mono ? 'monospace' : 'inherit',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {value}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {children}
      </div>
    </div>
  )
}

function CBtn({
  primary = false, href, onClick, children,
}: {
  primary?: boolean; href?: string; onClick?: () => void; children: React.ReactNode
}) {
  const style: React.CSSProperties = {
    flex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    padding: '7px 12px', borderRadius: 8,
    fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
    cursor: 'pointer', textDecoration: 'none',
    transition: 'background 0.15s',
    border: primary ? '0.5px solid rgba(124,107,255,0.25)' : 'none',
    background: primary ? 'rgba(124,107,255,0.15)' : 'rgba(255,255,255,0.06)',
    color: primary ? '#a78bfa' : 'rgba(240,238,255,0.5)',
  }
  const cls = primary ? 'c-btn-primary' : 'c-btn-ghost'
  if (href) return <a href={href} className={cls} style={style}>{children}</a>
  return <button onClick={onClick} className={cls} style={style}>{children}</button>
}

function AloqaTab({ showToast }: { showToast: (text: string) => void }) {
  const copy = (raw: string, msg: string) => {
    navigator.clipboard?.writeText(raw).catch(() => {})
    showToast(msg)
  }

  return (
    <div>
      {/* Phone */}
      <ContactCard iconBg="rgba(93,202,165,0.1)" icon={<IconPhone color="#5dcaa5" />} label="Telefon" value="+998 90 123 45 67">
        <CBtn primary href="tel:+998901234567">
          <IconPhoneCall color="#a78bfa" />
          <span>Qo'ng'iroq</span>
        </CBtn>
        <CBtn onClick={() => copy('+998901234567', '✓ Telefon nusxalandi')}>
          <IconCopy color="rgba(240,238,255,0.5)" />
        </CBtn>
      </ContactCard>

      {/* Email */}
      <ContactCard iconBg="rgba(240,180,41,0.06)" icon={<GmailIcon />} label="Email" value="sardor@gmail.com">
        <CBtn primary href="mailto:sardor@gmail.com">
          <IconExternalLink color="#a78bfa" />
          <span>Ochish</span>
        </CBtn>
        <CBtn onClick={() => copy('sardor@gmail.com', '✓ Email nusxalandi')}>
          <IconCopy color="rgba(240,238,255,0.5)" />
        </CBtn>
      </ContactCard>

      {/* Card — NEVER render full number, clipboard receives raw digits only */}
      <ContactCard iconBg="rgba(124,107,255,0.1)" icon={<IconCreditCard color="#a78bfa" />}
        label="Karta" value="**** **** **** 4782" mono>
        <CBtn primary onClick={() => copy('8600123456784782', '✓ Karta raqami nusxalandi')}>
          <IconCopy color="#a78bfa" />
          <span>Nusxalash</span>
        </CBtn>
      </ContactCard>

      {/* Click */}
      <ContactCard iconBg="transparent" icon={<ClickLogo />} label="Click" value="To'lov qilish">
        <CBtn primary onClick={() => window.open('https://click.uz', '_blank', 'noopener,noreferrer')}>
          <span>O'tish</span>
          <IconArrowRight color="#a78bfa" />
        </CBtn>
      </ContactCard>

      {/* Payme */}
      <ContactCard iconBg="transparent" icon={<PaymeLogo />} label="Payme" value="To'lov qilish">
        <CBtn primary onClick={() => window.open('https://payme.uz', '_blank', 'noopener,noreferrer')}>
          <span>O'tish</span>
          <IconArrowRight color="#a78bfa" />
        </CBtn>
      </ContactCard>

      <ConversionBanner />
    </div>
  )
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)',
      opacity: visible ? 1 : 0,
      transition: visible
        ? 'opacity 250ms ease-out, transform 250ms ease-out'
        : 'opacity 200ms ease-in, transform 200ms ease-in',
      pointerEvents: 'none', zIndex: 1000,
      background: 'rgba(93,202,165,0.12)',
      border: '0.5px solid rgba(93,202,165,0.35)',
      color: '#5dcaa5',
      borderRadius: 20, padding: '9px 20px',
      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    }}>
      {text}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState<TabId>('haqida')
  const [toast, setToast] = useState({ text: '', visible: false })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const showToast = useCallback((text: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ text, visible: true })
    timerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 2000)
  }, [])

  return (
    <>
      <style>{STYLES}</style>

      {/* Purple orb — top right */}
      <div style={{
        position: 'fixed', top: -70, right: -50,
        width: 260, height: 260, borderRadius: '50%',
        background: 'rgba(124,107,255,0.09)',
        filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat 9s ease-in-out infinite',
      }} />
      {/* Pink orb — bottom left */}
      <div style={{
        position: 'fixed', bottom: -30, left: -30,
        width: 180, height: 180, borderRadius: '50%',
        background: 'rgba(255,107,157,0.06)',
        filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat 11s ease-in-out infinite reverse',
      }} />

      <main style={{
        background: '#07070f', minHeight: '100vh',
        display: 'flex', justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        position: 'relative',
      }}>
        <div style={{ width: '100%', maxWidth: 390, position: 'relative', zIndex: 1 }}>

          {/* ── Header ── */}
          <div style={{ padding: '48px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Avatar */}
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c6bff, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 30, fontWeight: 600, letterSpacing: 1,
              boxShadow: '0 8px 32px rgba(124,107,255,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
              marginBottom: 18, flexShrink: 0,
            }}>
              SR
            </div>
            <div style={{ color: '#f0eeff', fontSize: 22, fontWeight: 500, letterSpacing: -0.4, marginBottom: 5 }}>
              Sardor Rahimov
            </div>
            <div style={{ color: 'rgba(240,238,255,0.45)', fontSize: 13, marginBottom: 7 }}>
              Frontend Developer
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(240,238,255,0.25)', fontSize: 12, marginBottom: 18 }}>
              <IconPin />
              <span>Toshkent</span>
            </div>
            <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: 13, lineHeight: 1.6, textAlign: 'center', maxWidth: 280, margin: '0 0 24px' }}>
              React va Next.js da zamonaviy veb ilovalar yarataman.
            </p>
            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button
                className="btn-outline"
                onClick={() => {
                  navigator.clipboard?.writeText(`https://vizitka.me/${params.username}`).catch(() => {})
                  showToast('✓ Havola nusxalandi')
                }}
                style={{
                  flex: 1, height: 44,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  background: 'rgba(124,107,255,0.08)', border: '1px solid rgba(124,107,255,0.28)',
                  borderRadius: 12, color: '#7c6bff', fontSize: 13, fontWeight: 500,
                  fontFamily: 'inherit', cursor: 'pointer', transition: 'background 0.18s',
                }}
              >
                <IconLink />
                <span>Havolani nusxalash</span>
              </button>
              <a
                href="/auth/register"
                className="btn-create"
                style={{
                  flex: 1, height: 44,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  background: '#7c6bff', border: 'none', borderRadius: 12,
                  color: '#fff', fontSize: 13, fontWeight: 500,
                  fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'none',
                  animation: 'glowPulse 3s ease-in-out infinite', transition: 'background 0.18s',
                }}
              >
                <span>✨</span>
                <span>Vizitka yaratish →</span>
              </a>
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 10,
            background: '#07070f',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            display: 'flex',
          }}>
            {TABS.map(tab => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  className="tab-btn"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1, padding: '13px 4px',
                    background: 'transparent', border: 'none',
                    borderBottom: `1.5px solid ${isActive ? '#7c6bff' : 'transparent'}`,
                    color: isActive ? '#a78bfa' : 'rgba(240,238,255,0.3)',
                    fontSize: 13, fontWeight: isActive ? 500 : 400,
                    fontFamily: 'inherit', cursor: 'pointer',
                    transition: 'color 0.2s, border-color 0.2s',
                    marginBottom: -1,
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* ── Content ── */}
          <div key={activeTab} style={{ padding: '20px 20px 48px', animation: 'tabIn 0.2s ease-out both' }}>
            {activeTab === 'haqida' && <HaqidaTab />}
            {activeTab === 'aloqa'  && <AloqaTab showToast={showToast} />}
            {(activeTab === 'ijtimoiy' || activeTab === 'qoshimcha') && (
              <p style={{ color: 'rgba(240,238,255,0.15)', fontSize: 13, textAlign: 'center', margin: '40px 0 0' }}>
                {activeTab}
              </p>
            )}
          </div>

        </div>

        <Toast text={toast.text} visible={toast.visible} />
      </main>
    </>
  )
}
