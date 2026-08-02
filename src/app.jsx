import { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

let lenis = null;
const scrollToEl = (el, offset = -80) => {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.1 });
  else window.scrollTo({ top: el.offsetTop + offset, behavior: REDUCED ? 'auto' : 'smooth' });
};

const NAVS = ['Home', 'About', 'Works', 'Strengths', 'Achievements', 'FAQ'];

const HOBBIES = [
  {
    name: 'AI Development',
    kana: 'AI開発',
    body: '新しいAPIやモデルを触りながら、日常の小さな不便を解くツールを作るのが好きです。',
    note: 'prototype / prompt / automation',
    tape: '#7FD0FF',
    icon: 'uploads/43_ai_technology_brain_icon.png',
  },
  {
    name: 'Football',
    kana: 'サッカー',
    body: '小学校から高校まで続けてきた原点。チームで考え、走り、流れを変える感覚が今の開発にもつながっています。特に諦めない姿勢は、どんな難題にも挑む原動力になっています。',
    note: 'teamwork / tactics / persistence',
    tape: '#D8F24B',
    icon: 'uploads/44_soccer_icon.png',
  },
  {
    name: 'Breakfast Tour',
    kana: '朝ごはん屋さんめぐり',
    body: '朝活という習慣を大切にするため最近特にはまっています。空間や人柄などが特に顕著に反映されているため、新しい視点やアイデアを得るのに最適な趣味です。',
    note: 'morning routine / atmosphere / inspiration',
    tape: '#FFB84D',
    icon: 'uploads/52_breakfast_tour_icon.png',
  },
];

const FEATURED_GAMES = [
  {
    name: 'Arknights',
    label: 'Tactical Tower Defense',
    body: 'リリースから継続して遊んでいるタイトル。戦術性の高いタワーディフェンスで、限られた手札から最適解を組み立てる柔軟な思考を養ってくれました。',
    note: 'strategy / planning / adaptation',
    icon: 'uploads/game_arknights_icon.png',
    url: 'https://www.arknights.global/',
  },
  {
    name: 'Endfield',
    label: 'Open World Factory',
    body: '最新のオープンワールドの中でも、工業を軸に自分だけの生産ラインを確立していくところに惹かれています。考えた構造が形になる感覚が魅力です。',
    note: 'factory / systems / optimization',
    icon: 'uploads/game_endfield_icon.webp',
    url: 'https://endfield.gryphline.com/en-us',
  },
  {
    name: 'League of Legends',
    label: 'MOBA Team Game',
    body: '高い拡張性とチームゲームを要求されるMOBA。知識や経験を積むほど見えるものが増え、判断の精度を上げていく過程が面白いゲームです。',
    note: 'knowledge / teamwork / macro',
    icon: 'uploads/game_lol_icon.svg',
    url: 'https://www.leagueoflegends.com/en-us/',
  },
  {
    name: 'Valorant',
    label: 'Tactical Shooter',
    body: 'サバイバルゲームが好きな自分にとって、オンライン上でタクティカルシューティングを味わえるゲーム性が好きです。連携と読み合いの密度に惹かれています。',
    note: 'communication / tactics / focus',
    icon: 'uploads/game_valorant_icon.png',
    url: 'https://playvalorant.com/en-us/',
  },
  {
    name: 'Street Fighter 6',
    label: 'Fighting Game',
    body: '自分自身と向き合い、相手の動作に対応しながら、練習したコマンドを入力して相手を倒す格闘ゲームの要素に最近はまっています。',
    note: 'practice / reaction / execution',
    icon: 'uploads/game_sf6_icon.webp',
    url: 'https://www.streetfighter.com/6/',
  },
];

