// registration.jsx — multi-step registration flow
const { useState, useEffect, useRef } = React;

function Shield() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1l4 1.5v3c0 2.5-1.7 4.5-4 5.5-2.3-1-4-3-4-5.5v-3L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Orbs() {
  return (
    <div className="app-bg">
      <div className="orb purple o1"></div>
      <div className="orb gold o2"></div>
      <div className="orb purple o3"></div>
    </div>
  );
}

function Progress({ step }) {
  const pct = step === 0 ? 33 : step === 1 ? 66 : step >= 2 ? 100 : 0;
  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-steps">
        <span className={`s ${step === 0 ? 'active' : 'done'}`}>01 · Method</span>
        <span className={`s ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>02 · Verify</span>
        <span className={`s ${step === 2 ? 'active' : ''}`}>03 · Identity</span>
      </div>
    </div>
  );
}

// ───── STEP 1: Method ─────
function StepMethod({ onPick }) {
  return (
    <div className="step" key="m">
      <div className="shield">
        <Shield />
        <span>Your data is protected · End-to-end encrypted</span>
      </div>
      <div className="step-eyebrow">Step 01 of 03</div>
      <h2 className="step-title">Choose how to <em>begin</em></h2>
      <p className="step-desc">Pick a verification method. You'll only need it this once — your vizitka is yours forever.</p>

      <div className="method-stack">
        <div className="method" onClick={() => onPick('telegram')}>
          <div className="method-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.95c-.88-.25-.89-.86.2-1.3L19.83 4.6c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
            </svg>
          </div>
          <div className="method-body">
            <div className="method-label">Recommended · 1 tap</div>
            <div className="method-name">Continue with Telegram</div>
            <div className="method-sub live">@vizitka_official_bot</div>
          </div>
          <svg className="method-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="method" onClick={() => onPick('email')}>
          <div className="method-icon gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M3.5 7l8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="method-body">
            <div className="method-label">Classic · 6-digit code</div>
            <div className="method-name">Continue with Email</div>
            <div className="method-sub" style={{ color: 'var(--text-dim)' }}>name@example.com</div>
          </div>
          <svg className="method-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="foot-link" style={{ marginTop: 'auto' }}>
        Already have a vizitka? <a>Sign in</a>
      </div>
    </div>
  );
}

// ───── STEP 2: Verify ─────
function StepVerify({ method, onBack, onDone }) {
  const [digits, setDigits] = useState(['','','','','','']);
  const [active, setActive] = useState(0);
  const [resendReady, setResendReady] = useState(false);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) { setResendReady(true); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  // simulate auto-fill for demo: tap a box to advance
  const fillNext = (digit) => {
    if (active >= 6) return;
    const next = [...digits];
    next[active] = digit;
    setDigits(next);
    const newActive = active + 1;
    setActive(newActive);
    if (newActive === 6) {
      setTimeout(() => onDone(), 600);
    }
  };

  const reset = () => { setDigits(['','','','','','']); setActive(0); };

  const target = method === 'telegram' ? '@vizitka_official_bot' : 'a.karimov@gmail.com';

  return (
    <div className="step" key="v">
      <div className="step-eyebrow">Step 02 of 03 · {method === 'telegram' ? 'Telegram' : 'Email'}</div>
      <h2 className="step-title">Enter the <em>6-digit</em> code</h2>
      <p className="step-desc">We sent it to <b style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{target}</b>. Tap the boxes below to simulate.</p>

      <div className="otp-row">
        {digits.map((d, i) => (
          <div
            key={i}
            className={`otp-box ${d ? 'filled' : ''} ${i === active ? 'active' : ''}`}
            onClick={() => {
              if (i === active) fillNext(String((i + 1) % 10));
            }}
          >
            {d || (i === active ? <span className="caret" /> : '')}
          </div>
        ))}
      </div>

      <div className="otp-hint">
        {digits.filter(Boolean).length === 6
          ? <span style={{ color: 'var(--emerald)' }}>✓ Code matched. Unlocking…</span>
          : <>Tap any box to simulate entry · <b onClick={reset} style={{ cursor:'pointer', color:'var(--text-mute)' }}>reset</b></>
        }
      </div>

      <div className={`resend ${resendReady ? 'ready' : ''}`} style={{ opacity: resendReady ? 1 : 0.5 }}>
        {resendReady ? 'Resend code →' : `Resend available in 00:${String(seconds).padStart(2,'0')}`}
      </div>

      <button className="cta-ghost" onClick={onBack} style={{ marginTop: 0 }}>← Choose a different method</button>
    </div>
  );
}

// ───── STEP 3: Identity ─────
function StepIdentity({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('idle'); // idle | checking | ok | taken | invalid
  const TAKEN = ['admin','test','john','vizitka','hello'];

  useEffect(() => {
    if (!username) { setUsernameStatus('idle'); return; }
    if (username.length < 3) { setUsernameStatus('invalid'); return; }
    if (!/^[a-z0-9_]+$/i.test(username)) { setUsernameStatus('invalid'); return; }
    setUsernameStatus('checking');
    const t = setTimeout(() => {
      if (TAKEN.includes(username.toLowerCase())) setUsernameStatus('taken');
      else setUsernameStatus('ok');
    }, 700);
    return () => clearTimeout(t);
  }, [username]);

  const pwScore =
    password.length === 0 ? 0 :
    password.length < 6 ? 1 :
    password.length < 10 || !/[0-9]/.test(password) ? 2 : 3;

  const canSubmit = usernameStatus === 'ok' && pwScore >= 2;

  const hint = {
    idle: 'choose carefully — it\'s permanent',
    checking: 'checking…',
    ok: '✓ available',
    taken: '✗ already taken',
    invalid: 'letters, numbers, _ only',
  }[usernameStatus];

  return (
    <div className="step" key="i">
      <div className="step-eyebrow">Step 03 of 03 · Last one</div>
      <h2 className="step-title">Claim your <em>vizitka</em></h2>
      <p className="step-desc">Your URL is forever. Pick something memorable.</p>

      <div className="field-label">
        <span>Your URL</span>
        <span className={`hint ${usernameStatus === 'ok' ? 'ok' : (usernameStatus === 'taken' || usernameStatus === 'invalid') ? 'err' : ''}`}>{hint}</span>
      </div>
      <div className="url-field">
        <div className="url-prefix">vizitka.me/</div>
        <input
          className="url-input"
          placeholder="yourname"
          value={username}
          onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g,''))}
          maxLength={20}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <div className="url-status">
          {usernameStatus === 'checking' && <div className="spinner" />}
          {usernameStatus === 'ok' && (
            <div className="check">
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 6l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}
          {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
            <div className="xmark">
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          )}
        </div>
      </div>

      <div className="field-label">
        <span>Password</span>
        <span className="hint">{pwScore === 0 ? 'min 6 chars' : pwScore === 1 ? 'too short' : pwScore === 2 ? 'good' : 'strong'}</span>
      </div>
      <div className="input-field">
        <input
          type={showPw ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="eye" onClick={() => setShowPw(!showPw)}>
          {showPw ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M6.5 6.5a2 2 0 002.83 2.83M4 4.5C2.5 6 1.5 8 1.5 8s2.5 4.5 6.5 4.5c1.3 0 2.4-.4 3.4-1M9.5 3.6c-.5-.1-1-.1-1.5-.1-4 0-6.5 4.5-6.5 4.5s.7 1.3 2 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" stroke="currentColor" strokeWidth="1.4"/>
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
          )}
        </div>
      </div>
      <div className="pw-strength">
        <div className={`bar ${pwScore >= 1 ? (pwScore === 1 ? 's1' : pwScore === 2 ? 's2' : 's3') : ''}`} />
        <div className={`bar ${pwScore >= 2 ? (pwScore === 2 ? 's2' : 's3') : ''}`} />
        <div className={`bar ${pwScore >= 3 ? 's3' : ''}`} />
      </div>

      <button className="cta" disabled={!canSubmit} onClick={() => canSubmit && onSubmit(username)}>
        {canSubmit ? 'Create my vizitka →' : 'Complete the fields above'}
      </button>
    </div>
  );
}

// ───── SUCCESS ─────
function SuccessScreen({ username, onReset }) {
  return (
    <div className="success-screen">
      <div className="burst">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="tick">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M7 14l5 5 9-10" stroke="#07070f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <h2 className="success-title">Your vizitka is <em>live</em></h2>
      <div className="success-url">vizitka.me/{username || 'yourname'}</div>
      <button className="cta" style={{ maxWidth: 280 }}>Open my card →</button>
      <button className="cta-ghost" style={{ maxWidth: 280 }} onClick={onReset}>Replay flow</button>
    </div>
  );
}

// ───── ORCHESTRATOR ─────
function Registration({ initialStep = 0 }) {
  const [step, setStep] = useState(initialStep);
  const [method, setMethod] = useState('telegram');
  const [username, setUsername] = useState('aziz');

  return (
    <div className="app">
      <Orbs />
      {step < 3 && <Progress step={step} />}
      {step === 0 && <StepMethod onPick={(m) => { setMethod(m); setStep(1); }} />}
      {step === 1 && <StepVerify method={method} onBack={() => setStep(0)} onDone={() => setStep(2)} />}
      {step === 2 && <StepIdentity onSubmit={(u) => { setUsername(u); setStep(3); }} />}
      {step === 3 && <SuccessScreen username={username} onReset={() => setStep(0)} />}
    </div>
  );
}

window.Registration = Registration;
window.Orbs = Orbs;
