import React, { useEffect, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════════════
   LUXURY INDIAN WEDDING BIODATA — PREMIUM PDF TEMPLATE v3.0
   Deep Maroon · Dark Burgundy · Elegant Gold
   Print-Perfect · Mobile-Friendly · Production-Ready
   ══════════════════════════════════════════════════════════════ */

/* ─── Typography constants ──────────────────────────────────── */
const FONT_CINZEL   = "'Cinzel', 'Playfair Display', Georgia, serif";
const FONT_CORMNT   = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const FONT_INTER    = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

/* ─── Color palette ─────────────────────────────────────────── */
const C = {
  pageBg:      'linear-gradient(160deg, #1c0000 0%, #0e0000 40%, #140000 70%, #1c0101 100%)',
  pageBgSolid: '#120000',
  headerBg:    'linear-gradient(135deg, #2e0000 0%, #480a0a 25%, #360000 60%, #1c0000 100%)',
  cardBg:      'linear-gradient(135deg, rgba(34,4,4,0.98) 0%, rgba(20,2,2,0.95) 50%, rgba(28,4,4,0.98) 100%)',
  goldBright:  '#ffcc33',
  goldMid:     '#d4a017',
  goldDark:    '#b8860b',
  goldDeep:    '#8b6010',
  cream:       '#fff8e8',
  text:        '#f0e8d8',
  textMuted:   'rgba(240,232,216,0.72)',
  textDim:     'rgba(240,232,216,0.45)',
  borderGold:  'rgba(212,160,23,0.32)',
  borderGoldS: 'rgba(212,160,23,0.55)',
  borderGoldF: 'rgba(212,160,23,0.18)',
};

/* ─── AI About Me Generator ─────────────────────────────────── */
const generateBio = ({ fullName, dob, height, occupation, city, religion, caste, hobbies, familyType }) => {
  const name  = fullName ? fullName.split(' ')[0] : 'The individual';
  const occup = occupation || 'professional';
  const place = city || 'India';
  const relig = religion ? `${religion}${caste ? ` (${caste})` : ''}` : null;
  const hobby = hobbies ? (Array.isArray(hobbies) ? hobbies[0] : hobbies.split(',')[0]).trim().toLowerCase() : null;

  const templates = [
    `${name} is a warm-hearted, family-oriented ${occup} based in ${place}, who beautifully balances modern aspirations with deep traditional values. Brought up in a loving${familyType ? ` ${familyType.toLowerCase()}` : ''} family, ${name.split(' ')[0]} carries a gentle character, a compassionate soul, and a strong sense of responsibility${hobby ? `, with a sincere passion for ${hobby}` : ''}. Seeking a life partner who shares the same reverence for family, love, and a purposeful life together.`,

    `A cultured and well-educated ${occup} from ${place}${relig ? `, rooted in ${relig} values` : ''}. Known for a balanced blend of ambition and humility, ${name.split(' ')[0]} brings warmth, intelligence, and sincerity to every relationship. Values togetherness, mutual respect, and building a home filled with love, laughter, and shared dreams.`,

    `${name} is a thoughtful, educated, and career-driven individual who deeply cherishes family bonds and cultural heritage${relig ? ` within the ${relig} community` : ''}. Based in ${place}, ${name.split(' ')[0]} combines professional success with a grounded, values-led lifestyle${hobby ? ` and finds joy in ${hobby}` : ''}. Looking forward to a life partnership built on trust, companionship, and mutual growth.`,
  ];

  // Pick deterministically based on name length
  const idx = (fullName || '').length % templates.length;
  return templates[idx];
};

/* ═══════════════════════════════════════════════════════════════
   SVG DECORATIVE ELEMENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Shared SVG Gradient Defs ──────────────────────────────── */
const GoldGradDefs = ({ id = '' }) => (
  <defs>
    <linearGradient id={`lgG${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stopColor="#ffcc33" stopOpacity="0.9" />
      <stop offset="40%"  stopColor="#d4a017" stopOpacity="1"   />
      <stop offset="100%" stopColor="#8b6010" stopOpacity="0.7" />
    </linearGradient>
    <radialGradient id={`rgP${id}`} cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stopColor="#ffee99" stopOpacity="0.95" />
      <stop offset="55%"  stopColor="#d4a017" stopOpacity="0.82" />
      <stop offset="100%" stopColor="#8b6010" stopOpacity="0.38" />
    </radialGradient>
    <radialGradient id={`rgGl${id}`} cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stopColor="#d4a017" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#d4a017" stopOpacity="0"   />
    </radialGradient>
    <filter id={`fGl${id}`} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);

/* ─── Grand Floral Corner ────────────────────────────────────── */
const FloralCornerSVG = ({ uid = '' }) => (
  <svg width="130" height="130" viewBox="0 0 130 130" fill="none"
    xmlns="http://www.w3.org/2000/svg" style={{ display:'block', overflow:'visible' }}>
    <GoldGradDefs id={uid} />
    {/* Soft corner glow */}
    <circle cx="0" cy="0" r="80" fill={`url(#rgGl${uid})`} />
    {/* Bracket lines */}
    <path d="M5 5 L58 5"  stroke={`url(#lgG${uid})`} strokeWidth="1.5" strokeLinecap="round" opacity="0.72" />
    <path d="M5 5 L5 58"  stroke={`url(#lgG${uid})`} strokeWidth="1.5" strokeLinecap="round" opacity="0.72" />
    <path d="M13 5 L13 22" stroke="#d4a017" strokeWidth="0.8" strokeLinecap="round" opacity="0.48" />
    <path d="M5 13 L22 13" stroke="#d4a017" strokeWidth="0.8" strokeLinecap="round" opacity="0.48" />
    <path d="M10 10 L50 10" stroke="#ffcc33" strokeWidth="0.5" strokeLinecap="round" opacity="0.28" />
    <path d="M10 10 L10 50" stroke="#ffcc33" strokeWidth="0.5" strokeLinecap="round" opacity="0.28" />
    {/* Corner jewel diamond */}
    <path d="M5 5 L9 1 L13 5 L9 9 Z" fill={`url(#rgP${uid})`} opacity="0.9" />
    <path d="M5 5 L9 1 L13 5 L9 9 Z" stroke="#ffcc33" strokeWidth="0.5" opacity="0.7" />
    {/* Outer petals */}
    {[0,45,90,135,180,225,270,315].map(a => {
      const r = a*Math.PI/180, px = 28*Math.cos(r), py = 28*Math.sin(r);
      const c1x = 13*Math.cos(r-0.5), c1y = 13*Math.sin(r-0.5);
      const c2x = 13*Math.cos(r+0.5), c2y = 13*Math.sin(r+0.5);
      return <path key={a}
        d={`M0 0 C${c1x} ${c1y} ${px-4*Math.sin(r)} ${py+4*Math.cos(r)} ${px} ${py} C${px+4*Math.sin(r)} ${py-4*Math.cos(r)} ${c2x} ${c2y} 0 0 Z`}
        fill={`url(#rgP${uid})`} opacity="0.24" filter={`url(#fGl${uid})`} />;
    })}
    {/* Middle ring ellipses */}
    {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map(a => {
      const r = a*Math.PI/180, px = 16*Math.cos(r)*0.62, py = 16*Math.sin(r)*0.62;
      return <ellipse key={a} cx={px} cy={py} rx="4.5" ry="8"
        fill={`url(#lgG${uid})`} opacity="0.2" transform={`rotate(${a},${px},${py})`} />;
    })}
    {/* Mandala rings */}
    <circle cx="0" cy="0" r="33" stroke={`url(#lgG${uid})`} strokeWidth="0.65" opacity="0.22" />
    <circle cx="0" cy="0" r="21" stroke="#d4a017" strokeWidth="0.55" opacity="0.18" />
    <circle cx="0" cy="0" r="12" stroke="#ffcc33" strokeWidth="0.45" opacity="0.2"  />
    <circle cx="0" cy="0" r="4.5" fill={`url(#rgP${uid})`} opacity="0.38" />
    <circle cx="0" cy="0" r="2.5" fill="#ffee99" opacity="0.48" />
    {/* Spokes */}
    {[0,45,90,135].map(a => {
      const r = a*Math.PI/180;
      return <line key={a} x1={4.5*Math.cos(r)} y1={4.5*Math.sin(r)}
        x2={30*Math.cos(r)} y2={30*Math.sin(r)} stroke="#d4a017" strokeWidth="0.45" opacity="0.18" />;
    })}
    {/* Vines */}
    <path d="M14 5 Q30 2 48 6 Q62 9 74 5"  stroke="#c9971c" strokeWidth="0.85" fill="none" opacity="0.48" strokeLinecap="round" />
    <path d="M5 14 Q2 30 6 48 Q9 62 5 74"  stroke="#c9971c" strokeWidth="0.85" fill="none" opacity="0.48" strokeLinecap="round" />
    {/* Leaf buds top */}
    {[[26,3],[46,6],[64,4]].map(([x,y],i) => (
      <g key={i}>
        <ellipse cx={x} cy={y-3.5} rx="3.2" ry="5.5" fill={`url(#rgP${uid})`} opacity="0.32" transform={`rotate(-15,${x},${y-3.5})`}/>
        <circle cx={x} cy={y-6.5} r="1.2" fill="#ffcc33" opacity="0.42"/>
      </g>
    ))}
    {/* Leaf buds left */}
    {[[3,26],[6,46],[4,64]].map(([x,y],i) => (
      <g key={i}>
        <ellipse cx={x-3.5} cy={y} rx="5.5" ry="3.2" fill={`url(#rgP${uid})`} opacity="0.32" transform={`rotate(75,${x-3.5},${y})`}/>
        <circle cx={x-6.5} cy={y} r="1.2" fill="#ffcc33" opacity="0.42"/>
      </g>
    ))}
    {/* Accent dots */}
    {[20,36,52].map(x => <circle key={x} cx={x} cy={5} r="1" fill="#d4a017" opacity="0.52"/>)}
    {[20,36,52].map(y => <circle key={y} cx={5} cy={y} r="1" fill="#d4a017" opacity="0.52"/>)}
    {/* Diamond line-ends */}
    <path d="M58 5 L62 1 L66 5 L62 9 Z"  fill="#d4a017" opacity="0.52" />
    <path d="M5 58 L1 62 L5 66 L9 62 Z"  fill="#d4a017" opacity="0.52" />
    {/* Mini secondary flower */}
    <g transform="translate(42,42)" opacity="0.18">
      {[0,60,120,180,240,300].map(a => {
        const r = a*Math.PI/180;
        return <ellipse key={a} cx={6*Math.cos(r)} cy={6*Math.sin(r)} rx="2.8" ry="5.5"
          fill={`url(#lgG${uid})`} transform={`rotate(${a},${6*Math.cos(r)},${6*Math.sin(r)})`}/>;
      })}
      <circle cx="0" cy="0" r="2.5" fill="#ffee99" opacity="0.6"/>
    </g>
  </svg>
);

const FloralCorner = ({ position, uid = '' }) => {
  const posMap = {
    TL: { top: 0,    left: 0,    transform: 'none' },
    TR: { top: 0,    right: 0,   transform: 'scaleX(-1)' },
    BL: { bottom: 0, left: 0,    transform: 'scaleY(-1)' },
    BR: { bottom: 0, right: 0,   transform: 'scale(-1)' },
  };
  return (
    <div style={{ position:'absolute', ...posMap[position],
      width: 130, height: 130, pointerEvents:'none', zIndex: 3, overflow:'visible' }}>
      <FloralCornerSVG uid={uid} />
    </div>
  );
};

/* ─── Grand Mandala Watermark ────────────────────────────────── */
const MandalaWatermark = ({ opacity = 0.055 }) => (
  <svg width="480" height="480" viewBox="0 0 480 480" fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position:'absolute', top:'50%', left:'50%',
      transform:'translate(-50%,-50%)', opacity, pointerEvents:'none', zIndex:0 }}>
    {[196,168,140,112,82,54,28].map((r,i) => (
      <circle key={r} cx="240" cy="240" r={r} stroke="#d4a017"
        strokeWidth={i%2===0 ? '0.9' : '0.55'} fill="none"/>
    ))}
    {Array.from({length:12},(_,i) => i*30).map(a => {
      const r = a*Math.PI/180;
      return <line key={a} x1={240+28*Math.cos(r)} y1={240+28*Math.sin(r)}
        x2={240+194*Math.cos(r)} y2={240+194*Math.sin(r)} stroke="#d4a017" strokeWidth="0.45"/>;
    })}
    {Array.from({length:16},(_,i) => i*22.5).map(a => {
      const r = a*Math.PI/180, cx = 240+112*Math.cos(r), cy = 240+112*Math.sin(r);
      return <ellipse key={a} cx={cx} cy={cy} rx="9" ry="16" fill="none"
        stroke="#d4a017" strokeWidth="0.55" transform={`rotate(${a+90},${cx},${cy})`}/>;
    })}
    {Array.from({length:8},(_,i) => i*45).map(a => {
      const r = a*Math.PI/180, cx = 240+140*Math.cos(r), cy = 240+140*Math.sin(r);
      return <path key={a} d={`M${cx} ${cy-5}L${cx+3.5} ${cy}L${cx} ${cy+5}L${cx-3.5} ${cy}Z`}
        fill="#d4a017" opacity="0.5" transform={`rotate(${a},${cx},${cy})`}/>;
    })}
    {Array.from({length:24},(_,i) => i*15).map(a => {
      const r = a*Math.PI/180;
      return <circle key={a} cx={240+82*Math.cos(r)} cy={240+82*Math.sin(r)} r="2" fill="#d4a017"/>;
    })}
    <circle cx="240" cy="240" r="8"   fill="#d4a017" opacity="0.5"/>
    <circle cx="240" cy="240" r="4"   fill="#ffee99" opacity="0.7"/>
    <circle cx="240" cy="240" r="1.8" fill="#ffffff"  opacity="0.8"/>
  </svg>
);

/* ─── Floral Section Divider ─────────────────────────────────── */
const FloralDivider = ({ style = {} }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'7px', ...style }}>
    <div style={{ flex:1, height:'1px',
      background:'linear-gradient(90deg,transparent,rgba(212,160,23,0.6) 80%,rgba(212,160,23,0.28))' }}/>
    <svg width="78" height="16" viewBox="0 0 78 16" fill="none">
      <g transform="translate(7,8)">
        {[0,60,120,180,240,300].map(a => { const r=a*Math.PI/180; return (
          <ellipse key={a} cx={4.5*Math.cos(r)} cy={4.5*Math.sin(r)} rx="2.2" ry="4"
            fill="#d4a017" opacity="0.68" transform={`rotate(${a+90},${4.5*Math.cos(r)},${4.5*Math.sin(r)})`}/>
        );})}
        <circle cx="0" cy="0" r="2" fill="#ffcc33" opacity="0.88"/>
      </g>
      <path d="M17 8L20 4.5L23 8L20 11.5Z" fill="#d4a017" opacity="0.72"/>
      <line x1="23" y1="8" x2="28" y2="8" stroke="#c9971c" strokeWidth="0.8" opacity="0.58"/>
      <path d="M28 8L31 4.5L34 8L31 11.5Z" fill="#ffcc33" opacity="0.82"/>
      <line x1="34" y1="8" x2="39" y2="8" stroke="#c9971c" strokeWidth="0.8" opacity="0.58"/>
      <path d="M39 8L42 4.5L45 8L42 11.5Z" fill="#ffcc33" opacity="0.85"/>
      <line x1="45" y1="8" x2="50" y2="8" stroke="#c9971c" strokeWidth="0.8" opacity="0.58"/>
      <path d="M50 8L53 4.5L56 8L53 11.5Z" fill="#d4a017" opacity="0.72"/>
      <g transform="translate(71,8)">
        {[0,60,120,180,240,300].map(a => { const r=a*Math.PI/180; return (
          <ellipse key={a} cx={4.5*Math.cos(r)} cy={4.5*Math.sin(r)} rx="2.2" ry="4"
            fill="#d4a017" opacity="0.68" transform={`rotate(${a+90},${4.5*Math.cos(r)},${4.5*Math.sin(r)})`}/>
        );})}
        <circle cx="0" cy="0" r="2" fill="#ffcc33" opacity="0.88"/>
      </g>
    </svg>
    <div style={{ flex:1, height:'1px',
      background:'linear-gradient(90deg,rgba(212,160,23,0.28),rgba(212,160,23,0.6) 20%,transparent)' }}/>
  </div>
);