const WORKS = [
  {
    title: 'EduCompass',
    tags: ['AI', 'Education', 'Data Analysis'],
    desc: '生徒の学習データをAIで分析し、成長予測やクラス編成をサポートする教師補助ツール。',
    tape: '#7C5CFF',
    image: 'uploads/work_Educompass.webp',
  },
  {
    title: '研究室用語ライブラリ',
    tags: ['Static HTML', 'WebDAV', 'Glossary'],
    desc: '研究室で使う専門用語をタグで整理して引ける、軽量な用語集アプリ。',
    tape: '#22C1C3',
    url: 'https://nomex2.github.io/product/lab-glossary/',
    image: 'uploads/work_lab_glossary.webp',
  },
  {
    title: 'Portfolio Site',
    tags: ['Portfolio', 'React', 'UI Design'],
    desc: '自己紹介や制作実績をまとめた、見せ方と動きにこだわったポートフォリオ。',
    tape: '#FFB84D',
    url: 'https://nomex2.github.io/product/',
    image: 'uploads/work_portfolio_site.webp',
  },
  {
    title: 'Secure Quest',
    tags: ['React', 'Vite', 'Flask', 'SQLite'],
    desc: '毎日のクエスト形式でサイバーセキュリティを学べる学習アプリ。',
    tape: '#FF5D8F',
    image: 'uploads/work_secure_quest.webp',
  },
  {
    title: '残響回廊 -ECHO CORRIDOR-',
    tags: ['ARG', 'Web', 'Mystery'],
    desc: '架空の大学サイトを舞台に、失踪した研究者の痕跡を辿る体験型の謎解きゲーム(ARG)。',
    tape: '#D8F24B',
    url: 'https://note.com/nomex2/n/n5d20687cf94c',
    image: 'uploads/work_echo_corridor.webp',
  },
];

const STRENGTHS = [
  { icon: 'uploads/45_idea_bulb_icon.png', name: '課題解決力', en: 'Problem Solving', tape: '#FF5D8F', desc: '多面的な視点で課題を整理し、技術とデザインを組み合わせて考える力を磨いています。' },
  { icon: 'uploads/47_programming_code_icon.png', name: '技術力', en: 'Technology', tape: '#7C5CFF', desc: 'AI・Web開発を中心に、最新技術を素早くキャッチアップし実装できる力があります。' },
  { icon: 'uploads/48_teamwork_icon.png', name: 'チームワーク', en: 'Teamwork', tape: '#22C1C3', desc: 'サッカーで培った協調性とコミュニケーション力で、チームを前進させることができます。' },
  { icon: 'uploads/46_goal_growth_target_icon.png', name: '継続力', en: 'Persistence', tape: '#FFB84D', desc: '目標に向かって粘り強く取り組み、成果を出すことにこだわり続けることができます。' },
];

const FAQS = [
  { q: '現在はインターン中ですか？', a: '研究室活動をメインにしているため、インターンは行っていません。業務委託契約先にてオンラインでの調査業務に携わっています。' },
  { q: '得意な技術分野は何ですか？', a: 'React/TypeScript、Next.js、Python（AI）を中心に開発しています。UI設計からバックエンドまでフルスタックに対応できます。' },
  { q: 'チームでの開発経験はありますか？', a: 'はい、複数のチーム開発プロジェクトに携わった経験があります。Figmaでのデザイン考案から実装まで、単純な悩みから複雑な問題まで対応可能です。' },
  { q: '副業やインターンなどについて詳しく教えてください。', a: 'Web制作、アプリ開発、AIツール開発など自身の成長につながるものは幅広くお受けしています。まずはメールまたはSNSでお気軽にご相談ください。' },
];

/* ── motion utilities ───────────────────────────── */

function useReveal(deps) {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    if (REDUCED) { els.forEach(el => el.classList.add('on')); return; }
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, deps);
}

// gentle parallax drift for scrapbook decorations
function useDrift(selector) {
  useEffect(() => {
    if (REDUCED) return;
    const els = gsap.utils.toArray(selector);
    const tweens = els.map((el, i) => gsap.to(el, {
      y: (i % 2 === 0 ? -40 : 40),
      rotation: `+=${i % 2 === 0 ? 6 : -6}`,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    }));
    return () => tweens.forEach(t => { t.scrollTrigger?.kill(); t.kill(); });
  }, []);
}

