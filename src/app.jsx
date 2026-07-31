import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

let lenis = null;
const scrollToEl = (el, offset = -64) => {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
  else window.scrollTo({ top: el.offsetTop + offset, behavior: REDUCED ? 'auto' : 'smooth' });
};

const NAVS = ['Home', 'About', 'Works', 'Strengths', 'Achievements', 'FAQ'];
const PAPER_SECTIONS = ['works', 'achievements'];
const WORK_WINDOW_DOTS = ['#D65C3F', '#C8A24B', '#7B8E6E'];

const HOBBIES = [
  {
    name: 'AI Development',
    kana: 'AI開発',
    body: '新しいAPIやモデルを触りながら、日常の小さな不便を解くツールを作るのが好きです。',
    note: 'prototype / prompt / automation',
    color: '#D65C3F',
    icon: 'uploads/43_ai_technology_brain_icon.png',
  },
  {
    name: 'Football',
    kana: 'サッカー',
    body: '小学校から高校まで続けてきた原点。チームで考え、走り、流れを変える感覚が今の開発にもつながっています。特に諦めない姿勢は、どんな難題にも挑む原動力になっています。',
    note: 'teamwork / tactics / persistence',
    color: '#7B8E6E',
    icon: 'uploads/44_soccer_icon.png',
  },
  {
    name: 'Breakfast Tour',
    kana: '朝ごはん屋さんめぐり',
    body: '朝活という習慣を大切にするため最近特にはまっています。空間や人柄などが特に顕著に反映されているため、新しい視点やアイデアを得るのに最適な趣味です。',
    note: 'morning routine / atmosphere / inspiration',
    color: '#C8A24B',
    icon: 'uploads/52_breakfast_tour_icon.png',
  },
];

const FEATURED_GAMES = [
  {
    name: 'Arknights',
    label: 'Tactical Tower Defense',
    body: 'リリースから継続して遊んでいるタイトル。戦術性の高いタワーディフェンスで、限られた手札から最適解を組み立てる柔軟な思考を養ってくれました。',
    note: 'strategy / planning / adaptation',
    color: '#8A93A6',
    icon: 'uploads/game_arknights_icon.png',
    url: 'https://www.arknights.global/',
  },
  {
    name: 'Endfield',
    label: 'Open World Factory',
    body: '最新のオープンワールドの中でも、工業を軸に自分だけの生産ラインを確立していくところに惹かれています。考えた構造が形になる感覚が魅力です。',
    note: 'factory / systems / optimization',
    color: '#7B8E6E',
    icon: 'uploads/game_endfield_icon.webp',
    url: 'https://endfield.gryphline.com/en-us',
  },
  {
    name: 'League of Legends',
    label: 'MOBA Team Game',
    body: '高い拡張性とチームゲームを要求されるMOBA。知識や経験を積むほど見えるものが増え、判断の精度を上げていく過程が面白いゲームです。',
    note: 'knowledge / teamwork / macro',
    color: '#C8A24B',
    icon: 'uploads/game_lol_icon.svg',
    url: 'https://www.leagueoflegends.com/en-us/',
  },
  {
    name: 'Valorant',
    label: 'Tactical Shooter',
    body: 'サバイバルゲームが好きな自分にとって、オンライン上でタクティカルシューティングを味わえるゲーム性が好きです。連携と読み合いの密度に惹かれています。',
    note: 'communication / tactics / focus',
    color: '#D65C3F',
    icon: 'uploads/game_valorant_icon.png',
    url: 'https://playvalorant.com/en-us/',
  },
  {
    name: 'Street Fighter 6',
    label: 'Fighting Game',
    body: '自分自身と向き合い、相手の動作に対応しながら、練習したコマンドを入力して相手を倒す格闘ゲームの要素に最近はまっています。',
    note: 'practice / reaction / execution',
    color: '#B4885A',
    icon: 'uploads/game_sf6_icon.webp',
    url: 'https://www.streetfighter.com/6/',
  },
];

