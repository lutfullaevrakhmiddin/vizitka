// Vizitka.me — guest profile page
// Mobile-first dark premium digital business card

const COLORS = {
  bg: '#07070f',
  card: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.08)',
  cardHover: 'rgba(255,255,255,0.05)',
  purple: '#7c6bff',
  purpleDim: 'rgba(124,107,255,0.14)',
  purpleBorder: 'rgba(124,107,255,0.32)',
  green: '#5dcaa5',
  yellow: '#f5c469',
  pink: '#ec6aa8',
  orange: '#ff8a3c',
  textPrimary: '#f0eeff',
  textSecondary: 'rgba(240,238,255,0.55)',
  textMuted: 'rgba(240,238,255,0.35)',
  textDim: 'rgba(240,238,255,0.22)',
};

// ───────────── ICONS ─────────────
const Icon = {
  pin: (s = 12, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M8 14s5-4.5 5-8.5A5 5 0 003 5.5C3 9.5 8 14 8 14z" stroke={c} strokeWidth="1.3"/>
      <circle cx="8" cy="5.5" r="1.7" stroke={c} strokeWidth="1.3"/>
    </svg>
  ),
  link: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M6.5 9.5l3-3M7 4.5l1.5-1.5a2.8 2.8 0 014 4L11 8.5M9 11.5L7.5 13a2.8 2.8 0 01-4-4L5 7.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  qr: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2"/>
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2"/>
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2"/>
      <rect x="3.3" y="3.3" width="1.4" height="1.4" fill={c}/>
      <rect x="11.3" y="3.3" width="1.4" height="1.4" fill={c}/>
      <rect x="3.3" y="11.3" width="1.4" height="1.4" fill={c}/>
      <path d="M9.5 9.5h2v2h-2zM12.5 9.5h2M9.5 12.5h2M12.5 12.5v2M14.5 14.5h-2" stroke={c} strokeWidth="1.2"/>
    </svg>
  ),
  phone: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M4.5 3.5l2.5-1L9 6 7.2 7.5a10 10 0 005.3 5.3L14 11l3.5 2-1 2.5a2 2 0 01-2.3 1.2A14 14 0 013.3 5.8 2 2 0 014.5 3.5z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  mail: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke={c} strokeWidth="1.5"/>
      <path d="M3 5l7 5.5L17 5" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  card: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4.5" width="16" height="11" rx="2" stroke={c} strokeWidth="1.5"/>
      <path d="M2 8h16" stroke={c} strokeWidth="1.5"/>
      <rect x="5" y="11" width="3" height="1.5" rx="0.5" fill={c}/>
    </svg>
  ),
  copy: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke={c} strokeWidth="1.3"/>
      <path d="M3.5 11V3.5A1 1 0 014.5 2.5H11" stroke={c} strokeWidth="1.3"/>
    </svg>
  ),
  check: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.5 12L13 5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  arrowRight: (s = 12, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8M6.5 2.5L10 6L6.5 9.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  arrowDown: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M7 2v9M3 7.5L7 11.5L11 7.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  external: (s = 11, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 12 12" fill="none">
      <path d="M4.5 2.5h-2v7h7v-2M7 2h3v3M10 2L5 7" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// ───────────── HEADER ─────────────
function Header({ onCopyLink, onShowQR }) {
  return (
    <div style={{ padding: '8px 20px 24px' }}>
      {/* avatar */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'linear-gradient(135deg, #8b6dff 0%, #6a5cf0 50%, #b56cff 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 26, fontWeight: 600, letterSpacing: 0.5,
        boxShadow: '0 8px 24px rgba(124,107,255,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
        marginBottom: 14,
      }}>
        SR
      </div>

      {/* name + role */}
      <div style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 500, letterSpacing: -0.2, marginBottom: 2 }}>
        Sardor Rahimov
      </div>
      <div style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 4 }}>
        Product Designer · Uzum
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: COLORS.textMuted, fontSize: 12, marginBottom: 12 }}>
        <span style={{ display: 'inline-flex' }}>{Icon.pin(11, COLORS.textMuted)}</span>
        <span>Toshkent, O'zbekiston</span>
      </div>

      {/* bio */}
      <div style={{
        color: COLORS.textSecondary, fontSize: 13, lineHeight: 1.5, marginBottom: 16,
        maxWidth: 320,
      }}>
        Mobil ilovalar va veb-platformalar uchun interfeyslar yarataman. Yangi loyihalar uchun ochiqman.
      </div>

      {/* buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCopyLink} style={btnOutline}>
          {Icon.link(13, COLORS.purple)}
          <span>Havolani nusxalash</span>
        </button>
        <button onClick={onShowQR} style={{ ...btnOutline, padding: '0 14px', flex: 'none' }}>
          {Icon.qr(13, COLORS.purple)}
          <span>QR</span>
        </button>
      </div>
    </div>
  );
}

const btnOutline = {
  flex: 1,
  height: 38,
  padding: '0 14px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  background: COLORS.purpleDim,
  border: `1px solid ${COLORS.purpleBorder}`,
  borderRadius: 11,
  color: COLORS.purple,
  fontSize: 13, fontWeight: 500,
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'all 160ms ease',
};

// ───────────── TABS ─────────────
const TABS = ['Haqida', 'Aloqa', 'Ijtimoiy', "Qo'shimcha"];

function TabBar({ active, onChange }) {
  return (
    <div style={{
      position: 'sticky', top: 62, zIndex: 10,
      background: 'rgba(7,7,15,0.85)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderTop: `1px solid ${COLORS.cardBorder}`,
      borderBottom: `1px solid ${COLORS.cardBorder}`,
      display: 'flex',
      padding: '0 4px',
    }}>
      {TABS.map(t => {
        const isActive = t === active;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className="vz-tab"
            style={{
              flex: 1, padding: '14px 4px',
              background: 'transparent', border: 'none',
              borderBottom: `2px solid ${isActive ? COLORS.purple : 'transparent'}`,
              color: isActive ? COLORS.purple : COLORS.textMuted,
              fontSize: 13, fontWeight: isActive ? 500 : 400,
              fontFamily: 'inherit', cursor: 'pointer',
              transition: 'color 160ms ease, border-color 160ms ease',
              marginBottom: -1,
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

// ───────────── CONTACT CARDS ─────────────
function ContactRow({ icon, iconBg, iconColor, label, value, mono, children }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `0.5px solid ${COLORS.cardBorder}`,
      borderRadius: 14,
      padding: 14,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {React.cloneElement(icon, { ...(icon.props || {}) })}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {label}
          </div>
          <div style={{
            color: COLORS.textPrimary, fontSize: 15, fontWeight: 500,
            fontFamily: mono ? "'JetBrains Mono', 'SF Mono', ui-monospace, monospace" : 'inherit',
            letterSpacing: mono ? 0.4 : 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {value}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function ActionBtn({ children, primary, accent = COLORS.purple, onClick }) {
  const style = primary
    ? {
        background: `linear-gradient(180deg, ${accent} 0%, ${accent}cc 100%)`,
        color: '#fff',
        border: `1px solid ${accent}`,
        boxShadow: `0 2px 8px ${accent}33`,
      }
    : {
        background: 'rgba(255,255,255,0.04)',
        color: COLORS.textSecondary,
        border: `1px solid ${COLORS.cardBorder}`,
      };
  return (
    <button onClick={onClick} className="vz-action" style={{
      flex: 1, height: 34, borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit',
      cursor: 'pointer', transition: 'all 160ms ease',
      ...style,
    }}>
      {children}
    </button>
  );
}

// Generic monogram tile for payment placeholders (no branded logos)
function PaymentMonogram({ letter, bg, fg }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: fg, fontWeight: 700, fontSize: 16,
      fontFamily: "'Geist Mono', 'SF Mono', ui-monospace, monospace",
      letterSpacing: -0.5,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18)`,
    }}>
      {letter}
    </div>
  );
}

function AloqaTab({ onCopy, onToast }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Phone */}
      <ContactRow
        icon={<div>{Icon.phone(17, COLORS.green)}</div>}
        iconBg="rgba(93,202,165,0.14)"
        label="Telefon"
        value="+998 90 123 45 67"
      >
        <ActionBtn primary accent={COLORS.green} onClick={() => onToast("Qo'ng'iroq qilinmoqda…")}>
          {Icon.phone(13, '#fff')}
          <span>Qo'ng'iroq</span>
        </ActionBtn>
        <ActionBtn onClick={() => onCopy("+998 90 123 45 67", "Telefon raqami nusxalandi")}>
          {Icon.copy(12, COLORS.textSecondary)}
          <span>Nusxalash</span>
        </ActionBtn>
      </ContactRow>

      {/* Email */}
      <ContactRow
        icon={<div>{Icon.mail(17, COLORS.yellow)}</div>}
        iconBg="rgba(245,196,105,0.13)"
        label="Email"
        value="sardor@gmail.com"
      >
        <ActionBtn primary accent={COLORS.yellow} onClick={() => onToast('Pochta ochilmoqda…')}>
          {Icon.mail(13, '#1a1408')}
          <span style={{ color: '#1a1408' }}>Ochish</span>
        </ActionBtn>
        <ActionBtn onClick={() => onCopy("sardor@gmail.com", "Email nusxalandi")}>
          {Icon.copy(12, COLORS.textSecondary)}
          <span>Nusxalash</span>
        </ActionBtn>
      </ContactRow>

      {/* Karta */}
      <ContactRow
        icon={<div>{Icon.card(17, COLORS.purple)}</div>}
        iconBg={COLORS.purpleDim}
        label="Karta"
        value="**** **** **** 4782"
        mono
      >
        <ActionBtn primary onClick={() => onCopy("8600 1234 5678 4782", "Karta raqami nusxalandi")}>
          {Icon.copy(12, '#fff')}
          <span>Nusxalash</span>
        </ActionBtn>
      </ContactRow>

      {/* Click */}
      <ContactRow
        icon={<PaymentMonogram letter="C" bg="linear-gradient(135deg,#1eb86c,#0f8a4f)" fg="#fff" />}
        iconBg="transparent"
        label="Click"
        value="To'lov qilish"
      >
        <ActionBtn primary accent="#1eb86c" onClick={() => onToast("Click ilovasiga o'tilmoqda…")}>
          <span>O'tish</span>
          {Icon.arrowRight(11, '#fff')}
        </ActionBtn>
      </ContactRow>

      {/* Payme */}
      <ContactRow
        icon={<PaymentMonogram letter="P" bg="linear-gradient(135deg,#ff8a3c,#e6661a)" fg="#fff" />}
        iconBg="transparent"
        label="Payme"
        value="To'lov qilish"
      >
        <ActionBtn primary accent="#ff8a3c" onClick={() => onToast("Payme ilovasiga o'tilmoqda…")}>
          <span>O'tish</span>
          {Icon.arrowRight(11, '#fff')}
        </ActionBtn>
      </ContactRow>
    </div>
  );
}

