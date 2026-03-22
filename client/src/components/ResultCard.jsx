import React from "react";

function ResultCard({ result, theme }) {
  const th = theme || {};
  const sc = {
    positive: { color:"#34d399", bg:"rgba(52,211,153,0.1)", border:"rgba(52,211,153,0.25)", icon:"↑", label:"Positive" },
    neutral:  { color:"#94a3b8", bg:"rgba(148,163,184,0.1)", border:"rgba(148,163,184,0.25)", icon:"→", label:"Neutral" },
    negative: { color:"#f87171", bg:"rgba(248,113,113,0.1)", border:"rgba(248,113,113,0.25)", icon:"↓", label:"Negative" },
  };
  const s = sc[result.sentiment] || sc.neutral;

  const blockStyle = {
    background: th.secondary || "rgba(255,255,255,0.03)",
    border: "1px solid " + (th.secondaryBorder || "rgba(255,255,255,0.07)"),
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "14px",
  };

  const labelStyle = {
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: th.sub || "rgba(240,240,245,0.3)",
    marginBottom: "10px",
  };

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 11px",
    borderRadius: "999px",
    fontSize: "0.72rem",
    fontWeight: 600,
    border: "1px solid",
    color: s.color,
    background: s.bg,
    borderColor: s.border,
  };

  return (
    <>
      <style>{`
        .rw{animation:fu 0.5s ease forwards;}
        @keyframes fu{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        .kplist{list-style:none;display:flex;flex-direction:column;gap:10px;}
        .kpitem{display:flex;align-items:flex-start;gap:12px;font-size:0.93rem;line-height:1.55;}
        .kpdot{width:7px;height:7px;border-radius:50%;background:${th.btn||"linear-gradient(135deg,#7c3aed,#60a5fa)"};margin-top:6px;flex-shrink:0;}
      `}</style>
      <div className="rw">

        <div style={{...blockStyle}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <div style={labelStyle}>📄 Summary</div>
            <span style={badgeStyle}>{s.icon} {s.label}</span>
          </div>
          <p style={{fontSize:"1.02rem",lineHeight:1.75,color:th.text||"#f0f0f5",fontWeight:300}}>{result.summary}</p>
        </div>

        <div style={{...blockStyle}}>
          <div style={labelStyle}>🔑 Key Points</div>
          <ul className="kplist">
            {result.keyPoints.map((point,i)=>(
              <li key={i} className="kpitem" style={{color:th.sub||"rgba(240,240,245,0.75)"}}>
                <span className="kpdot"/>
                {point}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </>
  );
}

export default ResultCard;
