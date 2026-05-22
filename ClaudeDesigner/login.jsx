// login.jsx — login screen
const { useState: useStateL, useEffect: useEffectL } = React;
const Orbs = window.Orbs;

function Login() {
  const [id, setId] = useStateL('');
  const [pw, setPw] = useStateL('');
  const [showPw, setShowPw] = useStateL(false);
  const [error, setError] = useStateL(null);
  const [shake, setShake] = useStateL(false);
  const [loading, setLoading] = useStateL(false);

  const detect = id.includes('@') ? 'email' : id.length > 0 ? 'username' : null;

  const submit = () => {
    if (!id || pw.length < 4) {
      setError('Enter your username and password');
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    // demo: fail unless password is "demo1234"
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      if (pw !== 'demo1234') {
        setError("That doesn't match. Try password: demo1234");
        setShake(true);
        setTimeout(() => setShake(false), 400);
      } else {
        setError(null);
        alert('Welcome back! (demo)');
      }
    }, 700);
  };

  return (
    <div className="app login-app">
      <Orbs />
      <div className="step" style={{ paddingTop: 12 }}>
        <div className="login-wordmark">
          <span className="v">vizitka</span><span className="me">.me</span>
        </div>

        <h1 className="login-h1">Xush <em>kelibsiz</em></h1>
        <div className="login-sub">Welcome back · sign in to your card</div>

        <div className="field-label">
          <span>Username or Email</span>
          <span className="hint" style={{ color: detect === 'email' ? 'var(--purple)' : detect === 'username' ? 'var(--gold)' : 'var(--text-dim)' }}>
            {detect === 'email' ? 'detected: email' : detect === 'username' ? 'detected: username' : 'smart detect'}
          </span>
        </div>
        <div className={`input-field ${shake && error && !pw ? 'shake' : ''}`}>
          <input
            value={id}
            onChange={e => { setId(e.target.value); setError(null); }}
            placeholder="aziz  or  aziz@mail.com"
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>

        <div className="field-label">
          <span>Password</span>
          <span className="hint">{loading ? 'verifying…' : ''}</span>
        </div>
        <div className={`input-field ${shake ? 'shake' : ''}`}>
          <input
            type={showPw ? 'text' : 'password'}
            value={pw}
            onChange={e => { setPw(e.target.value); setError(null); }}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && submit()}
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
        {error && <div className="error-msg">⚠ {error}</div>}
        <div className="forgot-row"><a>Forgot password?</a></div>

        <button className="cta" style={{ marginTop: 28 }} onClick={submit} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>

        <div className="divider"><span>or</span></div>

        <button className="tg-btn">
          <div className="tg-circle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.95c-.88-.25-.89-.86.2-1.3L19.83 4.6c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
            </svg>
          </div>
          <span>Continue with @vizitka_official_bot</span>
        </button>

        <div className="login-foot">
          Don't have an account? <a>Register</a>
        </div>

        <div className="trust-dots">
          <span>Free</span>
          <span className="d"></span>
          <span>Secure</span>
          <span className="d"></span>
          <span>Ready in 1 min</span>
        </div>
      </div>
    </div>
  );
}

window.Login = Login;
