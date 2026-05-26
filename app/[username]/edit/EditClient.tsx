'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, TabWithBlocks, Block, BlockType, TabSlug } from '@/types'

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(16px,-12px) scale(1.04); }
    66%      { transform: translate(-10px,16px) scale(0.97); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes greenPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(93,202,165,0.4); }
    50%      { box-shadow: 0 0 0 5px rgba(93,202,165,0); }
  }
  .edit-input:focus  { border-color: rgba(124,107,255,0.5) !important; background: rgba(124,107,255,0.06) !important; }
  .edit-textarea:focus { border-color: rgba(124,107,255,0.5) !important; background: rgba(124,107,255,0.06) !important; }
  .btn-back:hover    { background: rgba(255,255,255,0.08) !important; }
  .btn-save:hover    { background: rgba(93,202,165,0.85) !important; }
  .btn-eye:hover     { opacity: 0.7 !important; }
  .btn-icon:hover    { background: rgba(255,255,255,0.1) !important; }
  .toggle-wrap:active { transform: scale(0.95); }
  .add-btn:hover     { background: rgba(124,107,255,0.12) !important; border-color: rgba(124,107,255,0.4) !important; }
  .upload-btn:hover  { background: rgba(124,107,255,0.12) !important; border-color: rgba(124,107,255,0.4) !important; }
  @keyframes spin { to { transform: rotate(360deg); } }
