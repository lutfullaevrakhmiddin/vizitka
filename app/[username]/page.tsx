import { createClient } from '@/lib/supabase/server'
import { getProfileWithTabs } from '@/lib/supabase/queries'
import ProfileClient from './ProfileClient'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = await getProfileWithTabs(username)

  if (!data) {
    return (
      <main style={{
        background: '#07070f', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ textAlign: 'center', padding: '24px 16px' }}>
          <div style={{ fontSize: 48, fontWeight: 300, color: 'rgba(240,238,255,0.1)', marginBottom: 20, letterSpacing: -2 }}>
            404
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#f0eeff', marginBottom: 8, letterSpacing: -0.4 }}>
            Bu vizitka mavjud emas
          </div>
          <div style={{ fontSize: 13, color: 'rgba(240,238,255,0.3)', marginBottom: 28 }}>
            @{username} topilmadi
          </div>
          <a
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 12,
              background: 'rgba(124,107,255,0.1)',
              border: '0.5px solid rgba(124,107,255,0.3)',
              color: '#a78bfa', fontSize: 13, fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Bosh sahifaga qaytish
          </a>
        </div>
      </main>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === data.id

  const { tabs, ...profile } = data
  return <ProfileClient profile={profile} tabs={tabs} isOwner={isOwner} />
}
