// ─── Block types ──────────────────────────────────────────────────────────────

export type BlockType =
  | 'phone'
  | 'email'
  | 'card'
  | 'click'
  | 'payme'
  | 'telegram'
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'tiktok'
  | 'website'
  | 'pdf'
  | 'service'
  | 'qr'

// ─── Tab slugs ────────────────────────────────────────────────────────────────

export type TabSlug = 'haqida' | 'aloqa' | 'ijtimoiy' | 'qoshimcha'

// ─── Database row types ───────────────────────────────────────────────────────

export interface Profile {
  id: string            // uuid, PK → auth.users
  username: string      // unique, immutable (free) / changeable (premium)
  full_name: string | null
  bio: string | null    // max 160 chars
  occupation: string | null
  company: string | null
  city: string | null
  avatar_url: string | null
  created_at: string    // ISO 8601
  updated_at: string    // ISO 8601
}

export interface Tab {
  id: string
  profile_id: string    // FK → profiles.id
  slug: TabSlug
  label: string
  is_active: boolean
  is_visible: boolean
  sort_order: number
}

export interface Block {
  id: string
  profile_id: string    // FK → profiles.id
  tab_slug: TabSlug
  type: BlockType
  value: string         // card type: NEVER render raw — show last 4 digits only
  label: string | null
  is_visible: boolean
  is_active: boolean
  sort_order: number
}

// ─── Composite types ──────────────────────────────────────────────────────────

export interface TabWithBlocks extends Tab {
  blocks: Block[]
}

export interface ProfileWithTabs extends Profile {
  tabs: TabWithBlocks[]
}

// ─── View modes ───────────────────────────────────────────────────────────────

export type ViewMode = 'visitor' | 'owner'

// ─── Form / mutation types ────────────────────────────────────────────────────

export type ProfileUpdate = Partial<
  Pick<Profile, 'full_name' | 'bio' | 'occupation' | 'company' | 'city' | 'avatar_url'>
>

export type BlockUpdate = Partial<
  Pick<Block, 'value' | 'label' | 'is_visible' | 'is_active' | 'sort_order'>
>

export type TabUpdate = Partial<
  Pick<Tab, 'label' | 'is_active' | 'is_visible' | 'sort_order'>
>