`

// ── Block type metadata ───────────────────────────────────────────────────────

const BLOCK_TYPE_META: Partial<Record<BlockType, { label: string; placeholder: string; tab: TabSlug }>> = {
  phone:     { label: 'Telefon',    placeholder: '+998 90 123 45 67', tab: 'aloqa' },
  email:     { label: 'Email',      placeholder: 'example@gmail.com',  tab: 'aloqa' },
  card:      { label: 'Karta',      placeholder: '8600 0000 0000 0000', tab: 'aloqa' },
  click:     { label: 'Click',      placeholder: 'https://click.uz/...', tab: 'aloqa' },
  payme:     { label: 'Payme',      placeholder: 'https://payme.uz/...', tab: 'aloqa' },
  telegram:  { label: 'Telegram',   placeholder: 'https://t.me/username', tab: 'ijtimoiy' },
  instagram: { label: 'Instagram',  placeholder: 'https://instagram.com/...', tab: 'ijtimoiy' },
  linkedin:  { label: 'LinkedIn',   placeholder: 'https://linkedin.com/in/...', tab: 'ijtimoiy' },
  github:    { label: 'GitHub',     placeholder: 'https://github.com/...', tab: 'ijtimoiy' },
  youtube:   { label: 'YouTube',    placeholder: 'https://youtube.com/@...', tab: 'ijtimoiy' },
  tiktok:    { label: 'TikTok',     placeholder: 'https://tiktok.com/@...', tab: 'ijtimoiy' },
  service:   { label: 'Xizmat',     placeholder: 'Xizmat nomi', tab: 'qoshimcha' },
  pdf:       { label: 'PDF',        placeholder: 'https://...pdf', tab: 'haqida' },
}

const ALOQA_TYPES:    BlockType[] = ['phone', 'email', 'card', 'click', 'payme']
const IJTIMOIY_TYPES: BlockType[] = ['telegram', 'instagram', 'linkedin', 'github', 'youtube', 'tiktok']
const QOSHIMCHA_TYPES: BlockType[] = ['service', 'pdf']

// ── Toast ──────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'warning'

function Toast({ text, visible, variant }: { text: string; visible: boolean; variant: ToastVariant }) {
  const isWarning = variant === 'warning'
  return (
    <div style={{
      position: 'fixed', bottom: 96, left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 250ms ease, transform 250ms ease',
      pointerEvents: 'none', zIndex: 200,
      background: isWarning ? 'rgba(240,180,41,0.12)' : 'rgba(93,202,165,0.12)',
      border: `0.5px solid ${isWarning ? 'rgba(240,180,41,0.35)' : 'rgba(93,202,165,0.35)'}`,
      color: isWarning ? '#f0b429' : '#5dcaa5',
      borderRadius: 20, padding: '9px 20px',
      fontSize: 13, fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {text}
    </div>
  )
}

function useToast() {
  const [toast, setToast] = useState({ text: '', visible: false, variant: 'success' as ToastVariant })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((text: string, variant: ToastVariant = 'success') => {
    if (timer.current) clearTimeout(timer.current)
    setToast({ text, visible: true, variant })
    timer.current = setTimeout(() => setToast(p => ({ ...p, visible: false })), 2500)
  }, [])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  return { toast, show }
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconBack() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconCamera() {
  return (
    <svg width={16} height={16} viewBox="0 0 20 20" fill="none">
      <path d="M2 7a2 2 0 012-2h1.5l1-2h7l1 2H17a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke="white" strokeWidth="1.3"/>
      <circle cx="10" cy="11" r="2.5" stroke="white" strokeWidth="1.3"/>
    </svg>
  )
}

function IconEye({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ) : (
    <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
      <path d="M13.5 2.5l-11 11M6.2 5.1A6 6 0 011 8s2.5 5 7 5a6 6 0 003.8-1.3M4.5 4.5C5.5 3.6 6.7 3 8 3c4.5 0 7 5 7 5a12 12 0 01-1.5 2.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}

function IconPencil() {
  return (
    <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 4.5h11M6 4.5V3h4v1.5M5.5 4.5l.5 8h5l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function IconGrip() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="1" fill="currentColor"/>
      <circle cx="10" cy="5" r="1" fill="currentColor"/>
      <circle cx="6" cy="8" r="1" fill="currentColor"/>
      <circle cx="10" cy="8" r="1" fill="currentColor"/>
      <circle cx="6" cy="11" r="1" fill="currentColor"/>
      <circle cx="10" cy="11" r="1" fill="currentColor"/>
    </svg>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className="toggle-wrap"
      onClick={() => onChange(!on)}
      style={{
        width: 38, height: 22, borderRadius: 11, flexShrink: 0,
        background: on ? '#5dcaa5' : 'rgba(255,255,255,0.1)',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: on ? 19 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </div>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '0.5px solid rgba(255,255,255,0.06)',
      borderRadius: 12, marginBottom: 12,
      animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
    }}>
      <div style={{ padding: '14px 16px 12px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,238,255,0.3)' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '12px 16px 14px' }}>
        {children}
      </div>
    </div>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 13px',
  background: 'rgba(255,255,255,0.04)',
  border: '0.5px solid rgba(255,255,255,0.08)',
  borderRadius: 10, fontSize: 14, color: '#f0eeff',
  fontFamily: 'inherit', outline: 'none',
  WebkitAppearance: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, background 0.2s',
}

// ── Add Block Modal ───────────────────────────────────────────────────────────

function AddBlockModal({
  tabSlug, onClose, onAdd,
}: {
  tabSlug: TabSlug
  onClose: () => void
  onAdd: (type: BlockType, value: string, label: string) => Promise<void>
}) {
  const types = tabSlug === 'aloqa' ? ALOQA_TYPES
    : tabSlug === 'ijtimoiy' ? IJTIMOIY_TYPES
    : QOSHIMCHA_TYPES

  const [selectedType, setSelectedType] = useState<BlockType>(types[0])
  const [value, setValue] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)

  const meta = BLOCK_TYPE_META[selectedType]

  const handleAdd = async () => {
    if (!value.trim()) return
    setSaving(true)
    await onAdd(selectedType, value.trim(), label.trim())
    setSaving(false)
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(7,7,15,0.85)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 0 0',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 390,
          background: '#111119',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 36px',
          animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#f0eeff' }}>Yangi maydon qo&apos;shish</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,238,255,0.4)', fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>

        {/* Type selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              style={{
                padding: '5px 11px', borderRadius: 8,
                background: selectedType === t ? 'rgba(124,107,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `0.5px solid ${selectedType === t ? 'rgba(124,107,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: selectedType === t ? '#a78bfa' : 'rgba(240,238,255,0.4)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {BLOCK_TYPE_META[t]?.label ?? t}
            </button>
          ))}
        </div>

        {/* Value input */}
        <input
          className="edit-input"
          style={{ ...inputStyle, marginBottom: 10 }}
          placeholder={meta?.placeholder ?? 'Qiymat'}
          value={value}
          onChange={e => setValue(e.target.value)}
          suppressHydrationWarning
        />

        {/* Label (for service/pdf) */}
        {(selectedType === 'service' || selectedType === 'pdf') && (
          <input
            className="edit-input"
            style={{ ...inputStyle, marginBottom: 10 }}
            placeholder={selectedType === 'service' ? "Narx (masalan: 50 000 so'm)" : 'Fayl nomi'}
            value={label}
            onChange={e => setLabel(e.target.value)}
            suppressHydrationWarning
          />
        )}

        <button
          onClick={handleAdd}
          disabled={saving || !value.trim()}
          style={{
            width: '100%', padding: 13, borderRadius: 10,
            background: saving || !value.trim() ? 'rgba(93,202,165,0.3)' : '#5dcaa5',
            border: 'none', color: '#07070f', fontSize: 14, fontWeight: 600,
            cursor: saving || !value.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'background 0.2s',
          }}
        >
          {saving ? 'Saqlanmoqda...' : '+ Qo\'shish'}
        </button>
      </div>
    </div>
  )
}

