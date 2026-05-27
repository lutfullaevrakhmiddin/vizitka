'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Step = 'method' | 'verify' | 'identity' | 'success'
type Method = 'telegram' | 'email'

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<Method | null>(null)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [verifyError, setVerifyError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [timer, setTimer] = useState(60)
  const [username, setUsername] = useState('')
  const [uStatus, setUStatus] = useState<'idle' | 'checking' | 'ok' | 'taken' | 'invalid'>('idle')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwScore, setPwScore] = useState(0)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [finalUser, setFinalUser] = useState('')
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (step !== 'verify') return
    setTimer(60)
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
    const t = setInterval(() => setTimer(s => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [step])

  useEffect(() => {
    if (!username) { setUStatus('idle'); return }
    if (username.length < 3 || !/^[a-z0-9_]+$/i.test(username)) { setUStatus('invalid'); return }
    setUStatus('checking')
    const t = setTimeout(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle()
      setUStatus(data ? 'taken' : 'ok')
    }, 700)
    return () => clearTimeout(t)
  }, [username])

  useEffect(() => {
    if (!password) { setPwScore(0); return }
    if (password.length < 8) { setPwScore(1); return }
    if (!/[0-9]/.test(password)) { setPwScore(2); return }
    setPwScore(3)
  }, [password])

  const sendOtp = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("To'g'ri email kiriting")
      return
    }
    setSendingOtp(true)
    setEmailError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    setSendingOtp(false)
    if (error) { setEmailError(error.message); return }
    setOtp(['', '', '', '', '', ''])
    setStep('verify')
  }

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = digit
    setOtp(next)
    setVerifyError('')
    if (digit && i < 5) otpRefs.current[i + 1]?.focus()
  }

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[i]) {
        const next = [...otp]; next[i] = ''; setOtp(next)
      } else if (i > 0) {
        const next = [...otp]; next[i - 1] = ''; setOtp(next)
        otpRefs.current[i - 1]?.focus()
      }
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      otpRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  const verifyOtp = async () => {
    const code = otp.join('')
    if (code.length !== 6) return
    setVerifying(true)
    setVerifyError('')
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
    setVerifying(false)
    if (error) { setVerifyError("Kod noto'g'ri yoki muddati o'tgan"); return }
    setStep('identity')
  }

  const resendOtp = async () => {
    setOtp(['', '', '', '', '', ''])
    setVerifyError('')
    const supabase = createClient()
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    setTimer(60)
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
  }

  const createAccount = async () => {
    if (uStatus !== 'ok' || password.length < 8) return
    setCreating(true)
    setCreateError('')
    const supabase = createClient()

    const { error: pwErr } = await supabase.auth.updateUser({ password })
    if (pwErr) { setCreateError(pwErr.message); setCreating(false); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCreateError('Foydalanuvchi topilmadi'); setCreating(false); return }

    const { error: profileErr } = await supabase.from('profiles').insert({
      id: user.id,
      username: username.toLowerCase(),
      full_name: username,
    })
    if (profileErr) {
      setCreateError(profileErr.code === '23505' ? 'Bu username band' : profileErr.message)
      setCreating(false)
      return
    }

    await supabase.from('tabs').insert([
      { profile_id: user.id, slug: 'haqida',   label: 'Haqida',   is_active: true, is_visible: true, sort_order: 1 },
      { profile_id: user.id, slug: 'aloqa',    label: 'Aloqa',    is_active: true, is_visible: true, sort_order: 2 },
      { profile_id: user.id, slug: 'ijtimoiy', label: 'Ijtimoiy', is_active: true, is_visible: true, sort_order: 3 },
    ])

    setFinalUser(username.toLowerCase())
    setStep('success')
    setCreating(false)
  }

  const canCreate = uStatus === 'ok' && pwScore >= 2
  const pwColors = ['rgba(240,238,255,.2)', '#ff8080', '#f0b429', '#5dcaa5']
  const pwLabels = ['kamida 8 belgi', 'juda qisqa', 'yaxshi', 'kuchli']
  const uHintColor = uStatus === 'ok' ? '#5dcaa5' : (uStatus === 'taken' || uStatus === 'invalid') ? '#ff8080' : 'rgba(240,238,255,.2)'
  const uHintText: Record<string, string> = {
    idle: 'ehtiyotkorlik bilan tanlang',
    checking: 'tekshirilmoqda...',
    ok: '✓ Mavjud',
    taken: '✗ Band',
    invalid: 'harf/raqam/_ faqat',
  }

  const spinner = (
    <span style={{ width: 14, height: 14, border: '1.5px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block', verticalAlign: 'middle' }} />
  )

  return (
    <main style={{ background: '#07070f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'system-ui,sans-serif', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(16px,-12px) scale(1.04)}66%{transform:translate(-10px,16px) scale(.97)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ringPulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.2);opacity:0}}
        @keyframes checkPop{0%{transform:scale(0) rotate(-15deg);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .orb{position:fixed;border-radius:50%;pointer-events:none;filter:blur(70px);z-index:0;animation:orbFloat 9s ease-in-out infinite}
        .inp{width:100%;padding:13px 14px;background:rgba(255,255,255,.04);border:.5px solid rgba(255,255,255,.08);border-radius:12px;font-size:15px;color:#f0eeff;font-family:inherit;outline:none;transition:border-color .2s,background .2s;-webkit-appearance:none;box-sizing:border-box}
        .inp:focus{border-color:rgba(124,107,255,.5);background:rgba(124,107,255,.06)}
        .inp::placeholder{color:rgba(240,238,255,.18)}
        .btn{width:100%;padding:15px;background:#7c6bff;border:none;border-radius:12px;font-size:15px;font-weight:500;color:#fff;cursor:pointer;font-family:inherit;transition:background .2s,transform .1s,box-shadow .2s;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn:hover{background:#6a59ff;box-shadow:0 8px 24px rgba(124,107,255,.25)}
        .btn:active{transform:scale(.98)}
        .btn:disabled{opacity:.4;cursor:not-allowed}
        .method-card{border:.5px solid rgba(255,255,255,.07);border-radius:14px;padding:15px 13px;display:flex;align-items:center;gap:12px;margin-bottom:10px;cursor:pointer;background:rgba(255,255,255,.02);transition:all .2s}
        .method-card:hover{border-color:rgba(124,107,255,.35);background:rgba(124,107,255,.05);transform:translateX(2px)}
        .method-selected{border-color:rgba(124,107,255,.3)!important;background:rgba(124,107,255,.04)!important}
        .otp-box{flex:1;height:54px;background:rgba(255,255,255,.04);border:.5px solid rgba(255,255,255,.08);border-radius:11px;text-align:center;font-size:22px;font-weight:500;color:#f0eeff;outline:none;-webkit-appearance:none;font-family:monospace;transition:all .18s;caret-color:transparent;padding:0}
        .otp-box:focus{border-color:rgba(124,107,255,.5);background:rgba(124,107,255,.06)}
        .otp-filled{border-color:rgba(124,107,255,.35)!important;background:rgba(124,107,255,.08)!important;color:#c4b8ff!important}
        .back-btn{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:rgba(240,238,255,.3);cursor:pointer;background:none;border:none;font-family:inherit;padding:0;margin-bottom:18px;transition:color .2s}
        .back-btn:hover{color:rgba(240,238,255,.6)}
        .ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(93,202,165,.3);animation:ringPulse 1.8s ease-out infinite}
        .pw-bar{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.07);transition:background .3s}
        .err-msg{font-size:12px;color:#ff8080;margin-top:6px}
      `}</style>

      <div className="orb" style={{ width: 260, height: 260, background: 'rgba(124,107,255,.09)', top: -70, right: -50 }} />
      <div className="orb" style={{ width: 180, height: 180, background: 'rgba(255,107,157,.05)', bottom: -30, left: -30, animationDirection: 'reverse', animationDuration: '11s' }} />

      <div style={{ background: 'rgba(255,255,255,.03)', border: '.5px solid rgba(255,255,255,.08)', borderRadius: 24, padding: '28px 22px 24px', width: '100%', maxWidth: 390, position: 'relative', zIndex: 1, animation: 'fadeUp .5s cubic-bezier(.16,1,.3,1) both' }}>

        <div style={{ fontSize: 19, fontWeight: 500, color: '#f0eeff', letterSpacing: -.4, marginBottom: 18 }}>
          vizitka<span style={{ color: '#7c6bff' }}>.me</span>
        </div>

        {step !== 'success' && (
          <>
            <div style={{ height: 2, background: 'rgba(255,255,255,.07)', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#7c6bff,#a78bfa)', width: step === 'method' ? '33%' : step === 'verify' ? '66%' : '100%', transition: 'width .5s cubic-bezier(.16,1,.3,1)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
              {[['method', '01 · Usul'], ['verify', '02 · Tasdiqlash'], ['identity', '03 · Shaxs']].map(([s, label]) => (
                <span key={s} style={{ fontSize: 10, letterSpacing: .8, textTransform: 'uppercase', color: step === s ? '#a78bfa' : (step === 'verify' && s === 'method') || (step === 'identity' && s !== 'identity') ? 'rgba(167,139,250,.4)' : 'rgba(240,238,255,.2)' }}>
                  {label}
                </span>
              ))}
            </div>
          </>
        )}

        {/* ─── 1-qadam: Usul ─── */}
        {step === 'method' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(124,107,255,.07)', border: '.5px solid rgba(124,107,255,.15)', borderRadius: 8, padding: '8px 11px', marginBottom: 18, fontSize: 11, color: 'rgba(167,139,250,.7)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l4 1.5v3c0 2.5-1.7 4.5-4 5.5-2.3-1-4-3-4-5.5v-3L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Ma&apos;lumotlaringiz himoyalangan · End-to-end shifrlangan
            </div>
            <div style={{ fontSize: 11, color: 'rgba(240,238,255,.25)', letterSpacing: .8, textTransform: 'uppercase', marginBottom: 8 }}>1-qadam / 3</div>
            <div style={{ fontSize: 21, fontWeight: 500, color: '#f0eeff', letterSpacing: -.4, marginBottom: 6 }}>Qanday <span style={{ color: '#7c6bff' }}>boshlaymiz?</span></div>
            <div style={{ fontSize: 13, color: 'rgba(240,238,255,.3)', lineHeight: 1.6, marginBottom: 22 }}>Tasdiqlash usulini tanlang. Bu faqat bir marta kerak.</div>

            <div className={`method-card${method === 'telegram' ? ' method-selected' : ''}`} onClick={() => setMethod('telegram')}>
              <div style={{ width: 40, height: 40, borderRadius: 11, border: '.5px solid rgba(34,158,217,.2)', background: 'rgba(34,158,217,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 240 240" fill="none">
                  <defs><linearGradient id="tg1" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#2AABEE"/><stop offset="100%" stopColor="#229ED9"/></linearGradient></defs>
                  <circle cx="120" cy="120" r="120" fill="url(#tg1)"/>
                  <path d="M54 117.5l34.3 12.8 13.3 42.8c.9 2.8 4.3 3.8 6.6 1.9l19.1-15.6a9.4 9.4 0 0111.4-.3l34.4 25c2.6 1.9 6.3.5 7-2.6l25-117.7c.8-3.6-2.9-6.6-6.3-5.2L54 111.4c-3.8 1.5-3.7 6.9.0 6.1z" fill="white"/>
                  <path d="M100 166l-2.6-27.5 71.4-64.4c3.1-2.8-.7-4.3-4.8-1.6L77 138.4" fill="#C8DAEA"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(124,107,255,.6)', letterSpacing: .5, textTransform: 'uppercase', marginBottom: 2 }}>Tavsiya · 1 bosish</div>
                <div style={{ fontSize: 14, color: '#f0eeff', fontWeight: 500 }}>Telegram orqali</div>
                <div style={{ fontSize: 12, color: 'rgba(240,238,255,.3)', marginTop: 2 }}>@vizitka_official_bot</div>
              </div>
              <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="rgba(240,238,255,.2)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>

            {method === 'telegram' && (
              <div style={{ padding: '10px 13px', background: 'rgba(34,158,217,.06)', border: '.5px solid rgba(34,158,217,.18)', borderRadius: 10, marginTop: -4, marginBottom: 10, fontSize: 13, color: 'rgba(34,158,217,.7)', textAlign: 'center' }}>
                Tez orada...
              </div>
            )}

            <div className={`method-card${method === 'email' ? ' method-selected' : ''}`} onClick={() => setMethod('email')}>
              <div style={{ width: 40, height: 40, borderRadius: 11, border: '.5px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
                  <path d="M0 5.457v13.909c0 .904.732 1.636 1.636 1.636h3.819V11.73L12 16.64V9.548L5.455 4.64 3.927 3.493C2.309 2.28 0 3.434 0 5.457z" fill="#34A853"/>
                  <path d="M18.545 11.73v9.273h3.819A1.636 1.636 0 0024 19.366V5.457c0-2.023-2.309-3.178-3.927-1.964L18.545 4.64v7.09z" fill="#4285F4"/>
                  <path d="M0 5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457L12 16.64 0 5.457z" fill="#FBBC05"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(240,180,41,.6)', letterSpacing: .5, textTransform: 'uppercase', marginBottom: 2 }}>Klassik · 6 xonali kod</div>
                <div style={{ fontSize: 14, color: '#f0eeff', fontWeight: 500 }}>Email orqali</div>
                <div style={{ fontSize: 12, color: 'rgba(240,238,255,.3)', marginTop: 2 }}>ism@gmail.com</div>
              </div>
              <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="rgba(240,238,255,.2)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>

            {method === 'email' && (
              <div style={{ marginTop: -4 }}>
                <input
                  className="inp"
                  type="email"
                  placeholder="ism@gmail.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  onKeyDown={e => e.key === 'Enter' && sendOtp()}
                  autoFocus
                  suppressHydrationWarning
                />
                {emailError && <div className="err-msg">{emailError}</div>}
                <div style={{ marginBottom: 10 }} />
                <button className="btn" disabled={sendingOtp || !email} onClick={sendOtp}>
                  {sendingOtp ? <>{spinner} Yuborilmoqda...</> : 'Kod yuborish →'}
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'rgba(240,238,255,.2)' }}>
              Hisobingiz bormi?{' '}
              <Link href="/auth/login" style={{ color: '#7c6bff', textDecoration: 'none' }}>Kirish</Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
              {['Bepul', 'Xavfsiz', '1 daqiqada'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(240,238,255,.18)' }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#7c6bff' }} />{t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── 2-qadam: OTP ─── */}
        {step === 'verify' && (
          <div>
            <button className="back-btn" onClick={() => { setOtp(['', '', '', '', '', '']); setVerifyError(''); setStep('method') }}>← Orqaga</button>
            <div style={{ fontSize: 11, color: 'rgba(240,238,255,.25)', letterSpacing: .8, textTransform: 'uppercase', marginBottom: 8 }}>2-qadam / 3 · Email</div>
            <div style={{ fontSize: 21, fontWeight: 500, color: '#f0eeff', letterSpacing: -.4, marginBottom: 6 }}><span style={{ color: '#7c6bff' }}>6 xonali</span> kodni kiriting</div>
            <div style={{ fontSize: 13, color: 'rgba(240,238,255,.3)', lineHeight: 1.6, marginBottom: 20 }}>
              <span style={{ color: '#a78bfa', fontFamily: 'monospace' }}>{email}</span>ga kod yuborildi
            </div>
            <div style={{ display: 'flex', gap: 7, marginBottom: 8 }}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el }}
                  className={`otp-box${d ? ' otp-filled' : ''}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                  suppressHydrationWarning
                />
              ))}
            </div>
            {verifyError && <div className="err-msg" style={{ textAlign: 'center', marginBottom: 6 }}>{verifyError}</div>}
            <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(240,238,255,.25)', marginBottom: 18 }}>
              {timer > 0
                ? <>Qayta yuborish: <span style={{ color: 'rgba(124,107,255,.5)' }}>00:{String(timer).padStart(2, '0')}</span></>
                : <span style={{ color: '#7c6bff', cursor: 'pointer' }} onClick={resendOtp}>Qayta yuborish →</span>
              }
            </div>
            <button className="btn" disabled={otp.some(d => !d) || verifying} onClick={verifyOtp}>
              {verifying ? <>{spinner} Tekshirilmoqda...</> : 'Tasdiqlash →'}
            </button>
          </div>
        )}

        {/* ─── 3-qadam: Identity ─── */}
        {step === 'identity' && (
          <div>
            <button className="back-btn" onClick={() => { setOtp(['', '', '', '', '', '']); setStep('verify') }}>← Orqaga</button>
            <div style={{ fontSize: 11, color: 'rgba(240,238,255,.25)', letterSpacing: .8, textTransform: 'uppercase', marginBottom: 8 }}>3-qadam / 3 · Oxirgisi</div>
            <div style={{ fontSize: 21, fontWeight: 500, color: '#f0eeff', letterSpacing: -.4, marginBottom: 6 }}>Vizitkangizni <span style={{ color: '#7c6bff' }}>yarating</span></div>
            <div style={{ fontSize: 13, color: 'rgba(240,238,255,.3)', lineHeight: 1.6, marginBottom: 20 }}>
              URL manzilingiz doimiy bo&apos;ladi. Esda qoladigan nom tanlang.
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(240,238,255,.3)', letterSpacing: 1, textTransform: 'uppercase' }}>Username</span>
              <span style={{ fontSize: 11, color: uHintColor }}>{uHintText[uStatus]}</span>
            </div>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'rgba(124,107,255,.5)', pointerEvents: 'none' }}>vizitka.me/</span>
              <input
                className="inp"
                style={{ paddingLeft: 106, paddingRight: 36 }}
                placeholder="sardor"
                maxLength={20}
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                autoCapitalize="off"
                suppressHydrationWarning
              />
              <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>
                {uStatus === 'checking' && <span style={{ display: 'inline-block', width: 12, height: 12, border: '1.5px solid rgba(240,238,255,.15)', borderTopColor: 'rgba(240,238,255,.5)', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />}
                {uStatus === 'ok' && <span style={{ color: '#5dcaa5' }}>✓</span>}
                {(uStatus === 'taken' || uStatus === 'invalid') && <span style={{ color: '#ff8080' }}>✗</span>}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(240,238,255,.3)', letterSpacing: 1, textTransform: 'uppercase' }}>Parol</span>
              <span style={{ fontSize: 11, color: pwColors[pwScore] }}>{pwLabels[pwScore]}</span>
            </div>
            <div style={{ position: 'relative', marginBottom: 4 }}>
              <input
                className="inp"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                style={{ paddingRight: 64 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                suppressHydrationWarning
              />
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(240,238,255,.3)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                {showPw ? 'Yashir' : "Ko'rish"}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="pw-bar" style={{ background: pwScore >= i ? pwColors[Math.min(pwScore, 3)] : 'rgba(255,255,255,.07)' }} />
              ))}
            </div>

            <button className="btn" disabled={!canCreate || creating} onClick={createAccount}>
              {creating ? <>{spinner} Yaratilmoqda...</> : canCreate ? 'Vizitka yaratish →' : "Maydonlarni to'ldiring"}
            </button>
            {createError && <div className="err-msg" style={{ textAlign: 'center', marginTop: 8 }}>{createError}</div>}
          </div>
        )}

        {/* ─── Muvaffaqiyat ─── */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="ring" />
              <div className="ring" style={{ animationDelay: '.5s' }} />
              <div className="ring" style={{ animationDelay: '1s' }} />
              <div style={{ width: 56, height: 56, background: 'rgba(93,202,165,.15)', border: '.5px solid rgba(93,202,165,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'checkPop .5s cubic-bezier(.16,1,.3,1) both .1s', position: 'relative', zIndex: 1 }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none"><path d="M7 14l5 5 9-10" stroke="#5dcaa5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#f0eeff', letterSpacing: -.4, marginBottom: 6 }}>Vizitka <span style={{ color: '#5dcaa5' }}>jonlandi!</span></div>
            <div style={{ fontSize: 13, color: 'rgba(124,107,255,.6)', marginBottom: 22, fontFamily: 'monospace' }}>vizitka.me/{finalUser}</div>
            <button className="btn" style={{ marginBottom: 10 }} onClick={() => { window.location.href = '/' + finalUser }}>
              Sahifamga o&apos;tish →
            </button>
            <button
              className="btn"
              style={{ background: 'rgba(255,255,255,.05)', border: '.5px solid rgba(255,255,255,.08)' }}
              onClick={() => { setStep('method'); setMethod(null); setOtp(['', '', '', '', '', '']); setUsername(''); setPassword(''); setEmail('') }}
            >
              Qayta boshlash
            </button>
          </div>
        )}

      </div>
    </main>
  )
}
