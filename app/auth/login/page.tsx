'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tgMsg, setTgMsg] = useState(false)
  const router = useRouter()

  const detect = id.includes('@') ? 'email' : id.length > 0 ? 'username' : null

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const submit = async () => {
    if (!id || pw.length < 4) {
      setError('Username va parolni kiriting')
      triggerShake()
      return
    }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      let email = id

      if (!id.includes('@')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', id.toLowerCase())
          .single()
        if (!profile?.email) {
          setError('Bunday foydalanuvchi topilmadi')
          triggerShake()
          return
        }
        email = profile.email as string
      }

      const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pw })
      if (authError) {
        setError("Email yoki parol noto'g'ri")
        triggerShake()
        return
      }
      window.location.href =('/sardor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      background: '#07070f',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(16px,-12px) scale(1.04); }
          66% { transform: translate(-10px,16px) scale(0.97); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          20%     { transform:translateX(-6px); }
          40%     { transform:translateX(6px); }
          60%     { transform:translateX(-4px); }
          80%     { transform:translateX(4px); }
        }
        .orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(70px);
          z-index: 0;
          animation: orbFloat 9s ease-in-out infinite;
        }
        .inp {
          width: 100%;
          padding: 13px 14px;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          font-size: 15px;
          color: #f0eeff;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        .inp:focus {
          border-color: rgba(124,107,255,0.5);
          background: rgba(124,107,255,0.05);
        }
        .inp::placeholder { color: rgba(240,238,255,0.18); }
        .inp-shake { animation: shake 0.35s ease both; }
        .btn-main {
          width: 100%;
          padding: 15px;
          background: #7c6bff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .btn-main:hover {
          background: #6a59ff;
          box-shadow: 0 8px 24px rgba(124,107,255,0.25);
        }
        .btn-main:active { transform: scale(0.98); }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-tg {
          width: 100%;
          padding: 13px;
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          font-size: 14px;
          color: rgba(240,238,255,0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-family: inherit;
          transition: all 0.2s;
        }
        .btn-tg:hover {
          border-color: rgba(34,158,217,0.35);
          color: rgba(240,238,255,0.8);
          background: rgba(34,158,217,0.05);
        }
      `}</style>

      {/* Orbs */}
      <div className="orb" style={{width:280,height:280,background:'rgba(124,107,255,0.10)',top:-80,right:-60}} />
      <div className="orb" style={{width:200,height:200,background:'rgba(255,107,157,0.06)',bottom:-40,left:-40,animationDirection:'reverse',animationDuration:'11s'}} />
      <div className="orb" style={{width:120,height:120,background:'rgba(93,202,165,0.05)',top:'50%',left:20,animationDuration:'7s'}} />

      {/* Karta */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: '32px 24px 28px',
        width: '100%',
        maxWidth: 390,
        position: 'relative',
        zIndex: 1,
        animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
      }}>

        {/* Brand */}
        <div style={{fontSize:20,fontWeight:500,color:'#f0eeff',letterSpacing:-0.5,marginBottom:24}}>
          vizitka<span style={{color:'#7c6bff'}}>.me</span>
        </div>

        {/* Sarlavha */}
        <div style={{fontSize:22,fontWeight:500,color:'#f0eeff',letterSpacing:-0.5,marginBottom:6}}>
          Xush kelibsiz
        </div>
        <div style={{fontSize:13,color:'rgba(240,238,255,0.35)',marginBottom:28}}>
          Hisobingizga kiring
        </div>

        {/* Username / Email */}
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
          <span style={{fontSize:11,fontWeight:500,color:'rgba(240,238,255,0.3)',letterSpacing:1.2,textTransform:'uppercase'}}>
            Username yoki Email
          </span>
          <span style={{fontSize:11,color: detect==='email' ? '#7c6bff' : detect==='username' ? '#f0b429' : 'rgba(240,238,255,0.2)'}}>
            {detect==='email' ? 'email aniqlandi' : detect==='username' ? 'username aniqlandi' : 'avtomatik aniqlanadi'}
          </span>
        </div>
        <input
          className={`inp${shake && !pw ? ' inp-shake' : ''}`}
          value={id}
          onChange={e => { setId(e.target.value); setError('') }}
          placeholder="sardor  yoki  sardor@mail.com"
          suppressHydrationWarning={true}
          autoCorrect="off"
          style={{marginBottom:12}}
        />

        {/* Parol */}
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
          <span style={{fontSize:11,fontWeight:500,color:'rgba(240,238,255,0.3)',letterSpacing:1.2,textTransform:'uppercase'}}>
            Parol
          </span>
          <span style={{fontSize:11,color:'rgba(240,238,255,0.2)'}}>
            {loading ? 'tekshirilmoqda...' : ''}
          </span>
        </div>
        <div style={{position:'relative',marginBottom:6}}>
          <input
            className={`inp${shake ? ' inp-shake' : ''}`}
            type={showPw ? 'text' : 'password'}
            value={pw}
            onChange={e => { setPw(e.target.value); setError('') }}
            placeholder="••••••••"
            style={{paddingRight:60}}
            onKeyDown={e => e.key==='Enter' && submit()}
            suppressHydrationWarning={true}
          />
          <button
            onClick={() => setShowPw(!showPw)}
            style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(240,238,255,0.3)',cursor:'pointer',fontSize:12,fontFamily:'inherit'}}
          >
            {showPw ? 'Yashir' : "Ko'rish"}
          </button>
        </div>

        {/* Xato */}
        {error && (
          <div style={{
            background:'rgba(255,107,107,0.08)',
            border:'0.5px solid rgba(255,107,107,0.2)',
            borderRadius:10,
            padding:'10px 13px',
            fontSize:13,
            color:'#ff9090',
            marginBottom:12,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Parolni unutdim */}
        <div style={{textAlign:'right',marginBottom:20}}>
          <Link href="/auth/forgot" style={{fontSize:12,color:'rgba(124,107,255,0.5)',textDecoration:'none'}}>
            Parolni unutdim?
          </Link>
        </div>

        {/* Kirish tugmasi */}
        <button className="btn-main" onClick={submit} disabled={loading}>
          {loading ? 'Kirish...' : 'Kirish →'}
        </button>

        {/* Divider */}
        <div style={{display:'flex',alignItems:'center',gap:10,margin:'16px 0'}}>
          <div style={{flex:1,height:'0.5px',background:'rgba(255,255,255,0.06)'}} />
          <span style={{fontSize:11,color:'rgba(240,238,255,0.2)'}}>yoki</span>
          <div style={{flex:1,height:'0.5px',background:'rgba(255,255,255,0.06)'}} />
        </div>

        {/* Telegram */}
        <button className="btn-tg" onClick={() => setTgMsg(true)}>
          <div style={{width:20,height:20,background:'#229ED9',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.483c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.875.738z"/>
            </svg>
          </div>
          Telegram orqali kirish
        </button>

        {tgMsg && (
          <div style={{
            background:'rgba(34,158,217,0.08)',
            border:'0.5px solid rgba(34,158,217,0.2)',
            borderRadius:10,
            padding:'10px 13px',
            fontSize:13,
            color:'rgba(34,158,217,0.7)',
            marginTop:10,
            textAlign:'center',
          }}>
            Tez orada...
          </div>
        )}

        {/* Ro'yxat */}
        <div style={{textAlign:'center',marginTop:20,fontSize:13,color:'rgba(240,238,255,0.25)'}}>
          Hisobingiz yo&apos;qmi?{' '}
          <Link href="/auth/register" style={{color:'#7c6bff',textDecoration:'none',fontWeight:500}}>
            Ro&apos;yxatdan o&apos;ting
          </Link>
        </div>

        {/* Trust */}
        <div style={{display:'flex',justifyContent:'center',gap:18,marginTop:20}}>
          {['Bepul','Xavfsiz','1 daqiqada'].map((t,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'rgba(240,238,255,0.2)'}}>
              <div style={{width:3,height:3,borderRadius:'50%',background:'#7c6bff'}} />
              {t}
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