/* ─── Mini Lotus for headings ────────────────────────────────── */
const HeadingLotus = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
    style={{ display:'inline-block', verticalAlign:'middle', marginRight:'6px', flexShrink:0 }}>
    <defs>
      <radialGradient id="hlGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#ffee99" stopOpacity="0.95"/>
        <stop offset="55%"  stopColor="#d4a017" stopOpacity="0.85"/>
        <stop offset="100%" stopColor="#8b6010" stopOpacity="0.35"/>
      </radialGradient>
    </defs>
    {[0,60,120,180,240,300].map(a => { const r=a*Math.PI/180; return (
      <ellipse key={a} cx={10+4.8*Math.cos(r)} cy={10+4.8*Math.sin(r)} rx="2.5" ry="4.5"
        fill="url(#hlGrad)" opacity="0.8" transform={`rotate(${a+90},${10+4.8*Math.cos(r)},${10+4.8*Math.sin(r)})`}/>
    );})}
    <circle cx="10" cy="10" r="2.8" fill="#ffcc33" opacity="0.95"/>
    <circle cx="10" cy="10" r="1.4" fill="#fff"    opacity="0.7"/>
  </svg>
);

/* ─── Section Header ─────────────────────────────────────────── */
const SectionHeader = ({ icon, title, compact = false }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'10px',
    marginBottom: compact ? '10px' : '14px', paddingBottom:'7px',
    borderBottom:`1px solid ${C.borderGoldF}` }}>
    <div style={{ width: compact ? 32 : 36, height: compact ? 32 : 36, flexShrink:0,
      background:'linear-gradient(135deg,rgba(160,28,28,0.82),rgba(90,8,8,0.58))',
      border:`1px solid ${C.borderGold}`, borderRadius:'8px',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize: compact ? '15px' : '17px',
      boxShadow:'0 0 10px rgba(212,160,23,0.18)' }}>
      {icon}
    </div>
    <div style={{ flex:1 }}>
      <div style={{ display:'flex', alignItems:'center' }}>
        <HeadingLotus />
        <h2 style={{ margin:0, fontSize: compact ? '13px' : '15px', fontWeight:'700',
          color: C.cream, lineHeight:1.3, letterSpacing:'0.16em',
          textTransform:'uppercase',
          fontFamily: FONT_CINZEL,
          textShadow:'0 0 14px rgba(212,160,23,0.35)' }}>
          {title}
        </h2>
      </div>
      <div style={{ height:'2px', width:'65px', marginTop:'4px',
        background:'linear-gradient(90deg,#ffcc33,#d4a017 55%,transparent)',
        borderRadius:'2px', boxShadow:'0 0 7px rgba(212,160,23,0.55)' }}/>
    </div>
  </div>
);

