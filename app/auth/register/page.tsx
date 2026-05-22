'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Step = 'method' | 'verify' | 'identity' | 'success'
type Method = 'telegram' | 'email'

const TAKEN = ['admin', 'test', 'vizitka', 'hello']

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<Method>('telegram')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpActive, setOtpActive] = useState(0)
  const [timer, setTimer] = useState(30)
  const [username, setUsername] = useState('')
  const [uStatus, setUStatus] = useState<'idle'|'checking'|'ok'|'taken'|'invalid'>('idle')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwScore, setPwScore] = useState(0)
  const [finalUser, setFinalUser] = useState('')

  useEffect(() => {
    if (step !== 'verify') return
    setTimer(30)
    const t = setInterval(() => setTimer(s => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [step])

  useEffect(() => {
    if (otp.every(d => d !== '')) return
  }, [otp])

  useEffect(() => {
    if (!username) { setUStatus('idle'); return }
    if (username.length < 3 || !/^[a-z0-9_]+$/i.test(username)) { setUStatus('invalid'); return }
    setUStatus('checking')
    const t = setTimeout(() => {
      setUStatus(TAKEN.includes(username.toLowerCase()) ? 'taken' : 'ok')
    }, 700)
    return () => clearTimeout(t)
  }, [username])

  useEffect(() => {
    if (!password) { setPwScore(0); return }
    if (password.length < 6) { setPwScore(1); return }
    if (password.length < 10 || !/[0-9]/.test(password)) { setPwScore(2); return }
    setPwScore(3)
  }, [password])

  const fillOtp = (i: number) => {
    if (i !== otpActive) return
    const nums = ['2','4','1','8','3','7']
    const next = [...otp]
    next[i] = nums[i]
    setOtp(next)
    setOtpActive(prev => Math.min(prev + 1, 6))
  }

  const resetOtp = () => { setOtp(['','','','','','']); setOtpActive(0) }

  const canCreate = uStatus === 'ok' && pwScore >= 2

  const pwColors = ['rgba(240,238,255,.2)', '#ff8080', '#f0b429', '#5dcaa5']
  const pwLabels = ['min 6 belgi', 'juda qisqa', 'yaxshi', 'kuchli']

  const uHintColor = uStatus === 'ok' ? '#5dcaa5' : (uStatus === 'taken' || uStatus === 'invalid') ? '#ff8080' : 'rgba(240,238,255,.2)'
  const uHintText = { idle: 'ehtiyotkorlik bilan tanlang', checking: 'tekshirilmoqda...', ok: '✓ Mavjud', taken: '✗ Band', invalid: 'harf/raqam/_ faqat' }[uStatus]

  return (
    <main style={{ background: '#07070f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'system-ui,sans-serif', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(16px,-12px) scale(1.04)} 66%{transform:translate(-10px,16px) scale(.97)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes checkPop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        @keyframes caretBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .orb { position:fixed; border-radius:50%; pointer-events:none; filter:blur(70px); z-index:0; animation:orbFloat 9s ease-in-out infinite; }
        .inp { width:100%; padding:13px 14px; background:rgba(255,255,255,.04); border:.5px solid rgba(255,255,255,.08); border-radius:12px; font-size:15px; color:#f0eeff; font-family:inherit; outline:none; transition:border-color .2s,background .2s; -webkit-appearance:none; box-sizing:border-box; }
        .inp:focus { border-color:rgba(124,107,255,.5); background:rgba(124,107,255,.06); }
        .inp::placeholder { color:rgba(240,238,255,.18); }
        .btn { width:100%; padding:15px; background:#7c6bff; border:none; border-radius:12px; font-size:15px; font-weight:500; color:#fff; cursor:pointer; font-family:inherit; transition:background .2s,transform .1s,box-shadow .2s; }
        .btn:hover { background:#6a59ff; box-shadow:0 8px 24px rgba(124,107,255,.25); }
        .btn:active { transform:scale(.98); }
        .btn:disabled { opacity:.4; cursor:not-allowed; }
        .method-card { border:.5px solid rgba(255,255,255,.07); border-radius:14px; padding:15px 13px; display:flex; align-items:center; gap:12px; margin-bottom:10px; cursor:pointer; background:rgba(255,255,255,.02); transition:all .2s; }
        .method-card:hover { border-color:rgba(124,107,255,.35); background:rgba(124,107,255,.05); transform:translateX(2px); }
        .otp-box { flex:1; height:54px; background:rgba(255,255,255,.04); border:.5px solid rgba(255,255,255,.08); border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:500; color:#f0eeff; cursor:pointer; transition:all .18s; }
        .otp-filled { border-color:rgba(124,107,255,.35); background:rgba(124,107,255,.08); color:#c4b8ff; }
        .otp-active { border-color:rgba(124,107,255,.5); background:rgba(124,107,255,.06); }
        .caret { width:1.5px; height:22px; background:#7c6bff; animation:caretBlink 1s infinite; display:inline-block; }
        .back-btn { display:inline-flex; align-items:center; gap:5px; font-size:12px; color:rgba(240,238,255,.3); cursor:pointer; background:none; border:none; font-family:inherit; padding:0; margin-bottom:18px; transition:color .2s; }
        .back-btn:hover { color:rgba(240,238,255,.6); }
        .ring { position:absolute; inset:0; border-radius:50%; border:1.5px solid rgba(93,202,165,.3); animation:ringPulse 1.8s ease-out infinite; }
        .pw-bar { flex:1; height:3px; border-radius:2px; background:rgba(255,255,255,.07); transition:background .3s; }
      `}</style>

      <div className="orb" style={{ width: 260, height: 260, background: 'rgba(124,107,255,.09)', top: -70, right: -50 }} />
      <div className="orb" style={{ width: 180, height: 180, background: 'rgba(255,107,157,.05)', bottom: -30, left: -30, animationDirection: 'reverse', animationDuration: '11s' }} />

      <div style={{ background: 'rgba(255,255,255,.03)', border: '.5px solid rgba(255,255,255,.08)', borderRadius: 24, padding: '28px 22px 24px', width: '100%', maxWidth: 390, position: 'relative', zIndex: 1, animation: 'fadeUp .5s cubic-bezier(.16,1,.3,1) both' }}>

        <div style={{ fontSize: 19, fontWeight: 500, color: '#f0eeff', letterSpacing: -.4, marginBottom: 18 }}>
          vizitka<span style={{ color: '#7c6bff' }}>.me</span>
        </div>

        {/* Progress bar */}
        {step !== 'success' && (
          <>
            <div style={{ height: 2, background: 'rgba(255,255,255,.07)', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#7c6bff,#a78bfa)', width: step === 'method' ? '33%' : step === 'verify' ? '66%' : '100%', transition: 'width .5s cubic-bezier(.16,1,.3,1)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
              {[['method','01 · Usul'], ['verify','02 · Tasdiqlash'], ['identity','03 · Shaxs']].map(([s, label]) => (
                <span key={s} style={{ fontSize: 10, letterSpacing: .8, textTransform: 'uppercase', color: step === s ? '#a78bfa' : (step === 'verify' && s === 'method') || (step === 'identity' && s !== 'identity') ? 'rgba(167,139,250,.4)' : 'rgba(240,238,255,.2)' }}>
                  {label}
                </span>
              ))}
            </div>
          </>
        )}

        {/* 1-qadam: Usul */}
        {step === 'method' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(124,107,255,.07)', border: '.5px solid rgba(124,107,255,.15)', borderRadius: 8, padding: '8px 11px', marginBottom: 18, fontSize: 11, color: 'rgba(167,139,250,.7)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l4 1.5v3c0 2.5-1.7 4.5-4 5.5-2.3-1-4-3-4-5.5v-3L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Ma'lumotlaringiz himoyalangan · End-to-end shifrlangan
            </div>
            <div style={{ fontSize: 11, color: 'rgba(240,238,255,.25)', letterSpacing: .8, textTransform: 'uppercase', marginBottom: 8 }}>1-qadam / 3</div>
            <div style={{ fontSize: 21, fontWeight: 500, color: '#f0eeff', letterSpacing: -.4, marginBottom: 6 }}>Qanday <span style={{ color: '#7c6bff' }}>boshlaymiz?</span></div>
            <div style={{ fontSize: 13, color: 'rgba(240,238,255,.3)', lineHeight: 1.6, marginBottom: 22 }}>Tasdiqlash usulini tanlang. Bu faqat bir marta kerak.</div>

            <div className="method-card" onClick={() => { setMethod('telegram'); setStep('verify') }}>
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

            <div className="method-card" onClick={() => { setMethod('email'); setStep('verify') }}>
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

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'rgba(240,238,255,.2)' }}>
              Hisobingiz bormi? <Link href="/auth/login" style={{ color: '#7c6bff', textDecoration: 'none' }}>Kirish</Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
              {['Bepul','Xavfsiz','1 daqiqada'].map((t,i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(240,238,255,.18)' }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#7c6bff' }} />{t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-qadam: OTP */}
        {step === 'verify' && (
          <div>
            <button className="back-btn" onClick={() => { resetOtp(); setStep('method') }}>← Orqaga</button>
            <div style={{ fontSize: 11, color: 'rgba(240,238,255,.25)', letterSpacing: .8, textTransform: 'uppercase', marginBottom: 8 }}>2-qadam / 3 · {method === 'telegram' ? 'Telegram' : 'Email'}</div>
            <div style={{ fontSize: 21, fontWeight: 500, color: '#f0eeff', letterSpacing: -.4, marginBottom: 6 }}><span style={{ color: '#7c6bff' }}>6 xonali</span> kodni kiriting</div>
            <div style={{ fontSize: 13, color: 'rgba(240,238,255,.3)', lineHeight: 1.6, marginBottom: 20 }}>
              {method === 'telegram' ? '@vizitka_official_bot' : 'Emailingiz'}ga kod yuborildi. Bosib simulatsiya qiling.
            </div>
            <div style={{ display: 'flex', gap: 7, marginBottom: 8 }}>
              {otp.map((d, i) => (
                <div key={i} className={`otp-box${d ? ' otp-filled' : ''}${i === otpActive && !d ? ' otp-active' : ''}`} onClick={() => fillOtp(i)}>
                  {d || (i === otpActive ? <span className="caret" /> : '-')}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(240,238,255,.25)', marginBottom: 18 }}>
              {timer > 0 ? <>Qayta yuborish: <span style={{ color: 'rgba(124,107,255,.5)' }}>00:{String(timer).padStart(2,'0')}</span></> : <span style={{ color: '#7c6bff', cursor: 'pointer' }} onClick={resetOtp}>Qayta yuborish →</span>}
            </div>
            <button className="btn" disabled={!otp.every(d => d !== '')} onClick={() => setStep('identity')}>Tasdiqlash →</button>
          </div>
        )}

        {/* 3-qadam: Username + Parol */}
        {step === 'identity' && (
          <div>
            <button className="back-btn" onClick={() => { resetOtp(); setStep('verify') }}>← Orqaga</button>
            <div style={{ fontSize: 11, color: 'rgba(240,238,255,.25)', letterSpacing: .8, textTransform: 'uppercase', marginBottom: 8 }}>3-qadam / 3 · Oxirgisi</div>
            <div style={{ fontSize: 21, fontWeight: 500, color: '#f0eeff', letterSpacing: -.4, marginBottom: 6 }}>Vizitkangizni <span style={{ color: '#7c6bff' }}>yarating</span></div>
            <div style={{ fontSize: 13, color: 'rgba(240,238,255,.3)', lineHeight: 1.6, marginBottom: 20 }}>URL manzilingiz doimiy bo'ladi. Esda qoladigan nom tanlang.</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(240,238,255,.3)', letterSpacing: 1, textTransform: 'uppercase' }}>Username</span>
              <span style={{ fontSize: 11, color: uHintColor }}>{uHintText}</span>
            </div>
            <div style={{ position: 'relative', marginBottom: 4 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'rgba(124,107,255,.5)', pointerEvents: 'none' }}>vizitka.me/</span>
              <input className="inp" style={{ paddingLeft: 106, paddingRight: 36 }} placeholder="sardor" maxLength={20} value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g,''))} autoCapitalize="off" suppressHydrationWarning />
              <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>
                {uStatus === 'checking' && <span style={{ display: 'inline-block', width: 12, height: 12, border: '1.5px solid rgba(240,238,255,.15)', borderTopColor: 'rgba(240,238,255,.5)', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />}
                {uStatus === 'ok' && <span style={{ color: '#5dcaa5' }}>✓</span>}
                {(uStatus === 'taken' || uStatus === 'invalid') && <span style={{ color: '#ff8080' }}>✗</span>}
              </span>
            </div>
            <div style={{ marginBottom: 14 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(240,238,255,.3)', letterSpacing: 1, textTransform: 'uppercase' }}>Parol</span>
              <span style={{ fontSize: 11, color: pwColors[pwScore] }}>{pwLabels[pwScore]}</span>
            </div>
            <div style={{ position: 'relative', marginBottom: 4 }}>
              <input className="inp" type={showPw ? 'text' : 'password'} placeholder="••••••••" style={{ paddingRight: 64 }} value={password} onChange={e => setPassword(e.target.value)} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(240,238,255,.3)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                {showPw ? 'Yashir' : "Ko'rish"}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
              {[1,2,3].map(i => (
                <div key={i} className="pw-bar" style={{ background: pwScore >= i ? pwColors[Math.min(pwScore,3)] : 'rgba(255,255,255,.07)' }} />
              ))}
            </div>

            <button className="btn" disabled={!canCreate} onClick={() => { setFinalUser(username); setStep('success') }}>
              {canCreate ? 'Vizitka yaratish →' : 'Maydonlarni to\'ldiring'}
            </button>
          </div>
        )}

        {/* Muvaffaqiyat */}
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
            <button className="btn" style={{ marginBottom: 10 }}>Sahifamga o'tish →</button>
            <button className="btn" style={{ background: 'rgba(255,255,255,.05)', border: '.5px solid rgba(255,255,255,.08)' }} onClick={() => { setStep('method'); resetOtp(); setUsername(''); setPassword(''); }}>Qayta boshlash</button>
          </div>
        )}
      </div>
    </main>
  )
}