const WORKS = [
  {
    title: 'EduCompass',
    tags: ['AI', 'Education', 'Data Analysis'],
    desc: '生徒の課題解決能力や柔軟性などの数値データを用いてAI分析を行い、成長予測、クラス替え後の雰囲気推測、文部科学省の示す教育プロジェクト提案などを行う教師補助AIツール。',
    accent: '#D65C3F',
    image: 'uploads/work_Educompass.webp',
  },
  {
    title: '研究室用語ライブラリ',
    tags: ['Static HTML', 'WebDAV', 'Glossary'],
    desc: '研究室活動で出てきた用語を解説し、タグ分けして閲覧しやすくした静的HTMLアプリケーション。WEBDAV環境で動く軽量な用語ライブラリです。',
    accent: '#7B8E6E',
    url: 'https://nomex2.github.io/product/lab-glossary/',
    image: 'uploads/work_lab_glossary.webp',
  },
  {
    title: 'Portfolio Site',
    tags: ['Portfolio', 'React', 'UI Design'],
    desc: '自己紹介、制作実績、強み、趣味をまとめたポートフォリオサイト。見せ方や動きも含めて、自分らしさが伝わる構成を目指して構築しました。',
    accent: '#C8A24B',
    url: 'https://nomex2.github.io/product/',
    image: 'uploads/work_portfolio_site.webp',
  },
  {
    title: 'Secure Quest',
    tags: ['React', 'Vite', 'Flask', 'SQLite'],
    desc: 'セキュリティニュースを題材に、毎日クエスト形式でサイバーセキュリティを学べる学習アプリ。ログイン後にデイリークエストへ挑戦し、選択式の問題に回答してXPを獲得できます。レベル、ストリーク、過去クエストの確認機能もあります。',
    accent: '#8A93A6',
    image: 'uploads/work_secure_quest.webp',
  },
  {
    // TODO: ARG作品の正式なタイトル・URL・説明文・スクリーンショットに差し替え
    title: 'ARG Project',
    tags: ['ARG', 'Web', 'Puzzle'],
    desc: 'Web上で展開する代替現実ゲーム（ARG）。隠しページや暗号を辿りながら物語を解き明かす、体験型の謎解きプロジェクトです。詳細は近日公開。',
    accent: '#B4885A',
  },
];

const STRENGTHS = [
  { icon: 'uploads/45_idea_bulb_icon.png', name: '課題解決力', desc: '多面的な視点で課題を整理し、技術とデザインを組み合わせて考える力を磨いています。' },
  { icon: 'uploads/47_programming_code_icon.png', name: '技術力', desc: 'AI・Web開発を中心に、最新技術を素早くキャッチアップし実装できる力があります。' },
  { icon: 'uploads/48_teamwork_icon.png', name: 'チームワーク', desc: 'サッカーで培った協調性とコミュニケーション力で、チームを前進させることができます。' },
  { icon: 'uploads/46_goal_growth_target_icon.png', name: '継続力', desc: '目標に向かって粘り強く取り組み、成果を出すことにこだわり続けることができます。' },
];

const FAQS = [
  { q: 'Q. 現在はインターン中ですか？', a: '研究室活動をメインにしているため、インターンは行っていません。業務委託契約先にてオンラインでの調査業務に携わっています。' },
  { q: 'Q. 得意な技術分野は何ですか？', a: 'React/TypeScript、Next.js、Python（AI）を中心に開発しています。UI設計からバックエンドまでフルスタックに対応できます。' },
  { q: 'Q. チームでの開発経験はありますか？', a: 'はい、複数のチーム開発プロジェクトに携わった経験があります。Figmaでのデザイン考案から実装まで、単純な悩みから複雑な問題まで対応可能です。' },
  { q: 'Q. 副業やインターンなどについて詳しく教えてください。', a: 'Web制作、アプリ開発、AIツール開発など自身の成長につながるものは幅広くお受けしています。まずはメールまたはSNSでお気軽にご相談ください。' },
];

/* ── Motion utilities ────────────────────────────── */

function useReveal(deps) {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    if (REDUCED) { els.forEach(el => el.classList.add('on')); return; }
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, deps);
}

// Splits an (EN) heading into per-char spans that slide up when the parent `.r` gets `.on`.
// Chars are grouped per word (nowrap) so words never break mid-word; `dot` appends an accent period.
function SplitTitle({ text, dot }) {
  const words = text.split(' ');
  let ci = 0;
  return (
    <span className="split" aria-label={dot ? `${text}.` : text}>
      {words.map((word, wi) => {
        const last = wi === words.length - 1;
        return (
          <span key={wi}>
            <span className="word" aria-hidden="true">
              {[...word].map((c, i) => (
                <span key={i} className="char-mask">
                  <span className="char" style={{ transitionDelay: `${0.06 + (ci++) * 0.04}s` }}>{c}</span>
                </span>
              ))}
              {last && dot && (
                <span className="char-mask">
                  <span className="char tdot" style={{ transitionDelay: `${0.06 + (ci++) * 0.04}s` }}>.</span>
                </span>
              )}
            </span>
            {!last && '\u00A0'}
          </span>
        );
      })}
    </span>
  );
}

