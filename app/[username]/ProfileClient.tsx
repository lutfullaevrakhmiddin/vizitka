'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import type { Profile, TabWithBlocks, Block, TabSlug, BlockType } from '@/types'

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
  .social-card:hover    { border-color: rgba(124,107,255,0.35) !important; background: rgba(124,107,255,0.05) !important; transform: translateY(-2px); }
`

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
        Siz ham professional vizitkaga ega bo&apos;ling
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
  iconBg: string; icon: ReactNode; label: string; value: string; valueMuted?: boolean
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

function HaqidaTab({ occupation, company, city, bio }: {
  occupation: string | null
  company: string | null
  city: string | null
  bio: string | null
}) {
  return (
    <div>
      {occupation && <InfoCard iconBg="rgba(124,107,255,0.1)" icon={<IconBriefcase color="#a78bfa" />} label="Kasb" value={occupation} />}
      {company && <InfoCard iconBg="rgba(93,202,165,0.1)" icon={<IconBuilding color="#5dcaa5" />} label="Kompaniya" value={company} />}
      {city && <InfoCard iconBg="rgba(240,180,41,0.08)" icon={<IconMapPin color="#f0b429" />} label="Shahar" value={city} />}
      {bio && <InfoCard iconBg="rgba(124,107,255,0.1)" icon={<IconQuote color="#a78bfa" />} label="Bio" value={bio} valueMuted />}
      <ConversionBanner />
    </div>
  )
}

// ── Aloqa: contact card + button ───────────────────────────────────────────────

function ContactCard({
  iconBg, icon, label, value, mono = false, children,
}: {
  iconBg: string; icon: ReactNode; label: string; value: string; mono?: boolean; children: ReactNode
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
  primary = false, href, onClick, newTab, download, children,
}: {
  primary?: boolean
  href?: string
  onClick?: () => void
  newTab?: boolean
  download?: string
  children: ReactNode
}) {
  const style: CSSProperties = {
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
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        style={style}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        download={download}
      >
        {children}
      </a>
    )
  }
  return <button onClick={onClick} className={cls} style={style}>{children}</button>
}

function AloqaTab({ blocks, showToast }: { blocks: Block[]; showToast: (text: string) => void }) {
  const copy = (raw: string, msg: string) => {
    navigator.clipboard?.writeText(raw).catch(() => {})
    showToast(msg)
  }

  return (
    <div>
      {blocks.map(block => {
        if (block.type === 'phone') {
          const tel = block.value.replace(/\s/g, '')
          return (
            <ContactCard key={block.id} iconBg="rgba(93,202,165,0.1)" icon={<IconPhone color="#5dcaa5" />} label="Telefon" value={block.value}>
              <CBtn primary href={`tel:${tel}`}>
                <IconPhoneCall color="#a78bfa" />
                <span>Qo&apos;ng&apos;iroq</span>
              </CBtn>
              <CBtn onClick={() => copy(tel, '✓ Telefon nusxalandi')}>
                <IconCopy color="rgba(240,238,255,0.5)" />
              </CBtn>
            </ContactCard>
          )
        }
        if (block.type === 'email') {
          return (
            <ContactCard key={block.id} iconBg="rgba(240,180,41,0.06)" icon={<GmailIcon />} label="Email" value={block.value}>
              <CBtn primary href={`mailto:${block.value}`}>
                <IconExternalLink color="#a78bfa" />
                <span>Ochish</span>
              </CBtn>
              <CBtn onClick={() => copy(block.value, '✓ Email nusxalandi')}>
                <IconCopy color="rgba(240,238,255,0.5)" />
              </CBtn>
            </ContactCard>
          )
        }
        if (block.type === 'card') {
          const raw = block.value.replace(/\s/g, '')
          const last4 = raw.slice(-4)
          return (
            <ContactCard key={block.id} iconBg="rgba(124,107,255,0.1)" icon={<IconCreditCard color="#a78bfa" />}
              label="Karta" value={`**** **** **** ${last4}`} mono>
              <CBtn primary onClick={() => copy(raw, '✓ Karta raqami nusxalandi')}>
                <IconCopy color="#a78bfa" />
                <span>Nusxalash</span>
              </CBtn>
            </ContactCard>
          )
        }
        if (block.type === 'click') {
          return (
            <ContactCard key={block.id} iconBg="transparent" icon={<ClickLogo />} label="Click" value="To&apos;lov qilish">
              <CBtn primary onClick={() => window.open(block.value, '_blank', 'noopener,noreferrer')}>
                <span>O&apos;tish</span>
                <IconArrowRight color="#a78bfa" />
              </CBtn>
            </ContactCard>
          )
        }
        if (block.type === 'payme') {
          return (
            <ContactCard key={block.id} iconBg="transparent" icon={<PaymeLogo />} label="Payme" value="To&apos;lov qilish">
              <CBtn primary onClick={() => window.open(block.value, '_blank', 'noopener,noreferrer')}>
                <span>O&apos;tish</span>
                <IconArrowRight color="#a78bfa" />
              </CBtn>
            </ContactCard>
          )
        }
        return null
      })}
      <ConversionBanner />
    </div>
  )
}

// ── Ijtimoiy: brand icons ──────────────────────────────────────────────────────

function IconTelegram() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="vzTgGrad" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2AABEE"/>
          <stop offset="1" stopColor="#229ED9"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#vzTgGrad)"/>
      <path d="M5.52 11.99l13.57-5.23c.63-.24 1.18.15.97.97l-2.33 10.97c-.17.8-.64.99-1.3.62l-3.6-2.65-1.74 1.68c-.2.19-.35.35-.72.35l.26-3.65 6.6-5.97c.29-.26-.06-.4-.44-.14l-8.16 5.14-3.52-1.1c-.76-.24-.78-.76.17-1.12z" fill="white"/>
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="vzIgGrad" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFDC80"/>
          <stop offset="0.4" stopColor="#F77737"/>
          <stop offset="0.75" stopColor="#E1306C"/>
          <stop offset="1" stopColor="#833AB4"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#vzIgGrad)"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.7" fill="none"/>
      <circle cx="17.3" cy="6.7" r="1.2" fill="white"/>
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/>
      <rect x="6.5" y="10" width="2" height="7.5" rx="1" fill="white"/>
      <circle cx="7.5" cy="7.2" r="1.3" fill="white"/>
      <path d="M12.5 17.5V14c0-1.1.9-2 2-2s2 .9 2 2v3.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <rect x="11.5" y="10" width="2" height="7.5" rx="1" fill="white"/>
    </svg>
  )
}

function IconGitHub() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="#f0eeff">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.907-.619.069-.607.069-.607 1.002.07 1.53 1.029 1.53 1.029.892 1.528 2.341 1.087 2.91.831.092-.645.35-1.087.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.48A9.997 9.997 0 0022 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg width={22} height={18} viewBox="0 0 24 18" fill="none">
      <path d="M23.495 2.796a3.007 3.007 0 00-2.088-2.088C19.538.18 12 .18 12 .18s-7.538 0-9.407.528A3.007 3.007 0 00.505 2.796 31.247 31.247 0 000 9a31.247 31.247 0 00.522 6.204 3.007 3.007 0 002.088 2.088C4.462 17.82 12 17.82 12 17.82s7.538 0 9.407-.528a3.007 3.007 0 002.088-2.088A31.247 31.247 0 0024 9a31.247 31.247 0 00-.505-6.204z" fill="#FF0000"/>
      <path d="M9.545 12.818V5.182L15.818 9l-6.273 3.818z" fill="white"/>
    </svg>
  )
}

function IconTikTok() {
  const d = "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1-.06z"
  return (
    <svg width={18} height={20} viewBox="0 0 24 24" fill="none">
      <path d={d} fill="#69C9D0" transform="translate(-1.2, 0)"/>
      <path d={d} fill="#EE1D52" transform="translate(1.2, 0)"/>
      <path d={d} fill="#f0eeff"/>
    </svg>
  )
}

// ── Ijtimoiy: social card + tab ────────────────────────────────────────────────

const SOCIAL_META: Partial<Record<BlockType, { name: string; iconBg: string; icon: () => ReactNode }>> = {
  telegram:  { name: 'Telegram',  iconBg: 'rgba(34,158,217,0.12)',  icon: () => <IconTelegram /> },
  instagram: { name: 'Instagram', iconBg: 'rgba(225,48,108,0.1)',   icon: () => <IconInstagram /> },
  linkedin:  { name: 'LinkedIn',  iconBg: 'rgba(10,102,194,0.1)',   icon: () => <IconLinkedIn /> },
  github:    { name: 'GitHub',    iconBg: 'rgba(255,255,255,0.06)', icon: () => <IconGitHub /> },
  youtube:   { name: 'YouTube',   iconBg: 'rgba(255,0,0,0.1)',      icon: () => <IconYouTube /> },
  tiktok:    { name: 'TikTok',    iconBg: 'rgba(255,255,255,0.06)', icon: () => <IconTikTok /> },
}

function SocialCard({ iconBg, icon, name, handle, url }: {
  iconBg: string; icon: ReactNode; name: string; handle: string; url: string
}) {
  return (
    <div
      className="social-card"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.06)',
        borderRadius: 14, padding: '14px 13px',
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: 13, color: '#f0eeff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {handle}
        </div>
      </div>
    </div>
  )
}

function IjtimoiyTab({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {blocks.map(block => {
          const meta = SOCIAL_META[block.type]
          if (!meta) return null
          return (
            <SocialCard
              key={block.id}
              iconBg={meta.iconBg}
              icon={meta.icon()}
              name={meta.name}
              handle={block.label ?? block.value}
              url={block.value}
            />
          )
        })}
      </div>
      <ConversionBanner />
    </div>
  )
}

// ── Qoshimcha: icons + tab ────────────────────────────────────────────────────

function IconFilePdf({ color }: { color: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="5.5" y="19.5" fontSize="5.5" fontWeight="700" fill={color} fontFamily="system-ui,sans-serif">PDF</text>
    </svg>
  )
}

function IconEye({ color }: { color: string }) {
  return (
    <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke={color} strokeWidth="1.3"/>
      <circle cx="8" cy="8" r="2" stroke={color} strokeWidth="1.3"/>
    </svg>
  )
}

function IconDownload({ color }: { color: string }) {
  return (
    <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <path d="M8 2v8M5 7.5l3 3 3-3" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 13h12" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function QoshimchaTab({ blocks }: { blocks: Block[] }) {
  const serviceBlocks = blocks.filter(b => b.type === 'service')
  const pdfBlocks     = blocks.filter(b => b.type === 'pdf')

  return (
    <div>
      {serviceBlocks.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,238,255,0.2)', marginBottom: 12 }}>
            Xizmatlar
          </div>
          {serviceBlocks.map(block => (
            <div key={block.id} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 15px', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#f0eeff', fontWeight: 500 }}>{block.label ?? 'Xizmat'}</span>
                <span style={{ fontSize: 14, color: '#a78bfa', fontWeight: 500 }}>{block.value}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {pdfBlocks.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,238,255,0.2)', marginTop: serviceBlocks.length > 0 ? 20 : 0, marginBottom: 12 }}>
            Hujjatlar
          </div>
          {pdfBlocks.map(block => (
            <div key={block.id} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 15px', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'rgba(240,180,41,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconFilePdf color="#f0b429"/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.25)', marginBottom: 3 }}>PDF</div>
                  <div style={{ fontSize: 14, color: '#f0eeff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {block.label ?? 'hujjat.pdf'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <CBtn href={block.value} newTab>
                  <IconEye color="rgba(240,238,255,0.5)"/>
                  <span>Ko&apos;rish</span>
                </CBtn>
                <CBtn primary href={block.value} download={block.label ?? 'hujjat.pdf'}>
                  <IconDownload color="#a78bfa"/>
                  <span>Yuklab olish</span>
                </CBtn>
              </div>
            </div>
          ))}
        </>
      )}

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

// ── ProfileClient ──────────────────────────────────────────────────────────────

export default function ProfileClient({ profile, tabs }: {
  profile: Profile
  tabs: TabWithBlocks[]
}) {
  const visibleTabs = tabs.filter(t => t.is_visible)
  const [activeTab, setActiveTab] = useState<TabSlug>(visibleTabs[0]?.slug ?? 'haqida')
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

  const tabsMap = Object.fromEntries(tabs.map(t => [t.slug, t]))
  const aloqaBlocks     = (tabsMap['aloqa']?.blocks      ?? []).filter(b => b.is_visible)
  const ijtimoiyBlocks  = (tabsMap['ijtimoiy']?.blocks   ?? []).filter(b => b.is_visible)
  const qoshimchaBlocks = (tabsMap['qoshimcha']?.blocks  ?? []).filter(b => b.is_visible)

  const initials = profile.full_name
    ? profile.full_name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <>
      <style>{STYLES}</style>

      <div style={{
        position: 'fixed', top: -70, right: -50,
        width: 260, height: 260, borderRadius: '50%',
        background: 'rgba(124,107,255,0.09)',
        filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat 9s ease-in-out infinite',
      }} />
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
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name ?? profile.username}
                style={{
                  width: 88, height: 88, borderRadius: '50%',
                  objectFit: 'cover' as const,
                  boxShadow: '0 8px 32px rgba(124,107,255,0.35)',
                  marginBottom: 18, flexShrink: 0,
                }}
              />
            ) : (
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c6bff, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 30, fontWeight: 600, letterSpacing: 1,
                boxShadow: '0 8px 32px rgba(124,107,255,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                marginBottom: 18, flexShrink: 0,
              }}>
                {initials}
              </div>
            )}

            <div style={{ color: '#f0eeff', fontSize: 22, fontWeight: 500, letterSpacing: -0.4, marginBottom: 5 }}>
              {profile.full_name ?? profile.username}
            </div>
            {profile.occupation && (
              <div style={{ color: 'rgba(240,238,255,0.45)', fontSize: 13, marginBottom: 7 }}>
                {profile.occupation}
              </div>
            )}
            {profile.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(240,238,255,0.25)', fontSize: 12, marginBottom: 18 }}>
                <IconPin />
                <span>{profile.city}</span>
              </div>
            )}
            {profile.bio && (
              <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: 13, lineHeight: 1.6, textAlign: 'center', maxWidth: 280, margin: '0 0 24px' }}>
                {profile.bio}
              </p>
            )}

            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button
                className="btn-outline"
                onClick={() => {
                  navigator.clipboard?.writeText(`https://vizitka.me/${profile.username}`).catch(() => {})
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
            {visibleTabs.map(tab => {
              const isActive = tab.slug === activeTab
              return (
                <button
                  key={tab.slug}
                  className="tab-btn"
                  onClick={() => setActiveTab(tab.slug)}
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
            {activeTab === 'haqida' && (
              <HaqidaTab
                occupation={profile.occupation}
                company={profile.company}
                city={profile.city}
                bio={profile.bio}
              />
            )}
            {activeTab === 'aloqa'     && <AloqaTab blocks={aloqaBlocks} showToast={showToast} />}
            {activeTab === 'ijtimoiy'  && <IjtimoiyTab blocks={ijtimoiyBlocks} />}
            {activeTab === 'qoshimcha' && <QoshimchaTab blocks={qoshimchaBlocks} />}
          </div>

        </div>

        <Toast text={toast.text} visible={toast.visible} />
      </main>
    </>
  )
}
