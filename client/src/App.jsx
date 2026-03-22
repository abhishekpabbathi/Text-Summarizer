import React, { useState, useEffect } from "react";
import axios from "axios";
import ResultCard from "./components/ResultCard";

const MAX_CHARS = 10000;

const THEMES = {
  dark: { name:"Dark", icon:"🌙", bg:"#0a0a0f", card:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.1)", text:"#f0f0f5", sub:"rgba(240,240,245,0.5)", btn:"linear-gradient(135deg,#7c3aed,#4f46e5)", btnShadow:"rgba(124,58,237,0.35)", accent:"#a78bfa", accentBg:"rgba(124,58,237,0.15)", accentBorder:"rgba(124,58,237,0.3)", textarea:"rgba(255,255,255,0.05)", progress:"linear-gradient(90deg,#7c3aed,#60a5fa)", secondary:"rgba(255,255,255,0.06)", secondaryBorder:"rgba(255,255,255,0.1)", secondaryText:"rgba(240,240,245,0.7)", orb1:"radial-gradient(circle,#7c3aed,#4f46e5)", orb2:"radial-gradient(circle,#06b6d4,#3b82f6)", orb3:"radial-gradient(circle,#f59e0b,#ef4444)" },
  light: { name:"Light", icon:"☀️", bg:"#f0f4ff", card:"rgba(255,255,255,0.9)", border:"rgba(100,100,200,0.15)", text:"#1a1a2e", sub:"rgba(30,30,60,0.5)", btn:"linear-gradient(135deg,#7c3aed,#4f46e5)", btnShadow:"rgba(124,58,237,0.25)", accent:"#7c3aed", accentBg:"rgba(124,58,237,0.08)", accentBorder:"rgba(124,58,237,0.2)", textarea:"rgba(255,255,255,0.95)", progress:"linear-gradient(90deg,#7c3aed,#60a5fa)", secondary:"rgba(100,100,200,0.08)", secondaryBorder:"rgba(100,100,200,0.15)", secondaryText:"rgba(30,30,60,0.6)", orb1:"radial-gradient(circle,#c4b5fd,#818cf8)", orb2:"radial-gradient(circle,#67e8f9,#93c5fd)", orb3:"radial-gradient(circle,#fcd34d,#fca5a5)" },
  neon: { name:"Neon", icon:"⚡", bg:"#050510", card:"rgba(0,255,150,0.03)", border:"rgba(0,255,150,0.15)", text:"#e0ffe0", sub:"rgba(200,255,200,0.45)", btn:"linear-gradient(135deg,#00ff88,#00ccff)", btnShadow:"rgba(0,255,136,0.3)", accent:"#00ff88", accentBg:"rgba(0,255,136,0.08)", accentBorder:"rgba(0,255,136,0.25)", textarea:"rgba(0,255,136,0.04)", progress:"linear-gradient(90deg,#00ff88,#00ccff)", secondary:"rgba(0,255,136,0.06)", secondaryBorder:"rgba(0,255,136,0.15)", secondaryText:"rgba(200,255,200,0.6)", orb1:"radial-gradient(circle,#00ff88,#00ffcc)", orb2:"radial-gradient(circle,#ff00ff,#8800ff)", orb3:"radial-gradient(circle,#00ffff,#0088ff)" },
  sunset: { name:"Sunset", icon:"🌅", bg:"#1a0800", card:"rgba(255,120,50,0.05)", border:"rgba(255,120,50,0.15)", text:"#fff5e0", sub:"rgba(255,220,180,0.5)", btn:"linear-gradient(135deg,#ff6b00,#ff0080)", btnShadow:"rgba(255,107,0,0.35)", accent:"#ff9944", accentBg:"rgba(255,107,0,0.1)", accentBorder:"rgba(255,107,0,0.25)", textarea:"rgba(255,120,50,0.05)", progress:"linear-gradient(90deg,#ff6b00,#ff0080)", secondary:"rgba(255,107,0,0.07)", secondaryBorder:"rgba(255,107,0,0.15)", secondaryText:"rgba(255,220,180,0.6)", orb1:"radial-gradient(circle,#ff6b00,#ff4500)", orb2:"radial-gradient(circle,#ff0080,#ff6b00)", orb3:"radial-gradient(circle,#ffcc00,#ff6b00)" },
};

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [themeKey, setThemeKey] = useState("dark");
  const th = THEMES[themeKey];
  const pct = Math.round((text.length / MAX_CHARS) * 100);

  useEffect(() => {
    const h = localStorage.getItem("sum-history");
    if (h) setHistory(JSON.parse(h));
    const t = localStorage.getItem("sum-theme");
    if (t && THEMES[t]) setThemeKey(t);
  }, []);

  const handleSubmit = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await axios.post("/api/summarize", { text });
      const entry = { ...response.data, preview: text.slice(0, 80) + (text.length > 80 ? "..." : ""), time: new Date().toLocaleTimeString() };
      const newH = [entry, ...history].slice(0, 10);
      setHistory(newH);
      localStorage.setItem("sum-history", JSON.stringify(newH));
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const handleClear = () => { setText(""); setResult(null); setError(""); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem("sum-history"); };
  const switchTheme = (k) => { setThemeKey(k); localStorage.setItem("sum-theme", k); };
  const loadFromHistory = (item) => { setResult(item); setShowHistory(false); };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap");
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${th.bg};min-height:100vh;font-family:"DM Sans",sans-serif;color:${th.text};transition:all 0.4s;}
        .orbs{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
        .orb{position:absolute;border-radius:50%;filter:blur(90px);opacity:0.15;animation:drift 12s ease-in-out infinite alternate;}
        .o1{width:500px;height:500px;background:${th.orb1};top:-150px;left:-150px;}
        .o2{width:400px;height:400px;background:${th.orb2};bottom:-100px;right:-100px;animation-delay:-5s;}
        .o3{width:300px;height:300px;background:${th.orb3};top:45%;left:45%;animation-delay:-9s;}
        @keyframes drift{0%{transform:translate(0,0) scale(1);}100%{transform:translate(40px,25px) scale(1.1);}}
        .wrap{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:32px 20px 80px;}
        .topbar{width:100%;max-width:780px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;flex-wrap:wrap;gap:12px;}
        .logo{display:flex;align-items:center;gap:10px;font-family:"Syne",sans-serif;font-weight:800;font-size:1.15rem;color:${th.accent};}
        .logo-box{width:38px;height:38px;background:${th.btn};border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;box-shadow:0 4px 18px ${th.btnShadow};}
        .theme-row{display:flex;gap:6px;flex-wrap:wrap;}
        .tbtn{padding:7px 13px;border-radius:9px;border:1px solid ${th.secondaryBorder};background:${th.secondary};color:${th.secondaryText};font-size:0.78rem;cursor:pointer;transition:all 0.25s;font-family:"DM Sans",sans-serif;}
        .tbtn.on{background:${th.accentBg};border-color:${th.accentBorder};color:${th.accent};font-weight:600;}
        .tbtn:hover{opacity:0.8;}
        .hbtn{padding:8px 16px;border-radius:9px;border:1px solid ${th.secondaryBorder};background:${th.secondary};color:${th.secondaryText};font-size:0.82rem;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;gap:6px;font-family:"DM Sans",sans-serif;}
        .hbtn:hover{background:${th.accentBg};border-color:${th.accentBorder};color:${th.accent};}
        .card{width:100%;max-width:780px;background:${th.card};border:1px solid ${th.border};border-radius:26px;padding:44px;backdrop-filter:blur(24px);box-shadow:0 12px 60px rgba(0,0,0,0.25);transition:all 0.4s;}
        .badge{display:inline-flex;align-items:center;gap:7px;background:${th.accentBg};border:1px solid ${th.accentBorder};border-radius:999px;padding:7px 16px;font-size:0.72rem;font-weight:600;color:${th.accent};margin-bottom:18px;letter-spacing:0.08em;text-transform:uppercase;}
        .pulse{width:7px;height:7px;background:${th.accent};border-radius:50%;animation:p 2s ease-in-out infinite;}
        @keyframes p{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.3;transform:scale(0.7);}}
        h1{font-family:"Syne",sans-serif;font-size:clamp(1.9rem,5vw,3.2rem);font-weight:800;line-height:1.08;margin-bottom:14px;background:${th.btn};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .sub{color:${th.sub};font-size:0.98rem;font-weight:300;margin-bottom:34px;line-height:1.65;}
        textarea{width:100%;background:${th.textarea};border:1px solid ${th.border};border-radius:16px;padding:20px;font-size:0.95rem;font-family:"DM Sans",sans-serif;color:${th.text};resize:vertical;min-height:180px;outline:none;transition:all 0.3s;line-height:1.75;margin-bottom:14px;}
        textarea::placeholder{color:${th.sub};}
        textarea:focus{border-color:${th.accent};box-shadow:0 0 0 3px ${th.accentBg};}
        .meta{display:flex;align-items:center;gap:10px;margin-bottom:22px;}
        .pbar{flex:1;height:5px;background:${th.secondary};border-radius:999px;overflow:hidden;}
        .pfill{height:100%;border-radius:999px;background:${th.progress};transition:width 0.35s ease;}
        .cc{font-size:0.76rem;color:${th.sub};white-space:nowrap;}
        .brow{display:flex;gap:10px;}
        .bp{flex:1;padding:14px 24px;background:${th.btn};border:none;border-radius:13px;color:#fff;font-family:"DM Sans",sans-serif;font-size:1rem;font-weight:600;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 22px ${th.btnShadow};letter-spacing:0.01em;}
        .bp:hover:not(:disabled){opacity:0.88;transform:translateY(-2px);box-shadow:0 8px 28px ${th.btnShadow};}
        .bp:disabled{opacity:0.3;cursor:not-allowed;transform:none;}
        .bs{padding:14px 20px;background:${th.secondary};border:1px solid ${th.secondaryBorder};border-radius:13px;color:${th.secondaryText};font-family:"DM Sans",sans-serif;font-size:1rem;cursor:pointer;transition:all 0.2s;}
        .bs:hover{background:${th.accentBg};border-color:${th.accentBorder};color:${th.accent};}
        .err{margin-top:16px;padding:14px 18px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:13px;color:#fca5a5;font-size:0.88rem;}
        .ldg{display:flex;align-items:center;gap:12px;margin-top:24px;color:${th.sub};font-size:0.88rem;}
        .spin{width:18px;height:18px;border:2px solid ${th.accentBg};border-top-color:${th.accent};border-radius:50%;animation:s 0.7s linear infinite;}
        @keyframes s{to{transform:rotate(360deg);}}
        .hpanel{width:100%;max-width:780px;margin-top:18px;background:${th.card};border:1px solid ${th.border};border-radius:22px;padding:28px;backdrop-filter:blur(24px);}
        .hhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
        .htitle{font-family:"Syne",sans-serif;font-weight:700;font-size:1rem;color:${th.text};}
        .hclear{padding:6px 13px;border-radius:8px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.08);color:#fca5a5;font-size:0.78rem;cursor:pointer;transition:all 0.2s;}
        .hclear:hover{background:rgba(239,68,68,0.15);}
        .hitem{padding:14px 16px;background:${th.secondary};border:1px solid ${th.secondaryBorder};border-radius:13px;margin-bottom:10px;cursor:pointer;transition:all 0.2s;}
        .hitem:hover{background:${th.accentBg};border-color:${th.accentBorder};}
        .hprev{font-size:0.83rem;color:${th.sub};margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .hmeta{display:flex;gap:8px;align-items:center;}
        .hsent{font-size:0.72rem;padding:3px 10px;border-radius:999px;font-weight:600;}
        .htime{font-size:0.7rem;color:${th.sub};}
        .empty{text-align:center;color:${th.sub};font-size:0.88rem;padding:24px;}
        .divider{height:1px;background:linear-gradient(90deg,transparent,${th.border},transparent);margin:28px 0 4px;}
      `}</style>

      <div className="orbs">
        <div className="orb o1"/><div className="orb o2"/><div className="orb o3"/>
      </div>

      <div className="wrap">
        <div className="topbar">
          <div className="logo">
            <div className="logo-box">🧠</div>
            Text Summarizer
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
            <div className="theme-row">
              {Object.entries(THEMES).map(([k,v]) => (
                <button key={k} className={`tbtn ${themeKey===k?"on":""}`} onClick={()=>switchTheme(k)}>{v.icon} {v.name}</button>
              ))}
            </div>
            <button className="hbtn" onClick={()=>setShowHistory(!showHistory)}>
              📋 History {history.length>0 && `(${history.length})`}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="badge"><span className="pulse"/>AI Powered · Instant Summaries</div>
          <h1>Text Summarizer</h1>
          <p className="sub">Paste any article, report, or content — get a crisp summary, key insights, and sentiment in seconds.</p>

          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your text here... articles, reports, emails, anything!" maxLength={MAX_CHARS} rows={8}/>

          <div className="meta">
            <div className="pbar"><div className="pfill" style={{width:`${pct}%`}}/></div>
            <span className="cc">{text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}</span>
          </div>

          <div className="brow">
            <button className="bp" onClick={handleSubmit} disabled={loading||text.trim()===""}>
              {loading ? "Analyzing..." : "✦ Analyze Text"}
            </button>
            <button className="bs" onClick={handleClear}>🗑 Clear</button>
          </div>

          {error && <div className="err">⚠️ {error}</div>}
          {loading && <div className="ldg"><div className="spin"/>Summarizing your text with AI...</div>}
          {result && (
            <>
              <div className="divider"/>
              <ResultCard result={result} theme={th}/>
            </>
          )}
        </div>

        {showHistory && (
          <div className="hpanel">
            <div className="hhead">
              <span className="htitle">📋 Recent Summaries</span>
              {history.length>0 && <button className="hclear" onClick={clearHistory}>Clear All</button>}
            </div>
            {history.length===0 ? (
              <div className="empty">No history yet. Analyze some text to get started!</div>
            ) : history.map((item,i)=>(
              <div key={i} className="hitem" onClick={()=>loadFromHistory(item)}>
                <div className="hprev">{item.preview}</div>
                <div className="hmeta">
                  <span className="hsent" style={{
                    background: item.sentiment==="positive"?"rgba(52,211,153,0.15)":item.sentiment==="negative"?"rgba(248,113,113,0.15)":"rgba(148,163,184,0.15)",
                    color: item.sentiment==="positive"?"#34d399":item.sentiment==="negative"?"#f87171":"#94a3b8"
                  }}>{item.sentiment}</span>
                  <span className="htime">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
