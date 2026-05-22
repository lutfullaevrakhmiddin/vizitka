// app.jsx — main page composition
const { useState: useStateA } = React;
const { IOSDevice, Registration, Login } = window;

function App() {
  const [regStep, setRegStep] = useStateA(0);
  const [regKey, setRegKey] = useStateA(0);

  return (
    <div className="page">
      <div className="page-bg"></div>
      <div className="page-grain"></div>
      <div className="page-inner">

        <div className="brand-row">
          <div className="brand-mark">
            <span className="v">vizitka</span><span className="me">.me</span>
          </div>
          <div className="brand-meta">
            <span>Prototype</span>
            <span className="dot"></span>
            <span>v0.1 · auth flow</span>
            <span className="dot"></span>
            <span>mobile-first</span>
          </div>
        </div>

        <h1 className="page-title">A card worth <em>unlocking.</em></h1>
        <p className="page-sub">Two screens — the front door and the welcome mat — for a personal digital business card. Both are live below; tap, type, and feel the flow.</p>

        <div className="devices">
          {/* Registration column */}
          <div className="device-col">
            <div className="device-label">
              <span className="num">A</span>
              <span>Registration · multi-step</span>
            </div>
            <IOSDevice dark={true} width={380} height={760}>
              <Registration key={regKey} initialStep={regStep} />
            </IOSDevice>

            {/* Step jumper */}
            <div style={{
              display: 'flex', gap: 6, fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {['method','verify','identity','success'].map((label, i) => (
                <button
                  key={i}
                  onClick={() => { setRegStep(i); setRegKey(k => k+1); }}
                  style={{
                    background: regStep === i ? 'rgba(212,168,67,0.12)' : 'transparent',
                    color: regStep === i ? '#D4A843' : '#8a86a8',
                    border: `1px solid ${regStep === i ? 'rgba(212,168,67,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    padding: '6px 12px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                  }}
                >0{i+1} · {label}</button>
              ))}
            </div>
          </div>

          {/* Login column */}
          <div className="device-col">
            <div className="device-label">
              <span className="num">B</span>
              <span>Login · one screen, no friction</span>
            </div>
            <IOSDevice dark={true} width={380} height={760}>
              <Login />
            </IOSDevice>
            <div style={{
              display: 'flex', gap: 8, fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10, letterSpacing: '0.08em', color: '#4f4c66',
              textAlign: 'center', maxWidth: 360,
            }}>
              <span>// try password: <span style={{ color: '#D4A843' }}>demo1234</span> · anything else triggers the error state</span>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 64, paddingTop: 32,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
        }}>
          <SystemNote n="01" title="The dark" body="#07070f base. Cosmic, but never black. Three slow-floating orbs add atmosphere without distraction." />
          <SystemNote n="02" title="The gold" body="#D4A843 reserved for the brand, the URL, and what's permanent. Shimmer on the progress bar signals 'unlocking'." />
          <SystemNote n="03" title="The trust" body="Emerald only for safety and success states. Shield badge up front; success burst at the end. Nothing in between." />
          <SystemNote n="04" title="The motion" body="Steps slide in from the right. Pop-in for filled OTP digits. Soft shake + red border for errors. No bounce, no spin." />
        </div>

      </div>
    </div>
  );
}

function SystemNote({ n, title, body }) {
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: '#D4A843', marginBottom: 10 }}>{n}</div>
      <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 18, fontWeight: 400, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: '#8a86a8' }}>{body}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