/* ─── Info Row ───────────────────────────────────────────────── */
const InfoRow = ({ label, value, fullWidth = false }) => {
  if (!value) return null;
  return (
    <div style={{ marginBottom:'11px', display:'flex', flexDirection:'column', gap:'2px',
      gridColumn: fullWidth ? '1/-1' : undefined }}>
      <span style={{ fontSize:'9px', textTransform:'uppercase',
        letterSpacing:'0.18em', color:'rgba(212,160,23,0.9)',
        fontWeight:'700', fontFamily: FONT_INTER, lineHeight:1.3 }}>
        {label}
      </span>
      <span style={{ fontSize:'12.5px', color: C.text, fontWeight:'500',
        fontFamily: FONT_INTER, lineHeight:'1.7', letterSpacing:'0.01em' }}>
        {value}
      </span>
    </div>
  );
};

/* ─── Section Card ───────────────────────────────────────────── */
const SectionCard = ({ children, style = {} }) => (
  <div className="pdf-section-card" style={{
    background: C.cardBg,
    border:`1px solid ${C.borderGoldF}`,
    borderRadius:'11px', padding:'14px 18px',
    marginBottom:'9px', position:'relative', overflow:'hidden',
    boxShadow:'0 4px 22px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.025)',
    pageBreakInside:'avoid', breakInside:'avoid',
    ...style,
  }}>
    {/* TL accent */}
    <div style={{ position:'absolute',top:0,left:0,width:30,height:30,
      borderTop:`1px solid ${C.borderGold}`,borderLeft:`1px solid ${C.borderGold}`,
      borderRadius:'11px 0 0 0',pointerEvents:'none' }}/>
    {/* BR accent */}
    <div style={{ position:'absolute',bottom:0,right:0,width:30,height:30,
      borderBottom:`1px solid ${C.borderGold}`,borderRight:`1px solid ${C.borderGold}`,
      borderRadius:'0 0 11px 0',pointerEvents:'none' }}/>
    {children}
  </div>
);