// ── Block row ─────────────────────────────────────────────────────────────────

function BlockRow({ block, onToggleVisible, onEdit, onDelete }: {
  block: Block
  onToggleVisible: (id: string, current: boolean) => void
  onEdit: (id: string, currentValue: string, currentLabel: string | null) => void
  onDelete: (id: string) => void
}) {
  const meta = BLOCK_TYPE_META[block.type]
  const displayValue = block.type === 'card'
    ? `**** ${block.value.replace(/\s/g, '').slice(-4)}`
    : block.value.length > 28 ? block.value.slice(0, 28) + '…' : block.value

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 0',
      borderBottom: '0.5px solid rgba(255,255,255,0.05)',
    }}>
      {/* Type + value */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(240,238,255,0.6)' }}>
            {meta?.label ?? block.type}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 4,
            background: block.is_visible ? 'rgba(93,202,165,0.1)' : 'rgba(255,128,128,0.1)',
            color: block.is_visible ? '#5dcaa5' : '#ff8080',
          }}>
            {block.is_visible ? 'ko\'rinadi' : 'yashirilgan'}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(240,238,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button
          className="btn-icon"
          onClick={() => onEdit(block.id, block.value, block.label)}
          style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(240,238,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
        >
          <IconPencil />
        </button>
        <button
          className="btn-eye"
          onClick={() => onToggleVisible(block.id, block.is_visible)}
          style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: 'none', color: block.is_visible ? '#5dcaa5' : 'rgba(255,128,128,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.15s', opacity: 1 }}
        >
          <IconEye visible={block.is_visible} />
        </button>
        <button
          className="btn-icon"
          onClick={() => onDelete(block.id)}
          style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,80,80,0.08)', border: 'none', color: 'rgba(255,128,128,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
        >
          <IconTrash />
        </button>
      </div>
    </div>
  )
}

// ── Inline edit row ───────────────────────────────────────────────────────────