// Generative flow-field canvas for the hero background
function HeroCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    if (REDUCED) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, raf = null, running = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0D0D0E';
      ctx.fillRect(0, 0, w, h);
    };
    resize();

    const N = Math.min(420, Math.floor(w * h / 3600));
    const spawn = p => {
      p.x = Math.random() * w; p.y = Math.random() * h;
      p.px = p.x; p.py = p.y;
      p.life = 120 + Math.random() * 260;
      p.accent = Math.random() < 0.06;
      return p;
    };
    const parts = Array.from({ length: N }, () => spawn({}));
    let t = 0;

    const field = (x, y) =>
      (Math.sin(x * 0.0019 + t * 0.00042) + Math.cos(y * 0.0023 - t * 0.00031) + Math.sin((x + y) * 0.0008 + t * 0.0002)) * 1.35;

    const tick = () => {
      if (!running) { raf = null; return; }
      t += 1;
      ctx.fillStyle = 'rgba(13,13,14,0.055)';
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const p of parts) {
        const a = field(p.x, p.y);
        p.px = p.x; p.py = p.y;
        p.x += Math.cos(a) * 0.85;
        p.y += Math.sin(a) * 0.85;
        p.life -= 1;
        if (p.life <= 0 || p.x < -4 || p.x > w + 4 || p.y < -4 || p.y > h + 4) { spawn(p); continue; }
        ctx.strokeStyle = p.accent ? 'rgba(214,92,63,0.30)' : 'rgba(235,230,221,0.12)';
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };

    // pause when hero is offscreen
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running && !raf) raf = requestAnimationFrame(tick);
    }, { threshold: 0 });
    io.observe(canvas);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return <canvas className="hero-canvas" ref={ref} aria-hidden="true" />;
}

// Custom cursor (fine pointers only)
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (REDUCED || !FINE_POINTER) return;
    const dot = dotRef.current, ring = ringRef.current;
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    let shown = false;
    const move = e => {
      if (!shown) { shown = true; dot.style.opacity = 1; ring.style.opacity = 1; }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const hot = e.target.closest('a, button, .faq-q, .work-card');
      ring.classList.toggle('hot', !!hot);
    };
    const leave = () => { shown = false; dot.style.opacity = 0; ring.style.opacity = 0; };
    window.addEventListener('mousemove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);
  if (REDUCED || !FINE_POINTER) return null;
  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true"></div>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true"></div>
    </>
  );
}

// Magnetic hover for buttons
function Magnetic({ children, strength = 0.3 }) {
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

// Count-up number for Achievements
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
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(value * eased));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [value, duration]);
  return <span ref={ref}>{display}</span>;
}

/* ── Chrome ─────────────────────────────────────── */

function SiteLogo({ onClick }) {
  return (
    <button className="site-logo-btn" type="button" onClick={onClick} aria-label="Home">
      <span className="nav-logo">Ryo.S</span>
    </button>
  );
}

function Nav({ active, onNavigate }) {
  const paper = PAPER_SECTIONS.includes(active);
  const [menuOpen, setMenuOpen] = useState(false);
  const go = id => { onNavigate(id); setMenuOpen(false); };

  return (
    <>
      <nav className={`nav${paper ? ' paper' : ''}`}>
        <div className="nav-i">
          <SiteLogo onClick={() => go('home')} />
          <div className="nav-links">
            {NAVS.map(n => (
              <button key={n} type="button" className={`nav-link${active === n.toLowerCase() ? ' on' : ''}`} onClick={() => go(n.toLowerCase())}>{n}</button>
            ))}
          </div>
          <div className="nav-right">
            <button className="nav-btn" onClick={() => go('contact')}>Contact →</button>
            <button className={`ham${menuOpen ? ' open' : ''}`} type="button" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        {NAVS.map(n => (
          <button key={n} type="button" className="nav-link" onClick={() => go(n.toLowerCase())}>{n}</button>
        ))}
        <button className="nav-btn" onClick={() => go('contact')}>Contact →</button>
      </div>
    </>
  );
}