/* ─── Sub Label ──────────────────────────────────────────────── */
const SubLabel = ({ text }) => (
  <div style={{ fontSize:'9.5px', color:'rgba(212,160,23,0.85)',
    textTransform:'uppercase', letterSpacing:'0.15em',
    fontWeight:'700', marginBottom:'9px', lineHeight:1.4, fontFamily: FONT_INTER }}>
    {text}
  </div>
);

/* ─── Page Frame (Top/Bottom bars + inner borders) ───────────── */
const PageFrame = () => (
  <>
    <div style={{ position:'absolute',top:0,left:0,right:0,height:'3.5px',zIndex:5,
      background:'linear-gradient(90deg,transparent 0%,#8b6010 10%,#ffcc33 30%,#d4a017 50%,#ffcc33 70%,#8b6010 90%,transparent 100%)' }}/>
    <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'3.5px',zIndex:5,
      background:'linear-gradient(90deg,transparent 0%,#8b6010 10%,#ffcc33 30%,#d4a017 50%,#ffcc33 70%,#8b6010 90%,transparent 100%)' }}/>
    <div style={{ position:'absolute',inset:'6px',zIndex:4,pointerEvents:'none',
      border:`1px solid ${C.borderGold}`,borderRadius:'2px' }}/>
    <div style={{ position:'absolute',inset:'11px',zIndex:4,pointerEvents:'none',
      border:`1px solid ${C.borderGoldF}`,borderRadius:'2px' }}/>
  </>
);