function InlineEdit({ block, onSave, onCancel }: {
  block: Block
  onSave: (id: string, value: string, label: string | null) => Promise<void>
  onCancel: () => void
}) {
  const [value, setValue] = useState(block.value)
  const [label, setLabel] = useState(block.label ?? '')
  const [saving, setSaving] = useState(false)
  const needsLabel = block.type === 'service' || block.type === 'pdf'
  const meta = BLOCK_TYPE_META[block.type]

  const handleSave = async () => {
    setSaving(true)
    await onSave(block.id, value, needsLabel ? label : null)
    setSaving(false)
    onCancel()
  }

  return (
    <div style={{ padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.3)', marginBottom: 6, fontWeight: 500, letterSpacing: 0.5 }}>
        {meta?.label ?? block.type} — tahrirlash
      </div>
      <input
        className="edit-input"
        style={{ ...inputStyle, marginBottom: needsLabel ? 8 : 10 }}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={meta?.placeholder}
        suppressHydrationWarning
      />
      {needsLabel && (
        <input
          className="edit-input"
          style={{ ...inputStyle, marginBottom: 10 }}
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder={block.type === 'service' ? 'Narx' : 'Fayl nomi'}
          suppressHydrationWarning
        />
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onCancel}
          style={{ flex: 1, padding: '8px 0', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', color: 'rgba(240,238,255,0.5)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Bekor
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ flex: 1, padding: '8px 0', borderRadius: 8, background: '#5dcaa5', border: 'none', color: '#07070f', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? '...' : 'Saqlash'}
        </button>
      </div>
    </div>
  )
}

// ── Blocks section ────────────────────────────────────────────────────────────

function BlocksSection({ title, blocks, tabSlug, onToggleVisible, onEditSave, onDelete, onAdd }: {
  title: string
  blocks: Block[]
  tabSlug: TabSlug
  onToggleVisible: (id: string, current: boolean) => void
  onEditSave: (id: string, value: string, label: string | null) => Promise<void>
  onDelete: (id: string) => void
  onAdd: (type: BlockType, value: string, label: string) => Promise<void>
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  return (
    <SectionCard title={title}>
      {blocks.length === 0 && (
        <div style={{ fontSize: 13, color: 'rgba(240,238,255,0.2)', textAlign: 'center', padding: '8px 0 4px' }}>
          Hozircha bo&apos;sh
        </div>
      )}
      {blocks.map(block => (
        editingId === block.id
          ? <InlineEdit
              key={block.id}
              block={block}
              onSave={onEditSave}
              onCancel={() => setEditingId(null)}
            />
          : <BlockRow
              key={block.id}
              block={block}
              onToggleVisible={onToggleVisible}
              onEdit={(id) => setEditingId(id)}
              onDelete={onDelete}
            />
      ))}

      <button
        className="add-btn"
        onClick={() => setShowModal(true)}
        style={{
          width: '100%', padding: '9px 0', marginTop: 8,
          borderRadius: 9, background: 'rgba(124,107,255,0.06)',
          border: '0.5px dashed rgba(124,107,255,0.25)',
          color: 'rgba(124,107,255,0.7)', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.15s',
        }}
      >
        + Qo&apos;shish
      </button>

      {showModal && (
        <AddBlockModal
          tabSlug={tabSlug}
          onClose={() => setShowModal(false)}
          onAdd={onAdd}
        />
      )}
    </SectionCard>
  )
}

// ── EditClient ────────────────────────────────────────────────────────────────

export default function EditClient({ profile: initialProfile, tabs: initialTabs }: {
  profile: Profile
  tabs: TabWithBlocks[]
}) {
  const router = useRouter()
  const supabase = createClient()
  const { toast, show: showToast } = useToast()

  const [profile, setProfile] = useState(initialProfile)
  const [tabs, setTabs] = useState(initialTabs)
  const [saving, setSaving] = useState(false)

  // avatar upload
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialProfile.avatar_url)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // qr visibility (local mirror — source of truth is DB)
  const [qrVisibleLocal, setQrVisibleLocal] = useState<boolean | null>(null)
  const [qrBlockIdLocal, setQrBlockIdLocal] = useState<string | null>(null)

  // pdf upload
  const initialPdfBlock = initialTabs.flatMap(t => t.blocks).find(b => b.tab_slug === 'haqida' && b.type === 'pdf')
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfDeleting, setPdfDeleting] = useState(false)
  const [pdfFileName, setPdfFileName] = useState<string | null>(initialPdfBlock?.label ?? null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  // Split full_name
  const nameParts = (profile.full_name ?? '').trim().split(/\s+/)
  const [firstName, setFirstName] = useState(nameParts[0] ?? '')
  const [lastName,  setLastName]  = useState(nameParts.slice(1).join(' '))
  const [occupation, setOccupation] = useState(profile.occupation ?? '')
  const [company,    setCompany]    = useState(profile.company ?? '')
  const [city,       setCity]       = useState(profile.city ?? '')
  const [bio,        setBio]        = useState(profile.bio ?? '')

  const initials = profile.full_name
    ? profile.full_name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  // ── Save profile ─────────────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    setSaving(true)
    const full_name = [firstName, lastName].filter(Boolean).join(' ') || null
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, occupation: occupation || null, company: company || null, city: city || null, bio: bio || null })
      .eq('id', profile.id)
      .select()
      .single()
    setSaving(false)
    if (error) { showToast('⚠ Xatolik yuz berdi', 'warning'); return }
    setProfile(data)
    showToast('✓ Saqlandi')
    setTimeout(() => router.push('/' + profile.username), 1000)
  }

  // ── Tab visibility toggle ─────────────────────────────────────────────────

  const handleToggleTab = async (tabId: string, currentVisible: boolean) => {
    const next = !currentVisible
    setTabs(prev => prev.map(t => t.id === tabId ? { ...t, is_visible: next } : t))
    const { error } = await supabase.from('tabs').update({ is_visible: next }).eq('id', tabId)
    if (error) {
      setTabs(prev => prev.map(t => t.id === tabId ? { ...t, is_visible: currentVisible } : t))
      showToast('⚠ Xatolik yuz berdi', 'warning')
    } else {
      showToast(next ? '✓ Bo\'lim yoqildi' : '⚠ Bo\'lim yashirildi — mehmonlar ko\'rmaydi', next ? 'success' : 'warning')
    }
  }

  // ── Block visibility toggle ───────────────────────────────────────────────

  const handleToggleBlock = async (blockId: string, currentVisible: boolean) => {
    const next = !currentVisible
    setTabs(prev => prev.map(t => ({
      ...t,
      blocks: t.blocks.map(b => b.id === blockId ? { ...b, is_visible: next } : b),
    })))
    const { error } = await supabase.from('blocks').update({ is_visible: next }).eq('id', blockId)
    if (error) {
      setTabs(prev => prev.map(t => ({
        ...t,
        blocks: t.blocks.map(b => b.id === blockId ? { ...b, is_visible: currentVisible } : b),
      })))
      showToast('⚠ Xatolik yuz berdi', 'warning')
    } else {
      showToast(next ? '✓ Maydon yoqildi' : '⚠ Maydon yashirildi — mehmonlar ko\'rmaydi', next ? 'success' : 'warning')
    }
  }

  // ── Block edit save ───────────────────────────────────────────────────────

  const handleEditBlock = async (blockId: string, value: string, label: string | null) => {
    const { error } = await supabase.from('blocks').update({ value, label }).eq('id', blockId)
    if (error) { showToast('⚠ Xatolik yuz berdi', 'warning'); return }
    setTabs(prev => prev.map(t => ({
      ...t,
      blocks: t.blocks.map(b => b.id === blockId ? { ...b, value, label } : b),
    })))
    showToast('✓ Saqlandi')
  }

  // ── Block delete ──────────────────────────────────────────────────────────

  const handleDeleteBlock = async (blockId: string) => {
    const { error } = await supabase.from('blocks').delete().eq('id', blockId)
    if (error) { showToast('⚠ Xatolik yuz berdi', 'warning'); return }
    setTabs(prev => prev.map(t => ({
      ...t,
      blocks: t.blocks.filter(b => b.id !== blockId),
    })))
    showToast('✓ O\'chirildi')
  }

  // ── Block add ─────────────────────────────────────────────────────────────

  const handleAddBlock = async (tabSlug: TabSlug, type: BlockType, value: string, label: string) => {
    const maxOrder = tabs.find(t => t.slug === tabSlug)?.blocks.reduce((m, b) => Math.max(m, b.sort_order), 0) ?? 0
    const newBlock = {
      profile_id: profile.id,
      tab_slug: tabSlug,
      type,
      value,
      label: label || null,
      is_visible: true,
      is_active: true,
      sort_order: maxOrder + 1,
    }
    const { data, error } = await supabase.from('blocks').insert(newBlock).select().single()
    if (error) { showToast('⚠ Xatolik yuz berdi', 'warning'); return }
    setTabs(prev => prev.map(t =>
      t.slug === tabSlug ? { ...t, blocks: [...t.blocks, data] } : t
    ))
    showToast('✓ Qo\'shildi')
  }

  // ── Avatar upload ─────────────────────────────────────────────────────────

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarUploading(true)
    // Delete any existing avatar files (extension may vary)
    const { data: existing } = await supabase.storage.from('avatars').list(profile.id)
    if (existing && existing.length > 0) {
      await supabase.storage.from('avatars').remove(existing.map(f => `${profile.id}/${f.name}`))
    }
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${profile.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
    if (upErr) { showToast('⚠ Rasm yuklanmadi', 'warning'); setAvatarUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    const { data, error } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id).select().single()
    setAvatarUploading(false)
    if (error) { showToast('⚠ Xatolik yuz berdi', 'warning'); return }
    setProfile(data)
    setAvatarPreview(publicUrl)
    showToast('✓ Rasm yangilandi')
    e.target.value = ''
  }

  // ── QR toggle ─────────────────────────────────────────────────────────────

  const handleToggleQr = async () => {
    const currentVisible = qrVisibleLocal !== null ? qrVisibleLocal : (qrBlock?.is_visible ?? true)
    const next = !currentVisible
    setQrVisibleLocal(next)
    const blockId = qrBlockIdLocal ?? qrBlock?.id
    if (blockId) {
      const { error } = await supabase.from('blocks').update({ is_visible: next }).eq('id', blockId)
      if (error) { setQrVisibleLocal(currentVisible); showToast('⚠ Xatolik yuz berdi', 'warning') }
      else showToast(next ? '✓ QR yoqildi' : '⚠ QR yashirildi — mehmonlar ko\'rmaydi', next ? 'success' : 'warning')
    } else {
      const { data, error } = await supabase.from('blocks').insert({
        profile_id: profile.id,
        tab_slug: 'ijtimoiy',
        type: 'qr',
        value: 'auto',
        label: 'QR Kod',
        is_visible: next,
        is_active: true,
        sort_order: 99,
      }).select().single()
      if (error) { setQrVisibleLocal(currentVisible); showToast('⚠ Xatolik yuz berdi', 'warning') }
      else { if (data) setQrBlockIdLocal(data.id); showToast(next ? '✓ QR yoqildi' : '⚠ QR yashirildi', next ? 'success' : 'warning') }
    }
  }

  // ── PDF upload ────────────────────────────────────────────────────────────

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
    const contentTypeMap: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    setPdfUploading(true)
    const path = `${profile.id}/cv.${ext}`
    const { error: upErr } = await supabase.storage.from('documents').upload(path, file, { upsert: true, contentType: contentTypeMap[ext] ?? 'application/octet-stream' })
    if (upErr) { showToast('⚠ Fayl yuklanmadi', 'warning'); setPdfUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)
    const allB = tabs.flatMap(t => t.blocks)
    const existing = allB.find(b => b.tab_slug === 'haqida' && b.type === 'pdf')
    const label = file.name
    if (existing) {
      await handleEditBlock(existing.id, publicUrl, label)
    } else {
      await handleAddBlock('haqida', 'pdf', publicUrl, label)
    }
    setPdfFileName(label)
    setPdfUploading(false)
    e.target.value = ''
  }

  const handleDeletePdf = async () => {
    const allB = tabs.flatMap(t => t.blocks)
    const pdfBlock = allB.find(b => b.tab_slug === 'haqida' && b.type === 'pdf')
    if (!pdfBlock) return
    setPdfDeleting(true)
    const marker = '/object/public/documents/'
    const storagePath = pdfBlock.value.includes(marker) ? pdfBlock.value.split(marker)[1] : null
    if (storagePath) await supabase.storage.from('documents').remove([storagePath])
    await handleDeleteBlock(pdfBlock.id)
    setPdfFileName(null)
    setPdfDeleting(false)
    showToast("✓ CV o'chirildi")
  }

  const allBlocks = tabs.flatMap(t => t.blocks)
  const aloqaBlocks    = allBlocks.filter(b => b.tab_slug === 'aloqa')
  const ijtimoiyBlocks = allBlocks.filter(b => b.tab_slug === 'ijtimoiy' && b.type !== 'qr')
  const qrBlock        = allBlocks.find(b => b.tab_slug === 'ijtimoiy' && b.type === 'qr')

  return (
    <>
      <style>{STYLES}</style>

      {/* Orbs */}
      <div style={{ position: 'fixed', top: -70, right: -50, width: 260, height: 260, borderRadius: '50%', background: 'rgba(124,107,255,0.09)', filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat 9s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', bottom: -30, left: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,107,157,0.05)', filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat 11s ease-in-out infinite reverse' }} />

      <main style={{
        background: '#07070f', minHeight: '100vh',
        display: 'flex', justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        position: 'relative', paddingBottom: 100,
      }}>
        <div style={{ width: '100%', maxWidth: 390, position: 'relative', zIndex: 1 }}>

          {/* ── Top bar ── */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: 'rgba(7,7,15,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
          }}>
            <button
              className="btn-back"
              onClick={() => router.push(`/${profile.username}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '8px 12px', borderRadius: 9,
                background: 'rgba(255,255,255,0.05)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                color: 'rgba(240,238,255,0.5)', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
            >
              <IconBack />
              Orqaga
            </button>

            <span style={{ fontSize: 14, fontWeight: 500, color: '#f0eeff', letterSpacing: -0.3 }}>
              Tahrirlash
            </span>

            <button
              className="btn-save"
              onClick={handleSaveProfile}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '8px 14px', borderRadius: 9,
                background: '#5dcaa5', border: 'none',
                color: '#07070f', fontSize: 13, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', opacity: saving ? 0.7 : 1,
                transition: 'background 0.15s',
              }}
            >
              <IconCheck />
              {saving ? '...' : 'Saqlash'}
            </button>
          </div>

          <div style={{ padding: '20px 16px 0' }}>

            {/* ── Avatar section ── */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '0.5px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '20px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
              marginBottom: 12,
              animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
            }}>
              {/* Avatar */}
              <div
                style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
                onClick={() => !avatarUploading && avatarInputRef.current?.click()}
              >
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={profile.full_name ?? profile.username}
                    style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', opacity: avatarUploading ? 0.5 : 1, transition: 'opacity 0.2s' }}
                  />
                ) : (
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c6bff, #a78bfa)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 22, fontWeight: 600,
                    opacity: avatarUploading ? 0.5 : 1, transition: 'opacity 0.2s',
                  }}>
                    {initials}
                  </div>
                )}
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 22, height: 22, borderRadius: '50%',
                  background: avatarUploading ? 'rgba(93,202,165,0.5)' : '#5dcaa5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #07070f',
                  transition: 'background 0.2s',
                }}>
                  {avatarUploading ? (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                  ) : (
                    <IconCamera />
                  )}
                </div>
              </div>

              {/* Name + URL + badge */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#f0eeff', letterSpacing: -0.3, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.full_name ?? profile.username}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(240,238,255,0.3)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  vizitka.me/{profile.username}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 9px', borderRadius: 20,
                  background: 'rgba(93,202,165,0.1)',
                  border: '0.5px solid rgba(93,202,165,0.25)',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5dcaa5', animation: 'greenPulse 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 11, color: '#5dcaa5', fontWeight: 500 }}>Jonli sahifa</span>
                </div>
              </div>
            </div>

            {/* ── Section 1: Shaxsiy ma'lumot ── */}
            <SectionCard title="Shaxsiy ma'lumot">
              {/* First + Last name row */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.3)', marginBottom: 5, fontWeight: 500, letterSpacing: 0.5 }}>Ism</div>
                  <input
                    className="edit-input"
                    style={inputStyle}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Ism"
                    suppressHydrationWarning
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.3)', marginBottom: 5, fontWeight: 500, letterSpacing: 0.5 }}>Familiya</div>
                  <input
                    className="edit-input"
                    style={inputStyle}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Familiya"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Occupation */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.3)', marginBottom: 5, fontWeight: 500, letterSpacing: 0.5 }}>Kasb</div>
                <input className="edit-input" style={inputStyle} value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="Dasturchi, dizayner..." suppressHydrationWarning />
              </div>

              {/* Company */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.3)', marginBottom: 5, fontWeight: 500, letterSpacing: 0.5 }}>Kompaniya</div>
                <input className="edit-input" style={inputStyle} value={company} onChange={e => setCompany(e.target.value)} placeholder="Kompaniya nomi" suppressHydrationWarning />
              </div>

              {/* City */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.3)', marginBottom: 5, fontWeight: 500, letterSpacing: 0.5 }}>Shahar</div>
                <input className="edit-input" style={inputStyle} value={city} onChange={e => setCity(e.target.value)} placeholder="Toshkent, Samarqand..." suppressHydrationWarning />
              </div>

              {/* Bio */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.3)', fontWeight: 500, letterSpacing: 0.5 }}>Bio</div>
                  <div style={{ fontSize: 11, color: bio.length > 140 ? '#f0b429' : 'rgba(240,238,255,0.2)' }}>
                    {bio.length}/160
                  </div>
                </div>
                <textarea
                  className="edit-textarea"
                  style={{ ...inputStyle, minHeight: 80, resize: 'none' as const, lineHeight: 1.6 }}
                  value={bio}
                  onChange={e => { if (e.target.value.length <= 160) setBio(e.target.value) }}
                  placeholder="O'zingiz haqida qisqacha..."
                  suppressHydrationWarning
                />
              </div>

              {/* CV / PDF upload */}
              {(() => {
                const pdfBlock = tabs.flatMap(t => t.blocks).find(b => b.tab_slug === 'haqida' && b.type === 'pdf')
                return (
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.3)', marginBottom: 8, fontWeight: 500, letterSpacing: 0.5 }}>CV / Rezyume</div>
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={handlePdfUpload}
                    />
                    {pdfBlock ? (
                      <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)',
                        borderRadius: 10, padding: '11px 13px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
                            <path d="M3 8l4 4 6-7" stroke="#5dcaa5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontSize: 13, color: 'rgba(240,238,255,0.6)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {pdfFileName ?? pdfBlock.label ?? 'cv.pdf'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="upload-btn"
                            onClick={() => !pdfUploading && pdfInputRef.current?.click()}
                            disabled={pdfUploading || pdfDeleting}
                            style={{
                              flex: 1, padding: '8px 0', borderRadius: 8,
                              background: 'rgba(124,107,255,0.06)',
                              border: '0.5px solid rgba(124,107,255,0.2)',
                              color: pdfUploading ? 'rgba(124,107,255,0.4)' : 'rgba(124,107,255,0.7)',
                              fontSize: 12, fontWeight: 500, cursor: pdfUploading ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit', transition: 'all 0.15s',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                            }}
                          >
                            {pdfUploading ? (
                              <>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid rgba(124,107,255,0.3)', borderTopColor: '#a78bfa', animation: 'spin 0.7s linear infinite' }} />
                                Yuklanmoqda...
                              </>
                            ) : 'Almashtirish'}
                          </button>
                          <button
                            onClick={handleDeletePdf}
                            disabled={pdfDeleting || pdfUploading}
                            style={{
                              flex: 1, padding: '8px 0', borderRadius: 8,
                              background: 'rgba(255,80,80,0.06)',
                              border: '0.5px solid rgba(255,80,80,0.15)',
                              color: pdfDeleting ? 'rgba(255,128,128,0.4)' : 'rgba(255,128,128,0.7)',
                              fontSize: 12, fontWeight: 500, cursor: pdfDeleting ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit', transition: 'all 0.15s',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                            }}
                          >
                            {pdfDeleting ? (
                              <>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid rgba(255,128,128,0.3)', borderTopColor: '#ff8080', animation: 'spin 0.7s linear infinite' }} />
                                O&apos;chirilmoqda...
                              </>
                            ) : "O'chirish"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          className="upload-btn"
                          onClick={() => !pdfUploading && pdfInputRef.current?.click()}
                          disabled={pdfUploading}
                          style={{
                            width: '100%', padding: '10px 0', borderRadius: 9,
                            background: 'rgba(124,107,255,0.06)',
                            border: '0.5px dashed rgba(124,107,255,0.25)',
                            color: pdfUploading ? 'rgba(124,107,255,0.4)' : 'rgba(124,107,255,0.7)',
                            fontSize: 13, fontWeight: 500,
                            cursor: pdfUploading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', transition: 'all 0.15s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}
                        >
                          {pdfUploading ? (
                            <>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid rgba(124,107,255,0.3)', borderTopColor: '#a78bfa', animation: 'spin 0.7s linear infinite' }} />
                              Yuklanmoqda...
                            </>
                          ) : (
                            <>
                              <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
                                <path d="M8 11V3M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 13h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                              </svg>
                              + CV yuklash (.pdf, .doc, .docx)
                            </>
                          )}
                        </button>
                        <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(240,238,255,0.2)', textAlign: 'center' }}>
                          Qo&apos;llab-quvvatlanadigan formatlar: PDF, DOC, DOCX (max 5MB)
                        </div>
                      </>
                    )}
                  </div>
                )
              })()}
            </SectionCard>

            {/* ── Section 2: Bo'limlar (tabs) ── */}
            <SectionCard title="Bo'limlar">
              {tabs.map(tab => (
                <div key={tab.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 0',
                  borderBottom: '0.5px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ color: 'rgba(240,238,255,0.2)', flexShrink: 0 }}>
                    <IconGrip />
                  </span>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: tab.is_visible ? '#5dcaa5' : 'rgba(255,255,255,0.15)',
                    transition: 'background 0.2s',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: '#f0eeff', fontWeight: 500 }}>{tab.label}</div>
                    <div style={{ fontSize: 11, color: tab.is_visible ? 'rgba(93,202,165,0.7)' : 'rgba(240,238,255,0.2)', marginTop: 1 }}>
                      {tab.is_visible ? 'ko\'rinadi' : 'yashirilgan'}
                    </div>
                  </div>
                  <Toggle
                    on={tab.is_visible}
                    onChange={() => handleToggleTab(tab.id, tab.is_visible)}
                  />
                </div>
              ))}
            </SectionCard>

            {/* ── Section 3a: Aloqa ── */}
            <BlocksSection
              title="Aloqa maydonlari"
              blocks={aloqaBlocks}
              tabSlug="aloqa"
              onToggleVisible={handleToggleBlock}
              onEditSave={handleEditBlock}
              onDelete={handleDeleteBlock}
              onAdd={(type, value, label) => handleAddBlock('aloqa', type, value, label)}
            />

            {/* ── Section 3b: Ijtimoiy ── */}
            <BlocksSection
              title="Ijtimoiy tarmoqlar"
              blocks={ijtimoiyBlocks}
              tabSlug="ijtimoiy"
              onToggleVisible={handleToggleBlock}
              onEditSave={handleEditBlock}
              onDelete={handleDeleteBlock}
              onAdd={(type, value, label) => handleAddBlock('ijtimoiy', type, value, label)}
            />

            {/* ── QR Kod toggle ── */}
            {(() => {
              const qrOn = qrVisibleLocal !== null ? qrVisibleLocal : (qrBlock?.is_visible ?? true)
              return (
                <SectionCard title="QR Kod">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, color: '#f0eeff', fontWeight: 500 }}>QR Kod</div>
                      <div style={{ fontSize: 11, color: qrOn ? 'rgba(93,202,165,0.7)' : 'rgba(240,238,255,0.2)', marginTop: 1 }}>
                        {qrOn ? 'Mehmonlarga ko\'rinadi' : 'Yashirilgan'}
                      </div>
                    </div>
                    <Toggle on={qrOn} onChange={handleToggleQr} />
                  </div>
                </SectionCard>
              )
            })()}


          </div>
        </div>

        <Toast text={toast.text} visible={toast.visible} variant={toast.variant} />
      </main>

      {/* ── Bottom bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(7,7,15,0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'center',
        padding: '12px 16px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 390, display: 'flex', gap: 10 }}>
          <button
            className="btn-back"
            onClick={() => router.push(`/${profile.username}`)}
            style={{
              flex: 1, padding: '13px 0',
              borderRadius: 11, background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              color: 'rgba(240,238,255,0.5)', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background 0.15s',
            }}
          >
            <IconBack />
            Orqaga
          </button>
          <button
            className="btn-save"
            onClick={handleSaveProfile}
            disabled={saving}
            style={{
              flex: 2, padding: '13px 0',
              borderRadius: 11, background: '#5dcaa5',
              border: 'none', color: '#07070f',
              fontSize: 14, fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: saving ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background 0.15s',
            }}
          >
            <IconCheck />
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>
    </>
  )
}