// ───────────── OTHER TABS (placeholder content) ─────────────
function HaqidaTab() {
  const facts = [
    ["Mutaxassislik", "Product Design"],
    ["Tajriba", "6+ yil"],
    ["Til bilish", "Uz · Ru · En"],
    ["Holat", "Yangi loyihalarga ochiq"],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        background: COLORS.card, border: `0.5px solid ${COLORS.cardBorder}`,
        borderRadius: 14, padding: 16,
      }}>
        <div style={{ color: COLORS.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Men haqimda
        </div>
        <div style={{ color: COLORS.textPrimary, fontSize: 14, lineHeight: 1.55 }}>
          Toshkentda yashayman, mobil va veb mahsulotlar uchun interfeys dizayni bilan shug'ullanaman. Foydalanuvchi tajribasi, prototiplash va dizayn tizimlari — asosiy yo'nalishlarim.
        </div>
      </div>
      <div style={{
        background: COLORS.card, border: `0.5px solid ${COLORS.cardBorder}`,
        borderRadius: 14, padding: 4,
      }}>
        {facts.map(([k, v], i) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 14px',
            borderBottom: i < facts.length - 1 ? `0.5px solid ${COLORS.cardBorder}` : 'none',
          }}>
            <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{k}</span>
            <span style={{ color: COLORS.textPrimary, fontSize: 13, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IjtimoiyTab({ onToast }) {
  const socials = [
    { name: 'Telegram', handle: '@sardor_r', color: '#2aabee' },
    { name: 'Instagram', handle: '@sardor.design', color: '#e1306c' },
    { name: 'LinkedIn', handle: 'sardor-rahimov', color: '#0a66c2' },
    { name: 'X / Twitter', handle: '@sardor_rh', color: '#f0eeff' },
    { name: 'Behance', handle: 'sardor', color: '#1769ff' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {socials.map(s => (
        <button key={s.name} onClick={() => onToast(`${s.name} ochilmoqda…`)} className="vz-social" style={{
          background: COLORS.card, border: `0.5px solid ${COLORS.cardBorder}`,
          borderRadius: 14, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          transition: 'background 160ms ease',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `${s.color}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: s.color, fontWeight: 600, fontSize: 13,
          }}>
            {s.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 500 }}>{s.name}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{s.handle}</div>
          </div>
          <span style={{ color: COLORS.textDim }}>{Icon.external(11, COLORS.textDim)}</span>
        </button>
      ))}
    </div>
  );
}

function QoshimchaTab({ onToast }) {
  const items = [
    { name: 'Portfolio', sub: 'sardor.design', accent: COLORS.purple },
    { name: 'CV — PDF', sub: '2.3 MB', accent: COLORS.green },
    { name: 'Kalendar', sub: 'Uchrashuv tayinlash', accent: COLORS.yellow },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(s => (
        <button key={s.name} onClick={() => onToast(`${s.name} ochilmoqda…`)} className="vz-social" style={{
          background: COLORS.card, border: `0.5px solid ${COLORS.cardBorder}`,
          borderRadius: 14, padding: '14px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `${s.accent}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: s.accent }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 500 }}>{s.name}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{s.sub}</div>
          </div>
          <span style={{ color: COLORS.textDim }}>{Icon.arrowRight(11, COLORS.textDim)}</span>
        </button>
      ))}
    </div>
  );
}

// ───────────── BOTTOM CTA ─────────────
function BottomCTA({ onToast }) {
  return (
    <div style={{ padding: '32px 4px 16px', textAlign: 'center' }}>
      <div style={{
        height: 1, background: COLORS.cardBorder, margin: '0 0 22px',
      }} />
      <div style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.5, marginBottom: 8, maxWidth: 280, margin: '0 auto 12px' }}>
        Siz ham o'zingizning raqamli vizitkangizni yarating
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <span className="vz-pulse-arrow" style={{ color: COLORS.purple, opacity: 0.5 }}>
          {Icon.arrowDown(14, COLORS.purple)}
        </span>
      </div>
      <button
        onClick={() => onToast("Vizitka.me ochilmoqda…")}
        className="vz-cta"
        style={{
          height: 40, padding: '0 22px',
          background: 'transparent',
          border: `1px solid ${COLORS.purpleBorder}`,
          borderRadius: 12,
          color: COLORS.purple,
          fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          transition: 'all 200ms ease',
        }}
      >
        <span>Bepul yaratish</span>
        {Icon.arrowRight(11, COLORS.purple)}
      </button>
      <div style={{ color: COLORS.textDim, fontSize: 11, marginTop: 22 }}>
        vizitka.me bilan yaratilgan
      </div>
    </div>
  );
}

// ───────────── TOAST ─────────────
function Toast({ message, visible }) {
  return (
    <div style={{
      position: 'absolute', bottom: 50, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 14}px)`,
      opacity: visible ? 1 : 0,
      transition: 'all 280ms cubic-bezier(.2,.7,.2,1)',
      pointerEvents: 'none',
      zIndex: 100,
      background: 'rgba(20,46,38,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: `1px solid rgba(93,202,165,0.35)`,
      boxShadow: `0 0 0 4px rgba(93,202,165,0.08), 0 8px 32px rgba(93,202,165,0.2)`,
      borderRadius: 999,
      padding: '9px 16px',
      display: 'flex', alignItems: 'center', gap: 8,
      color: COLORS.green,
      fontSize: 13, fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {Icon.check(13, COLORS.green)}
      <span>{message}</span>
    </div>
  );
}

// ───────────── QR MODAL ─────────────
function QRModal({ visible, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 90,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 200ms ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
      <div style={{
        background: '#0e0e1a',
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 22,
        padding: 22,
        textAlign: 'center',
        transform: visible ? 'scale(1)' : 'scale(0.94)',
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{
          width: 200, height: 200, background: '#fff', borderRadius: 14,
          marginBottom: 14,
          display: 'grid', gridTemplateColumns: 'repeat(21,1fr)', gap: 0,
          padding: 10,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
        }}>
          {/* deterministic faux-QR */}
          {Array.from({ length: 21 * 21 }).map((_, i) => {
            const x = i % 21, y = Math.floor(i / 21);
            // corner finder patterns
            const inFinder = (cx, cy) =>
              x >= cx && x < cx + 7 && y >= cy && y < cy + 7 &&
              !(x > cx && x < cx + 6 && y > cy && y < cy + 6 && (x === cx + 1 || x === cx + 5 || y === cy + 1 || y === cy + 5));
            const inCenter = (cx, cy) =>
              x >= cx + 2 && x < cx + 5 && y >= cy + 2 && y < cy + 5;
            const finder = inFinder(0, 0) || inFinder(14, 0) || inFinder(0, 14);
            const center = inCenter(0, 0) || inCenter(14, 0) || inCenter(0, 14);
            const blank =
              (x >= 1 && x <= 5 && y === 6) || (y >= 1 && y <= 5 && x === 6) ||
              (x >= 15 && x <= 19 && y === 6) || (y >= 1 && y <= 5 && x === 14) ||
              (x >= 1 && x <= 5 && y === 14) || (y >= 15 && y <= 19 && x === 6);
            let on = finder || center;
            if (!on && !blank) {
              // hash-ish pattern
              const h = (x * 31 + y * 17 + x * y) % 7;
              on = h < 3;
            }
            return <div key={i} style={{ background: on ? '#07070f' : '#fff', aspectRatio: '1/1' }} />;
          })}
        </div>
        <div style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 500 }}>vizitka.me/sardor</div>
        <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>Skaner qiling</div>
      </div>
    </div>
  );
}

// ───────────── BACKGROUND ORBS ─────────────
function Orbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 280, height: 280,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,107,255,0.32) 0%, rgba(124,107,255,0) 60%)',
        filter: 'blur(14px)',
      }} />
      <div style={{
        position: 'absolute', bottom: 60, left: -90, width: 260, height: 260,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,106,168,0.22) 0%, rgba(236,106,168,0) 60%)',
        filter: 'blur(14px)',
      }} />
      <div style={{
        position: 'absolute', top: 320, right: -60, width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,107,255,0.14) 0%, rgba(124,107,255,0) 60%)',
        filter: 'blur(12px)',
      }} />
    </div>
  );
}

// ───────────── APP ─────────────
function VizitkaApp() {
  const [tab, setTab] = React.useState('Aloqa');
  const [toast, setToast] = React.useState({ visible: false, message: '' });
  const [qrOpen, setQrOpen] = React.useState(false);
  const toastTimer = React.useRef(null);

  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message });
    toastTimer.current = setTimeout(() => {
      setToast(t => ({ ...t, visible: false }));
    }, 2200);
  };

  const copy = (text, label) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    showToast(label);
  };

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: COLORS.bg,
      color: COLORS.textPrimary,
      fontFamily: '-apple-system, "SF Pro Text", "Inter", system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      <Orbs />

      {/* status bar safe area — fades content under it */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 62, zIndex: 5,
        background: 'linear-gradient(180deg, rgba(7,7,15,0.92) 0%, rgba(7,7,15,0.78) 60%, rgba(7,7,15,0) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1, height: '100%',
        overflowY: 'auto', overflowX: 'hidden',
        paddingTop: 62,
        paddingBottom: 34,
      }}>
        <Header
          onCopyLink={() => copy('https://vizitka.me/sardor', 'Havola nusxalandi')}
          onShowQR={() => setQrOpen(true)}
        />
        <TabBar active={tab} onChange={setTab} />

        <div style={{ padding: '16px 16px 0' }}>
          {tab === 'Aloqa' && <AloqaTab onCopy={copy} onToast={showToast} />}
          {tab === 'Haqida' && <HaqidaTab />}
          {tab === 'Ijtimoiy' && <IjtimoiyTab onToast={showToast} />}
          {tab === "Qo'shimcha" && <QoshimchaTab onToast={showToast} />}
        </div>

        <BottomCTA onToast={showToast} />
      </div>

      <Toast message={toast.message} visible={toast.visible} />
      <QRModal visible={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
}

Object.assign(window, { VizitkaApp });