/* ── Hero logo gate (hidden room dial) ──────────── */

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
        draggingRef.current ||
        returningRef.current ||
        Math.abs(traceRef.current - visualTraceRef.current) > 0.05 ||
        Math.abs(visualTraceRef.current - waterRef.current) > 0.05;

      if (stillMoving) {
        renderFrameRef.current = requestAnimationFrame(tick);
      } else {
        renderFrameRef.current = null;
      }
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
    if (touch) return touch;
    return e;
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

    if (delta > 0) {
      traceRef.current = Math.min(unlockAt, traceRef.current + delta);
    } else {
      traceRef.current = Math.max(0, traceRef.current + delta * 0.35);
    }

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
    if (e.pointerId !== undefined && e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const moveTrace = e => {
    if (!draggingRef.current) return;
    const nativeEvents = e.nativeEvent?.getCoalescedEvents?.() || [e.nativeEvent || e];
    nativeEvents.forEach(ev => applyAngle(angleFromEvent(ev)));
    runVisualLoop();
    if (traceRef.current >= unlockAt) {
      draggingRef.current = false;
      traceRef.current = unlockAt;
      visualTraceRef.current = unlockAt;
      waterRef.current = unlockAt;
      paintGate();
      orbitRef.current?.setAttribute('transform', 'rotate(380 180 180)');
      setTracing(false);
      setOpening(true);
      window.setTimeout(onUnlock, 520);
    }
  };

  const returnDial = () => {
    const startTraceValue = traceRef.current;
    const startWaterValue = waterRef.current;
    const duration = 1150 + Math.min(1, startTraceValue / unlockAt) * 650;
    const startedAt = performance.now();
    returningRef.current = true;
    setReturning(true);
    setTracing(false);

    const animate = time => {
      const t = Math.min(1, (time - startedAt) / duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const remaining = 1 - eased;
      traceRef.current = startTraceValue * remaining;
      waterRef.current = startWaterValue * remaining;
      runVisualLoop();

      if (t < 1) {
        returnFrameRef.current = requestAnimationFrame(animate);
      } else {
        traceRef.current = 0;
        visualTraceRef.current = 0;
        waterRef.current = 0;
        returnFrameRef.current = null;
        returningRef.current = false;
        paintGate();
        setReturning(false);
      }
    };

    returnFrameRef.current = requestAnimationFrame(animate);
  };

  const endTrace = e => {
    draggingRef.current = false;
    lastAngleRef.current = null;
    if (e.pointerId !== undefined && e.currentTarget.releasePointerCapture) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (!opening && traceRef.current < unlockAt) {
      returnDial();
    }
  };

  const handlePointerStart = e => {
    if (touchActiveRef.current) return;
    startTrace(e);
  };

  const handlePointerMove = e => {
    if (touchActiveRef.current) return;
    moveTrace(e);
  };

  const handlePointerEnd = e => {
    if (touchActiveRef.current) return;
    endTrace(e);
  };

  const handleTouchStart = e => {
    touchActiveRef.current = true;
    e.preventDefault();
    startTrace(e);
  };

  const handleTouchMove = e => {
    e.preventDefault();
    moveTrace(e);
  };

  const handleTouchEnd = e => {
    endTrace(e);
    window.setTimeout(() => {
      touchActiveRef.current = false;
    }, 350);
  };

  const handleMouseStart = e => {
    if (window.PointerEvent || touchActiveRef.current) return;
    startTrace(e);
  };

  const handleMouseMove = e => {
    if (window.PointerEvent || touchActiveRef.current) return;
    moveTrace(e);
  };

  const handleMouseEnd = e => {
    if (window.PointerEvent || touchActiveRef.current) return;
    endTrace(e);
  };

  return (
    <div className="hero-logo-gate r d2">
      <button
        className={`logo-emblem${tracing ? ' tracing' : ''}${opening ? ' opening' : ''}${returning ? ' returning' : ''}`}
        type="button"
        ref={gateRef}
        aria-label="Circular logo entrance to hobbies"
        onPointerDown={handlePointerStart}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onMouseDown={handleMouseStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
        onMouseLeave={handleMouseEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <span className="logo-visual" ref={visualRef}>
          <span className="logo-water" aria-hidden="true">
            <span className="water-wave wave-a"></span>
            <span className="water-wave wave-b"></span>
          </span>
          <svg className="logo-orbit" viewBox="0 0 360 360" aria-hidden="true">
            <defs>
              <path id="heroTopArc" d="M 54 181 A 126 126 0 0 1 306 181" />
              <path id="heroBottomArc" d="M 306 181 A 126 126 0 0 1 54 181" />
            </defs>
            <circle className="orbit-guide" cx="180" cy="180" r="142" />
            <g className="orbit-copy" ref={orbitRef}>
              <text className="orbit-text orbit-top">
                <textPath href="#heroTopArc" xlinkHref="#heroTopArc" startOffset="50%" textAnchor="middle">Solve Tiny, Impact Daily.</textPath>
              </text>
              <text className="orbit-text orbit-bottom">
                <textPath href="#heroBottomArc" xlinkHref="#heroBottomArc" startOffset="50%" textAnchor="middle">Build Smarter with AI.</textPath>
              </text>
              <circle className="orbit-dot dot-left" cx="42" cy="180" r="5" />
              <circle className="orbit-dot dot-right" cx="318" cy="180" r="5" />
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
      </button>
    </div>
  );
}

/* ── Sections ───────────────────────────────────── */

function Hero({ onSecretOpen }) {
  const innerRef = useRef(null);
  useEffect(() => {
    if (REDUCED) return;
    const drift = gsap.to(innerRef.current, {
      yPercent: 10,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true },
    });
    return () => { drift.scrollTrigger?.kill(); drift.kill(); };
  }, []);
  return (
    <section id="home" className="hero" data-screen-label="Hero">
      <HeroCanvas />
      <div className="hero-i" ref={innerRef}>
        <div>
          <p className="hero-eyebrow r">Hello, I'm Ryo.S</p>
          <h1 className="hero-title r d1">
            <SplitTitle text="Engineering" /><br />
            <span className="accent"><SplitTitle text="The Future." /></span>
          </h1>
          <p className="hero-sub r d2">テクノロジーで、日常の「あったらいいな」をカタチにする。</p>
          <p className="hero-desc r d2">電気通信大学でIT分野を学ぶ4年生。</p>
          <p className="hero-desc r d2">AIテクノロジーを活用して、人の役に立つプロダクトを生み出すことに情熱を注いでいます。</p>
          <div className="hero-btns r d3">
            <Magnetic><button className="btn-p" onClick={() => scrollToEl(document.getElementById('about'))}>About Me →</button></Magnetic>
            <Magnetic><button className="btn-s" onClick={() => scrollToEl(document.getElementById('works'))}>View Works →</button></Magnetic>
          </div>
        </div>
        <div className="hero-right">
          <HeroLogoGate onUnlock={onSecretOpen} />
        </div>
      </div>
      <div className="scroll-ind">
        <div className="scroll-line"></div>
        <span className="scroll-txt">SCROLL</span>
      </div>
    </section>
  );
}

function About() {
  const photoRef = useRef(null);
  useEffect(() => {
    if (REDUCED) return;
    const tween = gsap.fromTo(photoRef.current, { yPercent: 8 }, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return (
    <section id="about" className="sec sec-dark" data-screen-label="About">
      <div className="w">
        <div className="about-grid">
          <div>
            <p className="sec-num r">01</p>
            <h2 className="sec-title r"><SplitTitle text="About" dot /></h2>
            <p className="sec-sub r">自己紹介</p>
            <p className="about-body r">電気通信大学に通う4年生。<br />小学校から高校までサッカーに取り組み、チームで上を目指すことを学びました。<br /><br />現在はAIやWebを活用したプロダクト開発を中心に、人の役に立つ「あったらいいな」を創造することを目指して取り組んでいます。</p>
            <div className="about-photo-wrap r">
              <img className="about-photo" ref={photoRef} src="uploads/03_about_image_blob_mask.webp" alt="関野凌のポートレート" loading="lazy" />
            </div>
            <a className="about-link-txt r" href="#contact" onClick={e => { e.preventDefault(); scrollToEl(document.getElementById('contact')); }}>More Details ↗</a>
          </div>
          <div>
            <div className="r">
              {[['Name', '関野 凌'], ['University', '電気通信大学'], ['Faculty', '情報理工学部'], ['Grade', '4年生'], ['Hometown', '神奈川県']].map(([k, v]) => (
                <div key={k} className="about-row"><span className="about-key">{k}</span><span className="about-val">{v}</span></div>
              ))}
            </div>
            <div style={{ marginTop: 48, opacity: 0.25 }}>
              <div className="about-mark" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkThumbnail({ work }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = work.image && !imageFailed;

  return (
    <div className="work-thumb">
      <div className="work-thumb-inner">
        <div className="work-thumb-bar">
          {WORK_WINDOW_DOTS.map((dot, index) => (
            <div key={index} className="work-thumb-dot" style={{ background: dot }}></div>
          ))}
        </div>
        <div className="work-thumb-content">
          {showImage ? (
            <img className="work-shot" src={work.image} alt={`${work.title} screenshot`} loading="lazy" onError={() => setImageFailed(true)} />
          ) : (
            <div className="work-placeholder">
              <div className="work-placeholder-mark" style={{ background: work.accent }}></div>
              <div className="work-placeholder-title">{work.title}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Works() {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const visibleRef = useRef(true);
  const [cardW, setCardW] = useState(360);

  useEffect(() => {
    const update = () => {
      if (outerRef.current) {
        const card = outerRef.current.querySelector('.work-card');
        const track = outerRef.current.querySelector('.works-track');
        const gap = track ? parseFloat(window.getComputedStyle(track).gap) || 0 : 20;
        if (card) setCardW(card.offsetWidth + gap);
        else setCardW(340 + 20);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const applyWorksOffset = value => {
    const loopWidth = cardW * WORKS.length;
    if (loopWidth <= 0 || !trackRef.current) return;
    offsetRef.current = ((value % loopWidth) + loopWidth) % loopWidth;
    trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
  };

  useEffect(() => {
    const track = trackRef.current;
    const outer = outerRef.current;
    if (!track || !outer) return;

    // pause the marquee when offscreen (battery friendly)
    const io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; }, { threshold: 0 });
    io.observe(outer);

    let frame;
    let last = null;
    const speed = REDUCED ? 0 : 22;
    const loopWidth = cardW * WORKS.length;

    const animate = time => {
      if (last === null) last = time;
      const delta = time - last;
      last = time;

      if (loopWidth > 0 && !draggingRef.current && visibleRef.current && speed > 0) {
        offsetRef.current = (offsetRef.current + speed * delta / 1000) % loopWidth;
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); io.disconnect(); };
  }, [cardW]);

  const moveWorks = direction => {
    applyWorksOffset(offsetRef.current + direction * cardW);
  };

  const startWorksDrag = e => {
    draggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const dragWorks = e => {
    if (!draggingRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 6) hasDraggedRef.current = true;
    applyWorksOffset(dragStartOffsetRef.current - delta);
  };

  const endWorksDrag = e => {
    draggingRef.current = false;
    if (e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const openWorkLink = (event, detailUrl) => {
    if (!detailUrl) return;
    if (hasDraggedRef.current) {
      event.preventDefault();
    }
  };

  return (
    <section id="works" className="sec sec-paper" data-screen-label="Works">
      <div className="w">
        <div className="works-top">
          <div>
            <p className="sec-num r">02</p>
            <h2 className="sec-title r"><SplitTitle text="Works" dot /></h2>
            <p className="sec-sub r">制作実績</p>
            <p className="works-body-txt r">個人開発を中心に、AIやWeb技術を活かしたプロダクトを制作しています。ユーザー視点を大切に、シンプルで価値あるプロダクトを目指しています。</p>
          </div>
          <div className="works-actions">
            <div className="works-nav">
              <button className="wn-btn" aria-label="前へ" onClick={() => moveWorks(-1)}>
                <svg viewBox="0 0 12 12"><path d="M7.5 9.5L4 6l3.5-3.5" /></svg>
              </button>
              <button className="wn-btn" aria-label="次へ" onClick={() => moveWorks(1)}>
                <svg viewBox="0 0 12 12"><path d="M4.5 2.5L8 6l-3.5 3.5" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div
          className="works-outer"
          ref={outerRef}
          onPointerDown={startWorksDrag}
          onPointerMove={dragWorks}
          onPointerUp={endWorksDrag}
          onPointerCancel={endWorksDrag}
          onPointerLeave={endWorksDrag}
        >
          <div className="works-track" ref={trackRef} style={{ transform: 'translateX(0)', transition: 'none' }}>
            {[...WORKS, ...WORKS].map((w, i) => {
              const detailUrl = w.url || w.image;
              const CardTag = detailUrl ? 'a' : 'div';
              return (
                <CardTag
                  key={i}
                  className="work-card r"
                  href={detailUrl}
                  aria-label={detailUrl ? `${w.title}の詳細を開く` : undefined}
                  onClick={event => openWorkLink(event, detailUrl)}
                  style={{ transitionDelay: `${(i % WORKS.length) * 0.07}s` }}
                >
                  <WorkThumbnail work={w} />
                  <div className="work-body">
                    <div className="work-tags">{w.tags.map(t => <span key={t} className="work-tag">{t}</span>)}</div>
                    <div className="work-title">{w.title}</div>
                    <div className="work-desc">{w.desc}</div>
                  </div>
                </CardTag>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section id="strengths" className="sec sec-dark" data-screen-label="Strengths">
      <div className="w">
        <div className="str-row">
          <div>
            <p className="sec-num r">03</p>
            <h2 className="sec-title r"><SplitTitle text="Strengths" dot /></h2>
            <p className="sec-sub r">強み</p>
            <p className="str-intro r">専門知識と技術開発力、そしてチームでのコミュニケーション力を活かして、困難なプロジェクトを前進させます。</p>
          </div>
          <div className="str-grid">
            {STRENGTHS.map((s, i) => (
              <div key={i} className="str-card r" style={{ transitionDelay: `${i * 0.08}s` }}>
                <img className="str-icon" src={s.icon} alt="" loading="lazy" />
                <div className="str-name">{s.name}</div>
                <div className="str-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Achievements() {
  const stats = [
    { icon: 'uploads/47_programming_code_icon.png', label: 'ホワイトハッカーコンテスト\n入賞', value: 1, unit: '回' },
    { icon: 'uploads/50_development_laptop_icon.png', label: '個人プロジェクト\n開発数', value: 7, unit: '+' },
    { icon: 'uploads/48_teamwork_icon.png', label: '実環境実装実績', value: 1, unit: '件' },
    { icon: 'uploads/51_ai_development_icon.png', label: 'AI駆動開発歴', value: 1, unit: '年' },
  ];
  return (
    <section id="achievements" className="sec sec-paper" data-screen-label="Achievements">
      <div className="w">
        <div className="ach-top">
          <div>
            <p className="sec-num r">04</p>
            <h2 className="sec-title r"><SplitTitle text="Achievements" dot /></h2>
            <p className="sec-sub r">実績</p>
          </div>
          <p className="ach-body-txt r">大学でのコンテスト受賞、複数のプロダクト開発、これまでに積み上げてきた実績と経験の一部をご紹介します。</p>
        </div>
        <div className="ach-grid">
          {stats.map((s, i) => (
            <div key={i} className="ach-card r" style={{ transitionDelay: `${i * 0.1}s` }}>
              <img className="ach-icon" src={s.icon} alt="" loading="lazy" />
              <div className="ach-label">{s.label}</div>
              <div className="ach-val"><CountUp value={s.value} /><span className="ach-unit">{s.unit}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="sec sec-dark" data-screen-label="FAQ">
      <div className="w">
        <div className="faq-row">
          <div>
            <p className="sec-num r">05</p>
            <h2 className="sec-title r"><SplitTitle text="FAQ" dot /></h2>
            <p className="sec-sub r">よくある質問</p>
            <p className="faq-intro-txt r">お問い合わせの前に、よくいただくご質問をまとめました。解決しない場合はお気軽にご連絡ください。</p>
            <div className="faq-glow r" aria-hidden="true"></div>
          </div>
          <div className="r">
            {FAQS.map((f, i) => (
              <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
                <button type="button" className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                  <span className="faq-qt">{f.q}</span>
                  <span className="faq-tog" aria-hidden="true">+</span>
                </button>
                <div className="faq-a-wrap"><div className="faq-a">{f.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);
  const submit = e => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.msg}`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ry0.s3k1n0@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', msg: '' });
  };
  return (
    <section id="contact" className="contact-sec" data-screen-label="Contact">
      <div className="w">
        <div className="contact-grid">
          <div>
            <div className="contact-tagline-wrap r">
              <div className="contact-tagline">Let's<br />Create<br />The Future<br />Together.</div>
            </div>
            <div className="contact-info r">
              <a className="contact-email-row" href="mailto:ry0.s3k1n0@gmail.com">
                <span className="contact-email-icon" aria-hidden="true">@</span>
                <span className="contact-email-txt">ry0.s3k1n0@gmail.com</span>
              </a>
              <a className="contact-email-row" href="https://github.com/Nomex2" target="_blank" rel="noopener noreferrer">
                <span className="contact-email-icon" aria-hidden="true">GH</span>
                <span className="contact-email-txt">github.com/Nomex2</span>
              </a>
              <div className="contact-sns-label">SNS</div>
              <div className="contact-sns">
                <a className="sns-btn" href="https://github.com/Nomex2" target="_blank" rel="noopener noreferrer" title="GitHub">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                </a>
                <a className="sns-btn" href="https://x.com/Ryo_Sekino" target="_blank" rel="noopener noreferrer" title="X">
                  <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a className="sns-btn" href="https://www.instagram.com/nome_x2/" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="r d1">
            <div className="contact-form-title">お問い合わせ</div>
            <div className="contact-form-sub">お仕事の依頼・ご相談など、お気軽にご連絡ください。送信ボタンでメール作成画面が開きます。</div>
            <form className="c-form" onSubmit={submit}>
              <input className="c-input" placeholder="お名前" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="c-input" type="email" placeholder="メールアドレス" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              <textarea className="c-input" rows={5} placeholder="メッセージ" value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} required></textarea>
              <Magnetic strength={0.2}><button type="submit" className="c-submit">{sent ? 'メール画面を開きました ✓' : 'Send Message →'}</button></Magnetic>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function HobbiesPage({ onBack }) {
  return (
    <main className="hobby-page">
      <section className="hobby-hero" data-screen-label="Hobbies">
        <div className="hobby-hero-i">
          <div className="hobby-copy">
            <p className="hero-eyebrow r">Secret room unlocked</p>
            <h1 className="hobby-title r d1"><SplitTitle text="Hobbies" dot /></h1>
            <p className="hobby-lead r d2">技術の外側にある好きなことも、ものづくりの感性を育ててくれています。</p>
            <div className="hobby-actions r d3">
              <Magnetic><button className="btn-p hobby-back" onClick={() => onBack('home')}>Back Home →</button></Magnetic>
              <Magnetic><button className="btn-s hobby-scroll" onClick={() => scrollToEl(document.getElementById('hobby-list'))}>Explore →</button></Magnetic>
            </div>
          </div>
          <div className="hobby-lock r d2" aria-hidden="true">
            <div className="hobby-lock-ring"></div>
            <div className="hobby-lock-logo">Ryo.S</div>
          </div>
        </div>
      </section>
      <section id="hobby-list" className="hobby-list">
        <div className="w">
          <div className="hobby-section-top">
            <p className="sec-num r">Hidden 01</p>
            <h2 className="sec-title r"><SplitTitle text="What I Like" dot /></h2>
          </div>
          <div className="hobby-grid">
            {HOBBIES.map((hobby, index) => (
              <article className="hobby-card r" key={hobby.name} style={{ '--hobby-color': hobby.color, transitionDelay: `${index * 0.08}s` }}>
                <div className="hobby-card-head">
                  <img src={hobby.icon} alt="" className="hobby-icon" loading="lazy" />
                  <span className="hobby-index">0{index + 1}</span>
                </div>
                <p className="hobby-kana">{hobby.kana}</p>
                <h3>{hobby.name}</h3>
                <p className="hobby-body">{hobby.body}</p>
                <p className="hobby-note">{hobby.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="game-feature">
        <div className="w">
          <div className="game-feature-top">
            <div>
              <p className="sec-num r">Hidden 02</p>
              <h2 className="sec-title r"><SplitTitle text="Games" dot /></h2>
            </div>
            <p className="game-feature-lead r d1">
              どのゲームも一辺倒で応用の利かないものではなく、現実で活きる要素を持っているため今も愛好しています。
            </p>
          </div>
          <div className="game-grid">
            {FEATURED_GAMES.map((game, index) => (
              <a className="game-card r" key={game.name} href={game.url} target="_blank" rel="noopener noreferrer" aria-label={`${game.name} official site`} style={{ '--game-color': game.color, transitionDelay: `${index * 0.08}s` }}>
                <div className="game-card-head">
                  <span className="game-icon-wrap">
                    <img src={game.icon} alt="" className="game-icon" loading="lazy" />
                    <span className="game-number">{String(index + 1).padStart(2, '0')}</span>
                  </span>
                  <span className="game-label">{game.label}</span>
                </div>
                <h3>{game.name}</h3>
                <p className="game-body">{game.body}</p>
                <p className="game-note">{game.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── App ────────────────────────────────────────── */

function App() {
  const [active, setActive] = useState('home');
  const [view, setView] = useState(window.location.hash === '#hobbies' ? 'hobbies' : 'main');
  useReveal([view]);

  // Lenis smooth scroll, driven by the gsap ticker
  useEffect(() => {
    if (REDUCED) return;
    lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = time => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    if (view === 'hobbies') {
      setActive('hobbies');
      return undefined;
    }
    const ids = [...NAVS.map(s => s.toLowerCase()), 'contact'];
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.3 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    ScrollTrigger.refresh();
    return () => obs.disconnect();
  }, [view]);

  useEffect(() => {
    const syncHash = () => setView(window.location.hash === '#hobbies' ? 'hobbies' : 'main');
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, []);

  const openHobbies = () => {
    setView('hobbies');
    setActive('hobbies');
    if (window.location.hash !== '#hobbies') window.history.pushState(null, '', '#hobbies');
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
  };

  const navigateSection = id => {
    if (view === 'hobbies') {
      setView('main');
      window.history.pushState(null, '', window.location.pathname + window.location.search);
      window.setTimeout(() => scrollToEl(document.getElementById(id)), 80);
      return;
    }
    scrollToEl(document.getElementById(id));
  };

  if (view === 'hobbies') {
    return (
      <>
        <Cursor />
        <div className="grain" aria-hidden="true"></div>
        <Nav active="hobbies" onNavigate={navigateSection} />
        <div className="site-lines hobby-lines" aria-hidden="true"></div>
        <HobbiesPage onBack={navigateSection} />
      </>
    );
  }

  return (
    <>
      <Cursor />
      <div className="grain" aria-hidden="true"></div>
      <Nav active={active} onNavigate={navigateSection} />
      <div className="site-lines" aria-hidden="true"></div>
      <Hero onSecretOpen={openHobbies} />
      <About />
      <Works />
      <Strengths />
      <Achievements />
      <FAQ />
      <Contact />
      <footer className="footer">
        <div className="footer-i">
          <span className="footer-logo">Ryo.S</span>
          <span className="footer-txt">© 2026 Ryo.S. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
