import { createClient } from '@/lib/supabase/server'
import type {
  Profile,
  Block,
  ProfileWithTabs,
  TabWithBlocks,
  ProfileUpdate,
  BlockUpdate,
} from '@/types'

export async function getProfile(username: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
  return data
}

export async function getProfileWithTabs(username: string): Promise<ProfileWithTabs | null> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) return null

  const [{ data: tabs }, { data: blocks }] = await Promise.all([
    supabase
      .from('tabs')
      .select('*')
      .eq('profile_id', profile.id)
      .order('sort_order'),
    supabase
      .from('blocks')
      .select('*')
      .eq('profile_id', profile.id)
      .order('sort_order'),
  ])

  const tabsWithBlocks: TabWithBlocks[] = (tabs ?? []).map(tab => ({
    ...tab,
    blocks: (blocks ?? []).filter(b => b.tab_slug === tab.slug),
  }))

  return { ...profile, tabs: tabsWithBlocks }
}

export async function updateProfile(id: string, data: ProfileUpdate): Promise<Profile> {
  const supabase = await createClient()
  const { data: updated, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return updated
}

export async function getBlocks(profileId: string): Promise<Block[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blocks')
    .select('*')
    .eq('profile_id', profileId)
    .order('sort_order')
  return data ?? []
}

export async function updateBlock(id: string, data: BlockUpdate): Promise<Block> {
  const supabase = await createClient()
  const { data: updated, error } = await supabase
    .from('blocks')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return updated
}

export async function createBlock(data: Omit<Block, 'id'>): Promise<Block> {
  const supabase = await createClient()
  const { data: created, error } = await supabase
    .from('blocks')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return created
}

export async function deleteBlock(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// TEMP DEBUG
export async function debugProfile(username: string) {
  const client = await createClient()
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
  console.log('DEBUG profile:', JSON.stringify({ data, error }))
  return { data, error }
}