/* ─── Page Header ────────────────────────────────────────────── */
const PageHeader = ({ name, isFirst, bio }) => (
  <div style={{
    background: C.headerBg,
    borderBottom:`1px solid ${C.borderGold}`,
    padding: isFirst ? '20px 30px 16px' : '12px 30px 10px',
    position:'relative', zIndex:5, textAlign:'center',
    WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
  }}>
    {/* Radial glow */}
    <div style={{ position:'absolute',inset:0,
      background:'radial-gradient(ellipse at center,rgba(212,160,23,0.07) 0%,transparent 72%)',
      pointerEvents:'none' }}/>

    {/* Ornament row */}
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',
      marginBottom: isFirst ? '9px' : '0', position:'relative',zIndex:1 }}>
      <div style={{ height:'1px',width:'50px',background:'linear-gradient(90deg,transparent,#c9971c)' }}/>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {[0,60,120,180,240,300].map(a => { const r=a*Math.PI/180; return (
          <ellipse key={a} cx={10+4*Math.cos(r)} cy={10+4*Math.sin(r)} rx="2" ry="4"
            fill="#d4a017" opacity="0.75" transform={`rotate(${a+90},${10+4*Math.cos(r)},${10+4*Math.sin(r)})`}/>
        );})}
        <circle cx="10" cy="10" r="2.5" fill="#ffcc33" opacity="0.95"/>
      </svg>
      {isFirst ? (
        <span style={{ color:'#d4a017', fontSize:'16px', letterSpacing:'9px', opacity:0.9 }}>✦ ❧ ✦</span>
      ) : (
        <span style={{ color:'rgba(212,160,23,0.72)', fontSize:'9px',
          letterSpacing:'0.3em', textTransform:'uppercase', fontFamily: FONT_INTER }}>
          ✦ {name || 'Biodata'} · Continued ✦
        </span>
      )}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {[0,60,120,180,240,300].map(a => { const r=a*Math.PI/180; return (
          <ellipse key={a} cx={10+4*Math.cos(r)} cy={10+4*Math.sin(r)} rx="2" ry="4"
            fill="#d4a017" opacity="0.75" transform={`rotate(${a+90},${10+4*Math.cos(r)},${10+4*Math.sin(r)})`}/>
        );})}
        <circle cx="10" cy="10" r="2.5" fill="#ffcc33" opacity="0.95"/>
      </svg>
      <div style={{ height:'1px',width:'50px',background:'linear-gradient(90deg,#c9971c,transparent)' }}/>
    </div>

    {isFirst && (
      <>
        {/* Main name */}
        <h1 style={{ margin:0,padding:'2px 0',
          fontSize:'34px', fontWeight:'600', letterSpacing:'0.24em',
          textTransform:'uppercase', color:'#ffffff', lineHeight:1.18,
          fontFamily: FONT_CINZEL,
          textShadow:'0 0 40px rgba(212,160,23,0.5),0 2px 8px rgba(0,0,0,0.5)',
          position:'relative', zIndex:1 }}>
          {name || 'Biodata'}
        </h1>

        {/* Tagline divider */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',
          gap:'8px', marginTop:'9px', position:'relative', zIndex:1 }}>
          <div style={{ height:'1px',flex:1,maxWidth:'75px',
            background:'linear-gradient(90deg,transparent,rgba(212,160,23,0.6))' }}/>
          <span style={{ color:'rgba(212,160,23,0.7)', fontSize:'8.5px',
            letterSpacing:'0.38em', textTransform:'uppercase', fontFamily: FONT_INTER }}>
            ✦ Marriage Biodata ✦
          </span>
          <div style={{ height:'1px',flex:1,maxWidth:'75px',
            background:'linear-gradient(90deg,rgba(212,160,23,0.6),transparent)' }}/>
        </div>

        {bio && (
          <p style={{ margin:'7px 0 0', fontSize:'11px',
            color:'rgba(240,232,216,0.6)', fontStyle:'italic', letterSpacing:'0.055em',
            fontFamily: FONT_CORMNT, position:'relative', zIndex:1, lineHeight:'1.6' }}>
            ❝ {bio.length > 100 ? bio.substring(0,100)+'…' : bio} ❞
          </p>
        )}
      </>
    )}
  </div>
);

/* ─── Page Footer ────────────────────────────────────────────── */
const PageFooter = ({ current, total }) => (
  <div style={{ position:'absolute',bottom:'8px',left:0,right:0,textAlign:'center',zIndex:5 }}>
    <div style={{ height:'1px',width:'55%',margin:'0 auto 5px',
      background:'linear-gradient(90deg,transparent,rgba(212,160,23,0.38),transparent)' }}/>
    <span style={{ fontSize:'8.5px', color:'rgba(212,160,23,0.4)',
      letterSpacing:'0.22em', textTransform:'uppercase', fontFamily: FONT_INTER }}>
      Page {current} of {total} · ✦ BioData ✦ · © {new Date().getFullYear()}
    </span>
  </div>
);

/* ─── A4 Page Shell ──────────────────────────────────────────── */
const A4Page = ({ children, name, bio, pageIdx = 0, totalPages = 2 }) => (
  <div className="pdf-page" style={{
    width:'100%', margin:'0 auto',
    background: C.pageBg, backgroundColor: C.pageBgSolid,
    color: C.text, position:'relative', overflow:'visible',
    fontFamily: FONT_INTER, boxSizing:'border-box',
    WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
  }}>
    <div className="print-fixed-bg">
      <PageFrame />
      <MandalaWatermark />

      <FloralCorner position="TL" uid={`pTL`} />
      <FloralCorner position="TR" uid={`pTR`} />
      <FloralCorner position="BL" uid={`pBL`} />
      <FloralCorner position="BR" uid={`pBR`} />
    </div>

    {/* Ambient glow blobs */}
    <div className="print-fixed-bg" style={{ position:'absolute',top:'20%',left:'30%',width:200,height:200,
      borderRadius:'50%',background:'radial-gradient(circle,rgba(212,160,23,0.05) 0%,transparent 70%)',
      pointerEvents:'none',zIndex:0 }}/>
    <div className="print-fixed-bg" style={{ position:'absolute',bottom:'20%',right:'20%',width:170,height:170,
      borderRadius:'50%',background:'radial-gradient(circle,rgba(150,18,18,0.055) 0%,transparent 70%)',
      pointerEvents:'none',zIndex:0 }}/>

    <PageHeader name={name} isFirst={true} bio={bio} />

    <div style={{ position:'relative', zIndex:5, padding:'20px 26px', paddingBottom:'42px' }}>
      {children}
    </div>

    <PageFooter current={pageIdx+1} total={totalPages} />
  </div>
);

