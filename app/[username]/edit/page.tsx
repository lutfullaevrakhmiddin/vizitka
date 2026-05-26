import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfileWithTabs } from '@/lib/supabase/queries'
import EditClient from './EditClient'

export default async function EditPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${username}`)

  const data = await getProfileWithTabs(username)
  if (!data) redirect('/')

  if (user.id !== data.id) redirect(`/${username}`)

  const { tabs, ...profile } = data
  return <EditClient profile={profile} tabs={tabs} />
}
