import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  console.log('DASHBOARD USER:', user?.id, user?.email)

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  console.log('DASHBOARD PROFILE:', profile)

  if (profile?.username) {
    redirect(`/${profile.username}`)
  }

  redirect('/auth/login')
}