/* ─── Premium Photo Frame ────────────────────────────────────── */
const PhotoFrame = ({ src, name, style = {} }) => {
  const initials = name
    ? name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0,2).toUpperCase()
    : '✦';

  return (
    <div style={{ position:'relative', width:'100%', ...style }}>
      {/* Outer glow */}
      <div style={{ position:'absolute',inset:'-8px',borderRadius:'20px',
        background:'radial-gradient(ellipse at center,rgba(212,160,23,0.18) 0%,transparent 70%)',
        pointerEvents:'none' }}/>
      {/* Border layers */}
      <div style={{ position:'absolute',inset:'-3px',
        border:`1px solid ${C.borderGoldS}`,borderRadius:'18px',pointerEvents:'none' }}/>
      <div style={{ position:'absolute',inset:'-1px',
        border:`1px solid ${C.borderGoldF}`,borderRadius:'16px',pointerEvents:'none' }}/>
      {/* Main frame */}
      <div style={{ width:'100%',borderRadius:'15px',overflow:'hidden',
        border:`2px solid rgba(212,160,23,0.52)`,
        background:'linear-gradient(135deg,#300000,#0e0000)',
        boxShadow:'0 10px 32px rgba(0,0,0,0.75)',
        position:'relative', aspectRatio:'3/4' }}>
        {/* Inner border */}
        <div style={{ position:'absolute',inset:'4px',
          border:`1px solid ${C.borderGoldF}`,borderRadius:'12px',
          zIndex:2,pointerEvents:'none' }}/>
        {src ? (
          <img src={src} alt={name||'Profile'} crossOrigin="anonymous"
            style={{ width:'100%',height:'100%',objectFit:'cover',
              objectPosition:'center top',display:'block' }}/>
        ) : (
          <div style={{ width:'100%',height:'100%',
            display:'flex',alignItems:'center',justifyContent:'center',
            background:'radial-gradient(circle at center,#3c0808 0%,#0c0000 100%)',
            fontSize:'52px',color:'rgba(212,160,23,0.7)',
            fontFamily: FONT_CINZEL,fontWeight:'700' }}>
            {initials}
          </div>
        )}
        {/* Vignette */}
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'35%',
          background:'linear-gradient(to top,rgba(8,0,0,0.78),transparent)',zIndex:1 }}/>
        {/* Corner marks */}
        {[['top','left'],['top','right']].map(([v,h],i) => (
          <div key={i} style={{ position:'absolute',[v]:5,[h]:5,width:16,height:16,zIndex:3,pointerEvents:'none' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ transform: h==='right' ? 'scaleX(-1)' : 'none' }}>
              <path d="M1 1L8 1" stroke="#d4a017" strokeWidth="1.3" strokeLinecap="round" opacity="0.62"/>
              <path d="M1 1L1 8" stroke="#d4a017" strokeWidth="1.3" strokeLinecap="round" opacity="0.62"/>
              <circle cx="1" cy="1" r="1.6" fill="#ffcc33" opacity="0.72"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── QR Code (inline SVG square) ───────────────────────────── */
const QRPlaceholder = ({ url }) => {
  // Simple visual QR placeholder (decorative, shows URL below)
  const size = 80;
  const cells = 9;
  const cellSize = (size - 10) / cells;
  // Static finder pattern + random-looking modules
  const pattern = [
    [1,1,1,1,1,1,1,0,0],
    [1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0],
  ];

  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'5px' }}>
      <div style={{ padding:'4px',background:'rgba(255,255,255,0.05)',
        border:`1px solid ${C.borderGold}`,borderRadius:'6px' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          {/* Background */}
          <rect width={size} height={size} fill="#0a0000"/>
          {/* QR pattern */}
          {pattern.map((row,ri) => row.map((cell,ci) => cell ? (
            <rect key={`${ri}-${ci}`}
              x={5 + ci*cellSize} y={5 + ri*cellSize}
              width={cellSize-0.5} height={cellSize-0.5}
              fill="#d4a017" opacity="0.85" rx="0.5"/>
          ) : null))}
        </svg>
      </div>
      <span style={{ fontSize:'7.5px',color:'rgba(212,160,23,0.6)',
        textTransform:'uppercase',letterSpacing:'0.1em', fontFamily: FONT_INTER,
        textAlign:'center',maxWidth:size,wordBreak:'break-all' }}>
        Scan to view profile
      </span>
    </div>
  );
};

/* ─── Photo Grid (up to 4 photos) ───────────────────────────── */
const PhotoGrid = ({ photos = [], mainPhoto = null }) => {
  const allPhotos = [mainPhoto, ...photos].filter(Boolean).slice(0,4);
  if (allPhotos.length <= 1) return null;

  const extra = allPhotos.slice(1); // max 3 extra

  return (
    <div style={{ marginTop:'14px' }}>
      <SectionHeader icon="📸" title="Photo Gallery" compact />
      <div style={{ display:'grid',
        gridTemplateColumns: extra.length >= 3 ? '1fr 1fr 1fr' : extra.length === 2 ? '1fr 1fr' : '1fr',
        gap:'8px' }}>
        {extra.map((photo,i) => (
          <div key={i} style={{ borderRadius:'8px', overflow:'hidden',
            border:`1px solid ${C.borderGold}`,
            aspectRatio:'4/5',
            boxShadow:'0 4px 14px rgba(0,0,0,0.6)' }}>
            <img src={photo} alt={`Photo ${i+2}`} crossOrigin="anonymous"
              style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block' }}/>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN TEMPLATE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const BiodataPDFTemplate = React.forwardRef(({ biodata }, ref) => {
  if (!biodata) return null;

  const { personalInfo={}, educationInfo={}, familyInfo={}, preferences={} } = biodata;

  /* ─── All photos ──────────────────────────────────────────── */
  const mainPhotoURL = biodata.photoURL || personalInfo.photoURL || null;
  const extraPhotos  = Array.isArray(biodata.photos)
    ? biodata.photos.map(p => p?.url || p).filter(Boolean)
    : [];

  /* ─── Personal Info ───────────────────────────────────────── */
  const {
    fullName, dob, height, weight, maritalStatus, city,
    religion, caste, gotra, zodiac, complexion, motherTongue,
  } = personalInfo;

  /* ─── Education & Profession ──────────────────────────────── */
  const {
    highestQualification, college, passingYear,
    occupation, employer, annualIncome, additionalQualification,
  } = educationInfo;

  /* ─── Family ──────────────────────────────────────────────── */
  const {
    fatherName, fatherOccupation, motherName, motherOccupation,
    siblings, nativePlace, familyType, familyStatus,
  } = familyInfo;

  /* ─── Preferences ─────────────────────────────────────────── */
  const {
    bio: rawBio, partnerExpectations, hobbies, preferredLocation,
    contactName, contactPhone, contactEmail,
  } = preferences;

  /* ─── Auto-generate bio if empty ─────────────────────────── */
  const bio = rawBio || generateBio({
    fullName, dob, height, occupation, city, religion, caste,
    hobbies, familyType,
  });

  /* ─── Sibling list normalizer ─────────────────────────────── */
  const siblingList = Array.isArray(siblings)
    ? siblings
    : typeof siblings==='string' && siblings
    ? [{ name:siblings, role:'' }]
    : [];

  /* ─── Section presence flags ──────────────────────────────── */
  const hasEdu    = !!(highestQualification||college||occupation||employer||annualIncome||passingYear||additionalQualification);
  const hasFamily = !!(fatherName||motherName||siblingList.length||nativePlace||familyType||familyStatus);
  const hasPref   = !!(partnerExpectations||hobbies||preferredLocation);
  const hasContact= !!(contactName||contactPhone||contactEmail);

  const totalPages = 2;

  /* ─── Page 1: Hero two-column + About Me ─────────────────── */
  const Page1Content = () => (
    <>
      {/* Hero: left info + right photo */}
      <div style={{ display:'flex', gap:0, marginBottom:'14px' }}>

        {/* LEFT column — Personal Info */}
        <div style={{ flex:'1 1 56%', paddingRight:'20px',
          borderRight:`1px solid ${C.borderGoldF}` }}>
          <SectionHeader icon="♦" title="Personal Information" compact />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 18px' }}>
            <InfoRow label="Full Name"      value={fullName}       />
            <InfoRow label="Date of Birth"  value={dob}            />
            <InfoRow label="Height"         value={height}         />
            <InfoRow label="Weight"         value={weight}         />
            <InfoRow label="Marital Status" value={maritalStatus}  />
            <InfoRow label="Religion"       value={religion}       />
            <InfoRow label="Caste"          value={caste}          />
            <InfoRow label="Gotra"          value={gotra}          />
            <InfoRow label="Zodiac Sign"    value={zodiac}         />
            <InfoRow label="Complexion"     value={complexion}     />
            <InfoRow label="Mother Tongue"  value={motherTongue}   />
            <InfoRow label="Current City"   value={city}           />
            {nativePlace && !hasFamily && <InfoRow label="Native Place" value={nativePlace} />}
          </div>

          {/* Quick education summary */}
          {(highestQualification||occupation) && (
            <>
              <FloralDivider style={{ margin:'8px 0' }}/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 18px' }}>
                <InfoRow label="Education"    value={highestQualification} />
                <InfoRow label="Occupation"   value={occupation}            />
                <InfoRow label="Employer"     value={employer}              />
                <InfoRow label="Annual Income" value={annualIncome}         />
              </div>
            </>
          )}

          {/* Quick contact */}
          {(contactName||contactPhone) && (
            <>
              <FloralDivider style={{ margin:'8px 0' }}/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 18px' }}>
                <InfoRow label="Contact Person" value={contactName} />
                <InfoRow label="Phone"          value={contactPhone}/>
                {contactEmail && <InfoRow label="Email" value={contactEmail} fullWidth />}
              </div>
            </>
          )}
        </div>

        {/* RIGHT column — Photo + zodiac */}
        <div style={{ flex:'0 0 41%', paddingLeft:'20px',
          display:'flex', flexDirection:'column', alignItems:'center' }}>
          <PhotoFrame src={mainPhotoURL} name={fullName} style={{ maxWidth:'178px' }} />

          <div style={{ marginTop:'12px', textAlign:'center', width:'100%', maxWidth:'178px' }}>
            <FloralDivider style={{ margin:'0 0 8px' }}/>
            {zodiac && (
              <div style={{ fontSize:'12px', color:'rgba(212,160,23,0.88)',
                letterSpacing:'0.12em', marginBottom:'3px',
                fontFamily: FONT_CORMNT, fontStyle:'italic', lineHeight:1.5 }}>
                ✦ {zodiac} ✦
              </div>
            )}
            {religion && (
              <div style={{ fontSize:'11px', color: C.textDim,
                letterSpacing:'0.05em', lineHeight:1.5 }}>
                {religion}{caste ? ` · ${caste}` : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Me */}
      {bio && (
        <>
          <FloralDivider style={{ margin:'4px 0 12px' }}/>
          <SectionCard>
            <SectionHeader icon="★" title="About Me" compact />
            <p style={{ margin:0, fontSize:'13px', color:'rgba(245,237,220,0.9)',
              lineHeight:'1.95', fontFamily: FONT_CORMNT,
              fontStyle:'italic', letterSpacing:'0.035em' }}>
              {bio}
            </p>
          </SectionCard>
        </>
      )}
    </>
  );

  /* ─── Page 2: Detailed sections ──────────────────────────── */
  const Page2Content = () => (
    <>
      {/* Education & Profession */}
      {hasEdu && (
        <SectionCard>
          <SectionHeader icon="🎓" title="Education & Profession" compact />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 24px' }}>
            <div>
              <SubLabel text="Academic Background" />
              <div style={{ paddingLeft:'9px', borderLeft:`2px solid rgba(212,160,23,0.25)` }}>
                <InfoRow label="Highest Qualification"   value={highestQualification}     />
                <InfoRow label="College / University"    value={college}                  />
                <InfoRow label="Passing Year"            value={passingYear}              />
                <InfoRow label="Additional Qualification" value={additionalQualification} />
              </div>
            </div>
            <div>
              <SubLabel text="Professional Details" />
              <div style={{ paddingLeft:'9px', borderLeft:`2px solid rgba(212,160,23,0.25)` }}>
                <InfoRow label="Occupation"    value={occupation}    />
                <InfoRow label="Employer"      value={employer}      />
                <InfoRow label="Annual Income" value={annualIncome}  />
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Family Background */}
      {hasFamily && (
        <SectionCard>
          <SectionHeader icon="👨‍👩‍👧‍👦" title="Family Background" compact />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 24px' }}>
            <div>
              {fatherName && (
                <div style={{ paddingBottom:'10px', borderBottom:`1px solid rgba(212,160,23,0.12)`, marginBottom:'10px' }}>
                  <InfoRow label="Father's Name"        value={fatherName}       />
                  {fatherOccupation && <InfoRow label="Father's Occupation" value={fatherOccupation} />}
                </div>
              )}
              {motherName && (
                <div style={{ paddingBottom:'10px', borderBottom:`1px solid rgba(212,160,23,0.12)`, marginBottom:'10px' }}>
                  <InfoRow label="Mother's Name"        value={motherName}       />
                  {motherOccupation && <InfoRow label="Mother's Occupation" value={motherOccupation} />}
                </div>
              )}
              {siblingList.map((s,i) => (
                <InfoRow key={i}
                  label={`Sibling${siblingList.length > 1 ? ' '+(i+1) : ''}`}
                  value={s.name+(s.role?` (${s.role})`:'')} />
              ))}
            </div>
            <div>
              <InfoRow label="Native Place"  value={nativePlace}  />
              <InfoRow label="Family Type"   value={familyType}   />
              <InfoRow label="Family Status" value={familyStatus} />
            </div>
          </div>
        </SectionCard>
      )}

      {/* Preferences & Interests */}
      {hasPref && (
        <SectionCard>
          <SectionHeader icon="♥" title="Preferences & Interests" compact />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 24px' }}>
            <div>
              {partnerExpectations && (
                <div style={{ marginBottom:'10px' }}>
                  <SubLabel text="Partner Expectations" />
                  <p style={{ margin:0, fontSize:'12.5px', color: C.text, lineHeight:'1.82', letterSpacing:'0.01em' }}>
                    {partnerExpectations}
                  </p>
                </div>
              )}
              {preferredLocation && <InfoRow label="Preferred Location" value={preferredLocation} />}
            </div>
            <div>
              {hobbies && (
                <>
                  <SubLabel text="Hobbies & Interests" />
                  <p style={{ margin:0, fontSize:'12.5px', color: C.text, lineHeight:'1.82', letterSpacing:'0.01em' }}>
                    {Array.isArray(hobbies) ? hobbies.join(', ') : hobbies}
                  </p>
                </>
              )}
            </div>
          </div>
        </SectionCard>
      )}

      {/* Contact + QR Code */}
      {hasContact && (
        <SectionCard>
          <SectionHeader icon="📞" title="Contact Information" compact />
          <div style={{ display:'flex', gap:'20px', alignItems:'flex-start' }}>
            <div style={{ flex:1, display:'grid',
              gridTemplateColumns: contactEmail ? '1fr 1fr' : '1fr 1fr',
              gap:'0 20px' }}>
              <InfoRow label="Contact Person" value={contactName}  />
              <InfoRow label="Phone Number"   value={contactPhone} />
              {contactEmail && <InfoRow label="Email Address" value={contactEmail} fullWidth />}
            </div>
            {/* QR Code */}
            <QRPlaceholder url={typeof window !== 'undefined' ? window.location.href : ''} />
          </div>
        </SectionCard>
      )}

      {/* Photo Gallery (extra photos) */}
      {extraPhotos.length > 0 && (
        <SectionCard>
          <PhotoGrid photos={extraPhotos} mainPhoto={mainPhotoURL} />
        </SectionCard>
      )}

      {/* Elegant closing */}
      <div style={{
        textAlign:'center', padding:'11px 22px', marginTop:'4px',
        background:'linear-gradient(135deg,rgba(48,7,7,0.62),rgba(22,3,3,0.45))',
        border:`1px solid ${C.borderGoldF}`, borderRadius:'11px',
        position:'relative', overflow:'hidden',
        pageBreakInside:'avoid', breakInside:'avoid',
      }}>
        <FloralDivider style={{ marginBottom:'10px' }}/>
        <p style={{ margin:'0', fontSize:'12.5px', color:'rgba(245,237,220,0.65)',
          fontStyle:'italic', letterSpacing:'0.05em',
          fontFamily: FONT_CORMNT, lineHeight:'1.8' }}>
          "Looking for an auspicious alliance built on mutual respect, love, and shared values."
        </p>
        <FloralDivider style={{ marginTop:'10px' }}/>
      </div>
    </>
  );

  return (
    <div ref={ref} id="biodata-pdf-root" className="print-container pdf-render-container"
      style={{ background:'#0a0000', WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
      
      <A4Page name={fullName} bio={bio}>
        <Page1Content />
        <Page2Content />
      </A4Page>

    </div>
  );
});

BiodataPDFTemplate.displayName = 'BiodataPDFTemplate';
export default BiodataPDFTemplate;