// scroll-triggered choreography: headings rise, cards fly in, tape rotates, photos parallax
function useScrollChoreo(deps) {
  useEffect(() => {
    if (REDUCED) return;
    const ctx = gsap.context(() => {
      // section headings pop up
      gsap.utils.toArray('.sec-head').forEach(el => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        });
      });
      // cards slide in from alternating sides + settle rotation
      gsap.utils.toArray('.work-card, .str-card, .ach-card, .hobby-card, .game-card').forEach((el, i) => {
        gsap.from(el, {
          x: i % 2 === 0 ? -70 : 70, y: 40, opacity: 0, rotation: i % 2 === 0 ? -8 : 8,
          duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
      // tape strips rotate-in like being stuck down
      gsap.utils.toArray('.tape').forEach(el => {
        gsap.from(el, {
          scaleX: 0, rotation: '-=25', opacity: 0, transformOrigin: 'left center',
          duration: 0.5, ease: 'back.out(2)',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        });
      });
      // polaroid / note cards parallax drift
      gsap.utils.toArray('.polaroid, .note-card, .contact-card').forEach((el, i) => {
        gsap.fromTo(el, { y: 40 }, {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      // photo inside polaroid subtle zoom parallax
      gsap.utils.toArray('.polaroid-img img, .wc-thumb img').forEach(el => {
        gsap.fromTo(el, { scale: 1.12, yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      // section title accent underline sweeps
      gsap.utils.toArray('.hero-title .hl, .contact-title .hl').forEach(el => {
        gsap.from(el, {
          '--hlw': '0%', duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, deps);
}

function Magnetic({ children, strength = 0.28 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (REDUCED || !FINE_POINTER) return;
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    const move = e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, [strength]);
  return <span className="magnet" ref={ref}>{children}</span>;
}

function CountUp({ value, duration = 1400 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(REDUCED ? value : 0);
  useEffect(() => {
    if (REDUCED) return;
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const started = performance.now();
      const step = now => {
        const t = Math.min(1, (now - started) / duration);
        setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [value, duration]);
  return <span ref={ref}>{display}</span>;
}

// a strip of tape
function Tape({ color = '#FFD23F', className = '', style }) {
  return <span className={`tape ${className}`} aria-hidden="true" style={{ '--tape': color, ...style }} />;
}

/* ── chrome ─────────────────────────────────────── */

function Nav({ active, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = id => { onNavigate(id); setMenuOpen(false); };
  return (
    <>
      <nav className="nav">
        <button className="nav-logo" type="button" onClick={() => go('home')}>Ryo<span>.</span>S</button>
        <div className="nav-links">
          {NAVS.map(n => (
            <button key={n} type="button" className={`nav-link${active === n.toLowerCase() ? ' on' : ''}`} onClick={() => go(n.toLowerCase())}>{n}</button>
          ))}
        </div>
        <div className="nav-right">
          <button className="nav-cta" type="button" onClick={() => go('contact')}>Contact →</button>
          <button className={`ham${menuOpen ? ' open' : ''}`} type="button" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        {NAVS.map(n => <button key={n} type="button" className="nav-link" onClick={() => go(n.toLowerCase())}>{n}</button>)}
        <button className="nav-cta" type="button" onClick={() => go('contact')}>Contact →</button>
      </div>
    </>
  );
}

function SectionTitle({ no, en, jp }) {
  return (
    <div className="sec-head">
      <span className="sec-no">{no}</span>
      <h2 className="sec-title">{en}<span className="dot">.</span></h2>
      <span className="sec-jp">{jp}</span>
    </div>
  );
}

/* ── hero ───────────────────────────────────────── */

function HeroLogoGate({ onUnlock }) {
  const gateRef = useRef(null);
  const visualRef = useRef(null);
  const orbitRef = useRef(null);
  const draggingRef = useRef(false);
  const lastAngleRef = useRef(null);
  const traceRef = useRef(0);
  const visualTraceRef = useRef(0);
  const waterRef = useRef(0);
  const renderFrameRef = useRef(null);
  const returnFrameRef = useRef(null);
  const returningRef = useRef(false);
  const touchActiveRef = useRef(false);
  const [opening, setOpening] = useState(false);
  const [returning, setReturning] = useState(false);
  const [tracing, setTracing] = useState(false);
  const unlockAt = 340;

  const paintGate = () => {
    const progress = Math.min(1, visualTraceRef.current / unlockAt);
    const waterProgress = Math.min(1, waterRef.current / unlockAt);
    const el = visualRef.current;
    if (!el) return;
    el.style.setProperty('--water-scale', waterProgress);
    el.style.setProperty('--water-opacity', 0.08 + waterProgress * 0.82);
    orbitRef.current?.setAttribute('transform', `rotate(${progress * 360} 180 180)`);
  };

  const runVisualLoop = () => {
    if (renderFrameRef.current) return;
    const tick = () => {
      if (draggingRef.current) {
        visualTraceRef.current = traceRef.current;
      } else {
        const traceDiff = traceRef.current - visualTraceRef.current;
        visualTraceRef.current += traceDiff * 0.2;
        if (Math.abs(traceDiff) < 0.05) visualTraceRef.current = traceRef.current;
      }
      const waterDiff = visualTraceRef.current - waterRef.current;
      waterRef.current += waterDiff * 0.075;
      if (Math.abs(waterDiff) < 0.05) waterRef.current = visualTraceRef.current;
      paintGate();
      const stillMoving =
        draggingRef.current || returningRef.current ||
        Math.abs(traceRef.current - visualTraceRef.current) > 0.05 ||
        Math.abs(visualTraceRef.current - waterRef.current) > 0.05;
      if (stillMoving) renderFrameRef.current = requestAnimationFrame(tick);
      else renderFrameRef.current = null;
    };
    renderFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    paintGate();
    return () => {
      if (renderFrameRef.current) cancelAnimationFrame(renderFrameRef.current);
      if (returnFrameRef.current) cancelAnimationFrame(returnFrameRef.current);
    };
  }, []);

  const pointFromEvent = e => {
    const touch = e.touches?.[0] || e.changedTouches?.[0];
    return touch || e;
  };
  const angleFromEvent = e => {
    const rect = gateRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const point = pointFromEvent(e);
    const x = point.clientX - (rect.left + rect.width / 2);
    const y = point.clientY - (rect.top + rect.height / 2);
    return (Math.atan2(y, x) * 180 / Math.PI + 450) % 360;
  };
  const applyAngle = angle => {
    if (angle === null || lastAngleRef.current === null) return;
    let delta = angle - lastAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    if (delta > 0) traceRef.current = Math.min(unlockAt, traceRef.current + delta);
    else traceRef.current = Math.max(0, traceRef.current + delta * 0.35);
    lastAngleRef.current = angle;
  };
  const startTrace = e => {
    if (opening) return;
    if (returnFrameRef.current) cancelAnimationFrame(returnFrameRef.current);
    returnFrameRef.current = null;
    returningRef.current = false;
    setReturning(false);
    setTracing(true);
    traceRef.current = visualTraceRef.current;
    draggingRef.current = true;
    lastAngleRef.current = angleFromEvent(e);
    if (e.pointerId !== undefined && e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };
  const moveTrace = e => {
    if (!draggingRef.current) return;
    const nativeEvents = e.nativeEvent?.getCoalescedEvents?.() || [e.nativeEvent || e];
    nativeEvents.forEach(ev => applyAngle(angleFromEvent(ev)));
    runVisualLoop();
    if (traceRef.current >= unlockAt) {
      draggingRef.current = false;
      traceRef.current = unlockAt; visualTraceRef.current = unlockAt; waterRef.current = unlockAt;
      paintGate();
      orbitRef.current?.setAttribute('transform', 'rotate(380 180 180)');
      setTracing(false); setOpening(true);
      window.setTimeout(onUnlock, 520);
    }
  };
  const returnDial = () => {
    const startTraceValue = traceRef.current;
    const startWaterValue = waterRef.current;
    const duration = 1150 + Math.min(1, startTraceValue / unlockAt) * 650;
    const startedAt = performance.now();
    returningRef.current = true; setReturning(true); setTracing(false);
    const animate = time => {
      const t = Math.min(1, (time - startedAt) / duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const remaining = 1 - eased;
      traceRef.current = startTraceValue * remaining;
      waterRef.current = startWaterValue * remaining;
      runVisualLoop();
      if (t < 1) returnFrameRef.current = requestAnimationFrame(animate);
      else {
        traceRef.current = 0; visualTraceRef.current = 0; waterRef.current = 0;
        returnFrameRef.current = null; returningRef.current = false;
        paintGate(); setReturning(false);
      }
    };
    returnFrameRef.current = requestAnimationFrame(animate);
  };
  const endTrace = e => {
    draggingRef.current = false; lastAngleRef.current = null;
    if (e.pointerId !== undefined && e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!opening && traceRef.current < unlockAt) returnDial();
  };
  const hpStart = e => { if (touchActiveRef.current) return; startTrace(e); };
  const hpMove = e => { if (touchActiveRef.current) return; moveTrace(e); };
  const hpEnd = e => { if (touchActiveRef.current) return; endTrace(e); };
  const htStart = e => { touchActiveRef.current = true; e.preventDefault(); startTrace(e); };
  const htMove = e => { e.preventDefault(); moveTrace(e); };
  const htEnd = e => { endTrace(e); window.setTimeout(() => { touchActiveRef.current = false; }, 350); };
  const hmStart = e => { if (window.PointerEvent || touchActiveRef.current) return; startTrace(e); };
  const hmMove = e => { if (window.PointerEvent || touchActiveRef.current) return; moveTrace(e); };
  const hmEnd = e => { if (window.PointerEvent || touchActiveRef.current) return; endTrace(e); };

  return (
    <div className="hero-gate r d3">
      <button
        className={`logo-emblem${tracing ? ' tracing' : ''}${opening ? ' opening' : ''}${returning ? ' returning' : ''}`}
        type="button" ref={gateRef} aria-label="Circular logo entrance to hobbies"
        onPointerDown={hpStart} onPointerMove={hpMove} onPointerUp={hpEnd} onPointerCancel={hpEnd} onPointerLeave={hpEnd}
        onMouseDown={hmStart} onMouseMove={hmMove} onMouseUp={hmEnd} onMouseLeave={hmEnd}
        onTouchStart={htStart} onTouchMove={htMove} onTouchEnd={htEnd} onTouchCancel={htEnd}
      >
        <span className="logo-visual" ref={visualRef}>
          <span className="logo-water" aria-hidden="true"><span className="water-wave wave-a"></span><span className="water-wave wave-b"></span></span>
          <svg className="logo-orbit" viewBox="0 0 360 360" aria-hidden="true">
            <defs>
              <path id="heroTopArc" d="M 54 181 A 126 126 0 0 1 306 181" />
              <path id="heroBottomArc" d="M 306 181 A 126 126 0 0 1 54 181" />
            </defs>
            <circle className="orbit-guide" cx="180" cy="180" r="142" />
            <g className="orbit-copy" ref={orbitRef}>
              <text className="orbit-text orbit-top"><textPath href="#heroTopArc" xlinkHref="#heroTopArc" startOffset="50%" textAnchor="middle">Solve Tiny, Impact Daily.</textPath></text>
              <text className="orbit-text orbit-bottom"><textPath href="#heroBottomArc" xlinkHref="#heroBottomArc" startOffset="50%" textAnchor="middle">Build Smarter with AI.</textPath></text>
              <circle className="orbit-dot" cx="42" cy="180" r="5" />
              <circle className="orbit-dot" cx="318" cy="180" r="5" />
            </g>
            <g className="center-mark">
              <path d="M145 151 L181 143" />
              <path d="M145 151 L145 209 L180 224 L214 215 L214 189" />
              <rect x="183" y="162" width="18" height="18" rx="1.5" />
              <rect x="216" y="130" width="20" height="20" rx="1.5" />
              <rect className="pixel-accent" x="208" y="169" width="18" height="18" rx="1.5" />
              <rect className="pixel-accent soft" x="194" y="195" width="18" height="18" rx="1.5" />
            </g>
          </svg>
        </span>
        <span className="gate-hint" aria-hidden="true">turn me ↻</span>
      </button>
    </div>
  );
}

function Hero({ onSecretOpen }) {
  return (
    <section id="home" className="hero" data-label="Hero">
      <span className="paper-scrap s1" aria-hidden="true"></span>
      <span className="paper-scrap s2" aria-hidden="true"></span>
      <span className="doodle d-star" aria-hidden="true">✳</span>
      <span className="doodle d-spring" aria-hidden="true">
        <svg viewBox="0 0 120 40"><path d="M4 20 C 20 -6, 40 46, 56 20 S 92 -6, 116 20" /></svg>
      </span>
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="hero-badge r">
            <Tape color="#FF5D8F" className="t-badge" />👋 電気通信大学 情報理工学部 4年 — 関野 凌
          </span>
          <h1 className="hero-title r d1">Engineering<br /><span className="hl">The Future<span className="dot">.</span></span></h1>
          <p className="hero-lead r d2">テクノロジーで、日常の「あったらいいな」をカタチにする。AIを活用して、人の役に立つプロダクトを生み出すことに情熱を注いでいます。</p>
          <div className="hero-btns r d2">
            <Magnetic><button className="btn-p" onClick={() => scrollToEl(document.getElementById('about'))}>About Me →</button></Magnetic>
            <Magnetic><button className="btn-s" onClick={() => scrollToEl(document.getElementById('works'))}>View Works</button></Magnetic>
          </div>
        </div>
        <div className="hero-side">
          <HeroLogoGate onUnlock={onSecretOpen} />
          <span className="polaroid-note r d3">つくって、ためして、また挑む。<br /><b>Keep Challenging.</b></span>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">scroll ↓</div>
    </section>
  );
}

/* ── about ──────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="sec sec-about" data-label="About">
      <div className="w">
        <SectionTitle no="01" en="About" jp="自己紹介" />
        <div className="about-grid">
          <figure className="polaroid r d1">
            <Tape color="#7FD0FF" className="t-tl" />
            <div className="polaroid-img"><img src="uploads/03_about_image_blob_mask.webp" alt="関野凌のポートレート" loading="lazy" /></div>
            <figcaption>Ryo Sekino — 2026</figcaption>
          </figure>
          <div className="about-body r d1">
            <div className="note-card">
              <p>電気通信大学に通う4年生。小学校から高校までサッカーに取り組み、チームで上を目指すことを学びました。</p>
              <p>現在はAIやWebを活用したプロダクト開発を中心に、人の役に立つ「あったらいいな」を創造することを目指して取り組んでいます。</p>
            </div>
            <ul className="fact-list">
              {[['Name', '関野 凌 / Ryo Sekino'], ['University', '電気通信大学 情報理工学部'], ['Grade', '4年生'], ['Hometown', '神奈川県'], ['Focus', 'AI × Web プロダクト開発']].map(([k, v]) => (
                <li key={k}><span className="fk">{k}</span><span className="fv">{v}</span></li>
              ))}
            </ul>
            <a className="text-link" href="#contact" onClick={e => { e.preventDefault(); scrollToEl(document.getElementById('contact')); }}>もっと詳しく ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── works ──────────────────────────────────────── */

/* モバイルで横方向にゆっくり自動スクロールするマーキー (タッチ中は停止) */
function useMobileMarquee(ref, speed = 0.45) {
  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED) return;
    const mq = window.matchMedia('(max-width: 640px)');
    let raf = null, paused = false, resumeTimer = null, acc = 0;
    const step = () => {
      if (!paused && mq.matches && el.scrollWidth > el.clientWidth) {
        acc += speed;
        if (acc >= 1) { const px = Math.floor(acc); acc -= px; el.scrollLeft += px; }
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(step);
    };
    const pause = () => { paused = true; clearTimeout(resumeTimer); };
    const resume = () => { clearTimeout(resumeTimer); resumeTimer = setTimeout(() => { paused = false; }, 2200); };
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    el.addEventListener('pointerdown', pause);
    el.addEventListener('pointerup', resume);
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf); clearTimeout(resumeTimer);
      el.removeEventListener('touchstart', pause); el.removeEventListener('touchend', resume);
      el.removeEventListener('pointerdown', pause); el.removeEventListener('pointerup', resume);
    };
  }, []);
}

function WorkCard({ work, i }) {
  const url = work.url || work.image;
  const Tag = url ? 'a' : 'div';
  const [failed, setFailed] = useState(false);
  const showImg = work.image && !failed;
  return (
    <Tag
      className={`work-card${work.locked ? ' locked' : ''}`}
      href={url}
      target={work.url ? '_blank' : undefined}
      rel={work.url ? 'noopener noreferrer' : undefined}
      style={{ '--tape': work.tape, transitionDelay: `${(i % 3) * 0.08}s` }}
    >
      <Tape color={work.tape} className="t-card" />
      <div className="wc-thumb">
        {showImg
          ? <img src={work.image} alt={`${work.title} screenshot`} loading="lazy" onError={() => setFailed(true)} />
          : <div className="wc-ph"><span></span>{work.locked ? '🔒 Coming soon' : work.title}</div>}
      </div>
      <div className="wc-body">
        <div className="wc-tags">{work.tags.map(t => <span key={t} className="chip">{t}</span>)}</div>
        <h3 className="wc-title">{work.title}</h3>
        <p className="wc-desc">{work.desc}</p>
        {url && <span className="wc-open">{work.locked ? '準備中' : '開く →'}</span>}
      </div>
    </Tag>
  );
}

function Works() {
  const gridRef = useRef(null);
  useMobileMarquee(gridRef);
  return (
    <section id="works" className="sec sec-works" data-label="Works">
      <div className="w">
        <SectionTitle no="02" en="Works" jp="制作実績" />
        <p className="sec-intro r d1">個人開発を中心に、AIやWeb技術を活かしたプロダクトを制作しています。ユーザー視点を大切に、シンプルで価値あるものを目指しています。</p>
        <div className="work-grid" ref={gridRef}>
          {WORKS.map((w, i) => <WorkCard key={w.title} work={w} i={i} />)}
          {/* モバイルのループ用複製 (デスクトップでは非表示) */}
          <div className="work-dup" aria-hidden="true">
            {WORKS.map((w, i) => <WorkCard key={`dup-${w.title}`} work={w} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── strengths ──────────────────────────────────── */

function Strengths() {
  return (
    <section id="strengths" className="sec sec-strengths" data-label="Strengths">
      <span className="doodle d-star2" aria-hidden="true">✳</span>
      <div className="w">
        <SectionTitle no="03" en="Strengths" jp="強み" />
        <p className="sec-intro r d1">専門知識と技術開発力、そしてチームでのコミュニケーション力を活かして、困難なプロジェクトを前進させます。</p>
        <div className="str-grid">
          {STRENGTHS.map((s, i) => (
            <div key={s.en} className="str-card" style={{ '--tape': s.tape, transitionDelay: `${(i % 2) * 0.08}s` }}>
              <Tape color={s.tape} className="t-str" />
              <img className="str-icon" src={s.icon} alt="" loading="lazy" />
              <span className="str-en">{s.en}</span>
              <h3 className="str-name">{s.name}</h3>
              <p className="str-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── achievements ───────────────────────────────── */

function Achievements() {
  const stats = [
    { icon: 'uploads/47_programming_code_icon.png', label: 'ホワイトハッカーコンテスト入賞', value: 1, unit: '回', tape: '#FF5D8F' },
    { icon: 'uploads/50_development_laptop_icon.png', label: '個人プロジェクト開発数', value: 7, unit: '+', tape: '#7C5CFF' },
    { icon: 'uploads/48_teamwork_icon.png', label: '実環境実装実績', value: 1, unit: '件', tape: '#22C1C3' },
    { icon: 'uploads/51_ai_development_icon.png', label: 'AI駆動開発歴', value: 1, unit: '年', tape: '#FFB84D' },
  ];
  return (
    <section id="achievements" className="sec sec-ach" data-label="Achievements">
      <div className="w">
        <SectionTitle no="04" en="Achievements" jp="実績" />
        <div className="ach-grid">
          {stats.map((s, i) => (
            <div key={i} className="ach-card" style={{ '--tape': s.tape, transitionDelay: `${(i % 4) * 0.07}s` }}>
              <Tape color={s.tape} className="t-ach" />
              <img className="ach-icon" src={s.icon} alt="" loading="lazy" />
              <div className="ach-val"><CountUp value={s.value} /><span className="ach-unit">{s.unit}</span></div>
              <div className="ach-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── faq ────────────────────────────────────────── */

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="sec sec-faq" data-label="FAQ">
      <div className="w">
        <SectionTitle no="05" en="FAQ" jp="よくある質問" />
        <div className="faq-list r d1">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
              <button type="button" className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                <span className="faq-qmark">Q</span>
                <span className="faq-qt">{f.q}</span>
                <span className="faq-tog" aria-hidden="true">+</span>
              </button>
              <div className="faq-a-wrap"><div className="faq-a"><span className="faq-amark">A</span>{f.a}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── contact ────────────────────────────────────── */

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);
  const submit = e => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.msg}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=ry0.s3k1n0@gmail.com&su=${subject}&body=${body}`, '_blank', 'noopener,noreferrer');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', msg: '' });
  };
  return (
    <section id="contact" className="sec sec-contact" data-label="Contact">
      <span className="doodle d-spring2" aria-hidden="true">
        <svg viewBox="0 0 120 40"><path d="M4 20 C 20 -6, 40 46, 56 20 S 92 -6, 116 20" /></svg>
      </span>
      <div className="w">
        <div className="contact-card r">
          <Tape color="#FFD23F" className="t-ctop" />
          <div className="contact-grid">
            <div>
              <h2 className="contact-title">Let's Create<br /><span className="hl">Together<span className="dot">.</span></span></h2>
              <p className="contact-lead">お仕事の依頼・ご相談など、お気軽にご連絡ください。送信ボタンでメール作成画面が開きます。</p>
              <div className="contact-links">
                <a href="mailto:ry0.s3k1n0@gmail.com" className="c-link"><span>✉️</span>ry0.s3k1n0@gmail.com</a>
                <a href="https://github.com/Nomex2" target="_blank" rel="noopener noreferrer" className="c-link"><span>💻</span>github.com/Nomex2</a>
                <a href="https://x.com/Ryo_Sekino" target="_blank" rel="noopener noreferrer" className="c-link"><span>🐦</span>@Ryo_Sekino</a>
                <a href="https://www.instagram.com/nome_x2/" target="_blank" rel="noopener noreferrer" className="c-link"><span>📷</span>@nome_x2</a>
              </div>
            </div>
            <form className="c-form" onSubmit={submit}>
              <input className="c-input" placeholder="お名前" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="c-input" type="email" placeholder="メールアドレス" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              <textarea className="c-input" rows={4} placeholder="メッセージ" value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} required></textarea>
              <button type="submit" className="c-submit">{sent ? '送信画面を開きました ✓' : 'Send Message →'}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── hobbies (hidden) ───────────────────────────── */

function HobbiesPage({ onBack }) {
  return (
    <main className="hobby-page">
      <section className="sec sec-hobby-hero" data-label="Hobbies">
        <span className="doodle d-star" aria-hidden="true">✳</span>
        <div className="w">
          <span className="hero-badge r"><Tape color="#D8F24B" className="t-badge" />🔓 Secret room unlocked</span>
          <h1 className="hero-title r d1">Hobbies<span className="dot">.</span></h1>
          <p className="hero-lead r d2">技術の外側にある好きなことも、ものづくりの感性を育ててくれています。</p>
          <div className="hero-btns r d2">
            <Magnetic><button className="btn-p" onClick={() => onBack('home')}>← Back Home</button></Magnetic>
            <Magnetic><button className="btn-s" onClick={() => scrollToEl(document.getElementById('hobby-list'))}>Explore →</button></Magnetic>
          </div>
        </div>
      </section>
      <section id="hobby-list" className="sec sec-works">
        <div className="w">
          <SectionTitle no="★" en="What I Like" jp="好きなこと" />
          <div className="hobby-grid">
            {HOBBIES.map((h, i) => (
              <article className="hobby-card" key={h.name} style={{ '--tape': h.tape, transitionDelay: `${(i % 3) * 0.08}s` }}>
                <Tape color={h.tape} className="t-card" />
                <div className="hb-head"><img src={h.icon} alt="" className="hb-icon" loading="lazy" /><span className="hb-kana">{h.kana}</span></div>
                <h3 className="wc-title">{h.name}</h3>
                <p className="wc-desc">{h.body}</p>
                <p className="hb-note">{h.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="sec sec-strengths">
        <div className="w">
          <SectionTitle no="★" en="Games" jp="ゲーム" />
          <p className="sec-intro r d1">どのゲームも一辺倒で応用の利かないものではなく、現実で活きる要素を持っているため今も愛好しています。</p>
          <div className="game-grid">
            {FEATURED_GAMES.map((g, i) => (
              <a className="game-card" key={g.name} href={g.url} target="_blank" rel="noopener noreferrer" style={{ transitionDelay: `${(i % 5) * 0.06}s` }}>
                <div className="gc-head"><img src={g.icon} alt="" className="gc-icon" loading="lazy" /><span className="gc-no">{String(i + 1).padStart(2, '0')}</span></div>
                <span className="gc-label">{g.label}</span>
                <h3 className="gc-name">{g.name}</h3>
                <p className="gc-body">{g.body}</p>
                <p className="hb-note">{g.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── app ────────────────────────────────────────── */

function App() {
  const [active, setActive] = useState('home');
  const [view, setView] = useState(window.location.hash === '#hobbies' ? 'hobbies' : 'main');
  useReveal([view]);
  useDrift('.paper-scrap, .doodle');
  useScrollChoreo([view]);

  useEffect(() => {
    if (REDUCED) return;
    lenis = new Lenis({ autoRaf: false, lerp: 0.11 });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = time => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); lenis = null; };
  }, []);

  useEffect(() => {
    if (view === 'hobbies') { setActive('hobbies'); return undefined; }
    const ids = [...NAVS.map(s => s.toLowerCase()), 'contact'];
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    ScrollTrigger.refresh();
    return () => obs.disconnect();
  }, [view]);

  useEffect(() => {
    const syncHash = () => setView(window.location.hash === '#hobbies' ? 'hobbies' : 'main');
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => { window.removeEventListener('hashchange', syncHash); window.removeEventListener('popstate', syncHash); };
  }, []);

  const openHobbies = useCallback(() => {
    setView('hobbies'); setActive('hobbies');
    if (window.location.hash !== '#hobbies') window.history.pushState(null, '', '#hobbies');
    if (lenis) lenis.scrollTo(0, { immediate: true }); else window.scrollTo({ top: 0 });
  }, []);

  const navigateSection = useCallback(id => {
    if (window.location.hash === '#hobbies') {
      setView('main');
      window.history.pushState(null, '', window.location.pathname + window.location.search);
      window.setTimeout(() => scrollToEl(document.getElementById(id)), 80);
      return;
    }
    scrollToEl(document.getElementById(id));
  }, []);

  if (view === 'hobbies') {
    return (
      <>
        <Nav active="hobbies" onNavigate={navigateSection} />
        <HobbiesPage onBack={navigateSection} />
      </>
    );
  }

  return (
    <>
      <Nav active={active} onNavigate={navigateSection} />
      <Hero onSecretOpen={openHobbies} />
      <About />
      <Works />
      <Strengths />
      <Achievements />
      <FAQ />
      <Contact />
      <footer className="footer">
        <div className="w footer-i">
          <span className="footer-logo">Ryo.S</span>
          <span className="footer-txt">© 2026 Ryo.S — Keep Challenging.</span>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
