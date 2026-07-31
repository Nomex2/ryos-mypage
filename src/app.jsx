import { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
const scrollToEl = (el, offset = -70) => {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.1 });
  else window.scrollTo({ top: el.offsetTop + offset, behavior: REDUCED ? 'auto' : 'smooth' });
};

const SECTIONS = ['home', 'about', 'works', 'strengths', 'achievements', 'faq', 'contact'];

const HOBBIES = [
  {
    name: 'AI Development',
    kana: 'AI開発',
    body: '新しいAPIやモデルを触りながら、日常の小さな不便を解くツールを作るのが好きです。',
    note: 'prototype / prompt / automation',
    icon: 'uploads/43_ai_technology_brain_icon.png',
  },
  {
    name: 'Football',
    kana: 'サッカー',
    body: '小学校から高校まで続けてきた原点。チームで考え、走り、流れを変える感覚が今の開発にもつながっています。特に諦めない姿勢は、どんな難題にも挑む原動力になっています。',
    note: 'teamwork / tactics / persistence',
    icon: 'uploads/44_soccer_icon.png',
  },
  {
    name: 'Breakfast Tour',
    kana: '朝ごはん屋さんめぐり',
    body: '朝活という習慣を大切にするため最近特にはまっています。空間や人柄などが特に顕著に反映されているため、新しい視点やアイデアを得るのに最適な趣味です。',
    note: 'morning routine / atmosphere / inspiration',
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
    desc: '生徒の課題解決能力や柔軟性などの数値データを用いてAI分析を行い、成長予測、クラス替え後の雰囲気推測、文部科学省の示す教育プロジェクト提案などを行う教師補助AIツール。',
    image: 'uploads/work_Educompass.webp',
  },
  {
    title: 'Lab Glossary',
    jp: '研究室用語ライブラリ',
    tags: ['Static HTML', 'WebDAV', 'Glossary'],
    desc: '研究室活動で出てきた用語を解説し、タグ分けして閲覧しやすくした静的HTMLアプリケーション。WEBDAV環境で動く軽量な用語ライブラリです。',
    url: 'https://nomex2.github.io/product/lab-glossary/',
    image: 'uploads/work_lab_glossary.webp',
  },
  {
    title: 'Portfolio Site',
    tags: ['Portfolio', 'React', 'UI Design'],
    desc: '自己紹介、制作実績、強み、趣味をまとめたポートフォリオサイト。見せ方や動きも含めて、自分らしさが伝わる構成を目指して構築しました。',
    url: 'https://nomex2.github.io/product/',
    image: 'uploads/work_portfolio_site.webp',
  },
  {
    title: 'Secure Quest',
    tags: ['React', 'Vite', 'Flask', 'SQLite'],
    desc: 'セキュリティニュースを題材に、毎日クエスト形式でサイバーセキュリティを学べる学習アプリ。デイリークエストに挑戦し、選択式の問題に回答してXPを獲得。レベル、ストリーク、過去クエストの確認機能も。',
    image: 'uploads/work_secure_quest.webp',
  },
  {
    // TODO: ARG作品の正式なタイトル・URL・説明文・スクリーンショットに差し替え
    title: 'ARG Project',
    tags: ['ARG', 'Web', 'Puzzle'],
    desc: 'Web上で展開する代替現実ゲーム（ARG）。隠しページや暗号を辿りながら物語を解き明かす、体験型の謎解きプロジェクトです。詳細は近日公開。',
    locked: true,
  },
];

const STRENGTHS = [
  { name: '課題解決力', en: 'problem_solving', level: 92, desc: '多面的な視点で課題を整理し、技術とデザインを組み合わせて考える力を磨いています。' },
  { name: '技術力', en: 'technology', level: 88, desc: 'AI・Web開発を中心に、最新技術を素早くキャッチアップし実装できる力があります。' },
  { name: 'チームワーク', en: 'teamwork', level: 95, desc: 'サッカーで培った協調性とコミュニケーション力で、チームを前進させることができます。' },
  { name: '継続力', en: 'persistence', level: 97, desc: '目標に向かって粘り強く取り組み、成果を出すことにこだわり続けることができます。' },
];

const FAQS = [
  { q: '現在はインターン中ですか？', a: '研究室活動をメインにしているため、インターンは行っていません。業務委託契約先にてオンラインでの調査業務に携わっています。' },
  { q: '得意な技術分野は何ですか？', a: 'React/TypeScript、Next.js、Python（AI）を中心に開発しています。UI設計からバックエンドまでフルスタックに対応できます。' },
  { q: 'チームでの開発経験はありますか？', a: 'はい、複数のチーム開発プロジェクトに携わった経験があります。Figmaでのデザイン考案から実装まで、単純な悩みから複雑な問題まで対応可能です。' },
  { q: '副業やインターンなどについて詳しく教えてください。', a: 'Web制作、アプリ開発、AIツール開発など自身の成長につながるものは幅広くお受けしています。まずはメールまたはSNSでお気軽にご相談ください。' },
];

/* ── utilities ──────────────────────────────────── */

function useReveal(deps) {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    if (REDUCED) { els.forEach(el => el.classList.add('on')); return; }
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } }), { threshold: 0.06 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, deps);
}

// types out lines one after another
function BootLog({ lines, speed = 14, startDelay = 300, onDone }) {
  const [shown, setShown] = useState(REDUCED ? lines.map(l => l.text) : lines.map(() => ''));
  const [done, setDone] = useState(REDUCED);
  const doneSent = useRef(false);
  useEffect(() => {
    if (done && !doneSent.current) {
      doneSent.current = true;
      onDone && onDone();
    }
  }, [done, onDone]);
  useEffect(() => {
    if (REDUCED) return;
    let li = 0, ci = 0, timer;
    const tick = () => {
      if (li >= lines.length) { setDone(true); return; }
      ci += 1 + Math.floor(Math.random() * 2);
      const text = lines[li].text;
      setShown(prev => {
        const next = [...prev];
        next[li] = text.slice(0, ci);
        return next;
      });
      if (ci >= text.length) { li += 1; ci = 0; timer = setTimeout(tick, 90); }
      else timer = setTimeout(tick, speed);
    };
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="bootlog">
      {lines.map((l, i) => (
        <p key={i} className={`bl-line ${l.cls || ''}`}>
          {shown[i]}
          {!done && shown[i] && shown[i].length < l.text.length ? <span className="caret" /> : null}
        </p>
      ))}
    </div>
  );
}

// subtle digital rain background
function Rain() {
  const ref = useRef(null);
  useEffect(() => {
    if (REDUCED) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w, h, raf, cols, drops;
    const glyphs = '01アイウエオカキクケコｱｲｳｴｵ+-*/<>{}[]#$%&';
    const size = 16;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = Math.floor(w / size);
      drops = Array.from({ length: cols }, () => Math.random() * -h / size);
    };
    resize();
    window.addEventListener('resize', resize);
    let last = 0;
    const tick = t => {
      raf = requestAnimationFrame(tick);
      if (t - last < 70) return;
      last = t;
      ctx.fillStyle = 'rgba(5, 9, 7, 0.12)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillStyle = Math.random() < 0.04 ? 'rgba(87,224,255,0.6)' : 'rgba(105,217,138,0.45)';
        ctx.fillText(ch, i * size, drops[i] * size);
        if (drops[i] * size > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  if (REDUCED) return null;
  return <canvas className="rain" ref={ref} aria-hidden="true" />;
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  return <span>{pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())} JST</span>;
}

function CountUp({ value, duration = 1200 }) {
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


// BIOS-style boot overlay on first access
function BootScreen({ onDone }) {
  const LINES = [
    'RYOS BIOS v3.0.0 — SEKINO RYO SYSTEMS',
    'CPU: CURIOSITY CORE x2 ......... OK',
    'MEM: PASSION 640K (OVERCLOCKED) OK',
    'MOUNT /portfolio ............... OK',
    'MOUNT /hidden .............. LOCKED',
    'STARTING SESSION ...',
  ];
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (idx < LINES.length) {
      const t = setTimeout(() => setIdx(idx + 1), 260 + Math.random() * 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLeaving(true), 450);
    return () => clearTimeout(t);
  }, [idx]);
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onDone, 550);
    return () => clearTimeout(t);
  }, [leaving, onDone]);
  const skip = () => { setIdx(LINES.length); setLeaving(true); };
  return (
    <div className={`boot-screen${leaving ? ' leave' : ''}`} onClick={skip} role="presentation">
      <div className="boot-inner">
        {LINES.slice(0, idx).map((l, i) => (
          <p key={i} className={`boot-line${l.includes('LOCKED') ? ' c-warn' : ''}`}>{l}</p>
        ))}
        {idx < LINES.length && <p className="boot-line"><span className="caret" /></p>}
        <div className="boot-bar" aria-hidden="true"><span style={{ width: `${Math.min(100, idx / LINES.length * 100)}%` }} /></div>
        <p className="boot-skip">click to skip</p>
      </div>
    </div>
  );
}

/* ── chrome ─────────────────────────────────────── */

function TopBar({ active }) {
  return (
    <header className="topbar">
      <span className="tb-left">RYOS://MYPAGE — v3.0.0</span>
      <span className="tb-mid">[{active.toUpperCase()}]</span>
      <span className="tb-right"><span className="tb-dot" />SECURE — <Clock /></span>
    </header>
  );
}


// command typed out when it scrolls into view
function TypedCmd({ text, onDone }) {
  const full = text.length;
  const [n, setN] = useState(REDUCED ? full : 0);
  const [started, setStarted] = useState(REDUCED);
  const doneSent = useRef(false);
  const ref = useRef(null);
  useEffect(() => {
    if (n >= full && !doneSent.current) {
      doneSent.current = true;
      const t = setTimeout(() => onDone && onDone(), 180);
      return () => clearTimeout(t);
    }
  }, [n, full, onDone]);
  useEffect(() => {
    if (REDUCED) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); io.disconnect(); }
    }, { threshold: 0.6 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!started || n >= full) return;
    const t = setTimeout(() => setN(v => Math.min(full, v + 1 + Math.floor(Math.random() * 2))), 24);
    return () => clearTimeout(t);
  }, [started, n, full]);
  const done = n >= full;
  return <span ref={ref}>{text.slice(0, n)}{started && !done ? <span className="caret" /> : null}{!started ? '\u00A0' : null}</span>;
}

// command line at the bottom — the site's controller & hidden-room key
function CmdBar({ onCommand }) {
  const [value, setValue] = useState('');
  const [log, setLog] = useState(null);
  const inputRef = useRef(null);
  const logTimer = useRef(null);

  const print = msg => {
    setLog(msg);
    if (logTimer.current) clearTimeout(logTimer.current);
    logTimer.current = setTimeout(() => setLog(null), 5000);
  };

  const submit = e => {
    e.preventDefault();
    const cmd = value.trim().toLowerCase();
    setValue('');
    if (!cmd) return;
    const result = onCommand(cmd);
    if (result) print(result);
  };

  return (
    <div className="cmdbar">
      {log && <p className="cmd-log">{log}</p>}
      <form className="cmd-form" onSubmit={submit} onClick={() => inputRef.current?.focus()}>
        <span className="cmd-prompt">ryo.s@future:~$</span>
        <input
          ref={inputRef}
          className="cmd-input"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder='type "help"'
          aria-label="command input"
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
}

// section = an executed command with its output
function Cmd({ id, cmd, note, children }) {
  const [typed, setTyped] = useState(REDUCED);
  const onDone = useCallback(() => setTyped(true), []);
  return (
    <section id={id} className={`cmd-sec${typed ? ' typed' : ''}`} data-label={id}>
      <div className="w">
        <p className="sec-prompt"><span className="p1">ryo.s@future</span><span className="p2">:~$</span> <TypedCmd text={cmd} onDone={onDone} />{note && typed && <span className="p-note">  # {note}</span>}</p>
        <div className="sec-out">{children}</div>
      </div>
    </section>
  );
}

/* ── sections ───────────────────────────────────── */

const ASCII_LOGO = String.raw`
██████╗ ██╗   ██╗ ██████╗    ███████╗
██╔══██╗╚██╗ ██╔╝██╔═══██╗   ██╔════╝
██████╔╝ ╚████╔╝ ██║   ██║   ███████╗
██╔══██╗  ╚██╔╝  ██║   ██║   ╚════██║
██║  ██║   ██║   ╚██████╔╝██╗███████║
╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝╚══════╝`;

function Hero({ onNav }) {
  const [typed, setTyped] = useState(REDUCED);
  const onDone = useCallback(() => setTyped(true), []);
  return (
    <section id="home" className={`hero${typed ? ' typed' : ''}`} data-label="home">
      <div className="w">
        <BootLog onDone={onDone} lines={[
          { text: 'ryo.s@future:~$ boot portfolio --fresh --fluid', cls: 'c-cmd' },
          { text: '[ OK ] loading modules... ai / web / security', cls: 'c-ok' },
          { text: '[ OK ] whitehat_contest.award found (x1)', cls: 'c-ok' },
          { text: '[WARN] hidden_room detected — passphrase required. hint: try "unlock"', cls: 'c-warn' },
        ]} />
        <pre className="ascii r d1" aria-hidden="true">{ASCII_LOGO}</pre>
        <h1 className="hero-title r d1">ENGINEERING<br /><span className="ht-glow">THE FUTURE_<span className="caret big" /></span></h1>
        <p className="hero-jp r d2">// テクノロジーで、日常の「あったらいいな」をカタチにする。</p>
        <p className="hero-jp sub r d2">// 電気通信大学 情報理工学部 4年 — 関野 凌。AIを活用して、人の役に立つプロダクトを生み出すことに情熱を注いでいます。</p>
        <nav className="hero-menu r d3" aria-label="section menu">
          {[
            ['01', 'about', 'whoami'],
            ['02', 'works', 'ls ./works'],
            ['03', 'strengths', 'cat skills.log'],
            ['04', 'achievements', './stats --summary'],
            ['05', 'faq', 'man ryo.s'],
            ['06', 'contact', 'ssh ryo.s@future'],
          ].map(([no, id, c]) => (
            <button key={id} type="button" className="menu-row" onClick={() => onNav(id)}>
              <span className="m-no">{no}</span>
              <span className="m-id">{id.toUpperCase()}</span>
              <span className="m-cmd">{c}</span>
              <span className="m-arrow">→</span>
            </button>
          ))}
        </nav>
        <p className="hero-status r d4">[SYSTEM STATUS: <b>CHALLENGING</b>] — never settle, keep shipping.</p>
      </div>
    </section>
  );
}

function About() {
  return (
    <Cmd id="about" cmd="whoami --verbose" note="自己紹介">
      <div className="about-grid">
        <div className="r d1">
          <table className="kv">
            <tbody>
              {[
                ['name', '関野 凌 (Ryo Sekino)'],
                ['university', '電気通信大学 情報理工学部'],
                ['grade', '4年生'],
                ['hometown', '神奈川県'],
                ['focus', 'AI × Web プロダクト開発'],
              ].map(([k, v]) => (
                <tr key={k}><td className="kv-k">{k}</td><td className="kv-s">:</td><td className="kv-v">{v}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="about-log">
            <p><span className="c-ok">[ OK ]</span> 小学校から高校までサッカー。チームで上を目指すことを学ぶ。</p>
            <p><span className="c-ok">[ OK ]</span> 現在はAIやWebを活用したプロダクト開発が中心。</p>
            <p><span className="c-run">[RUN ]</span> 人の役に立つ「あったらいいな」を創造中...</p>
          </div>
        </div>
        <pre className="about-ascii r d2" aria-hidden="true">{`+----------------------+
|  > profile.img       |
|  [rendering skipped] |
|  text-mode only      |
+----------------------+`}</pre>
      </div>
    </Cmd>
  );
}

function WorkRow({ work, index }) {
  const url = work.url || work.image;
  const Tag = url ? 'a' : 'div';
  return (
    <Tag
      className={`work-row r${work.locked ? ' locked' : ''}`}
      href={url}
      target={work.url ? '_blank' : undefined}
      rel={work.url ? 'noopener noreferrer' : undefined}
      style={{ transitionDelay: `${index * 0.18}s` }}
    >
      <div className="wr-head">
        <span className="wr-perm">{work.locked ? '-r--------' : 'drwxr-xr-x'}</span>
        <span className="wr-no">{String(index + 1).padStart(2, '0')}</span>
        <span className="wr-name">{work.title}{work.jp ? ` — ${work.jp}` : ''}</span>
        <span className="wr-open">{work.locked ? '[LOCKED]' : url ? '[OPEN →]' : '[IMG]'}</span>
      </div>
      <div className="wr-body">
        <p className="wr-tags">{work.tags.map(t => `[${t}]`).join(' ')}</p>
        <p className="wr-desc">{work.desc}</p>
      </div>
    </Tag>
  );
}

function Works() {
  return (
    <Cmd id="works" cmd="ls ./works --detail" note="制作実績">
      <p className="out-line r">total {WORKS.length} projects — AIやWeb技術を活かしたプロダクトを個人開発中心に制作しています。</p>
      <div className="work-list">
        {WORKS.map((w, i) => <WorkRow key={w.title} work={w} index={i} />)}
      </div>
    </Cmd>
  );
}

function Strengths() {
  const [fired, setFired] = useState(REDUCED);
  const ref = useRef(null);
  useEffect(() => {
    if (REDUCED) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setFired(true); io.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <Cmd id="strengths" cmd="cat skills.log" note="強み">
      <div className="skill-list" ref={ref}>
        {STRENGTHS.map((s, i) => (
          <div key={s.en} className="skill r" style={{ transitionDelay: `${i * 0.18}s` }}>
            <div className="sk-head">
              <span className="sk-en">{s.en}</span>
              <span className="sk-jp">{s.name}</span>
              <span className="sk-pct">{s.level}%</span>
            </div>
            <div className="sk-bar" aria-hidden="true">
              <span className="sk-fill" style={{ width: fired ? `${s.level}%` : '0%', transitionDelay: `${0.2 + i * 0.12}s` }} />
            </div>
            <p className="sk-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </Cmd>
  );
}

function Achievements() {
  const stats = [
    { label: 'whitehat_contest.award', jp: 'ホワイトハッカーコンテスト入賞', value: 1, unit: '回' },
    { label: 'projects.count', jp: '個人プロジェクト開発数', value: 7, unit: '+' },
    { label: 'production.deploys', jp: '実環境実装実績', value: 1, unit: '件' },
    { label: 'ai_driven.years', jp: 'AI駆動開発歴', value: 1, unit: '年' },
  ];
  return (
    <Cmd id="achievements" cmd="./stats --summary" note="実績">
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div key={s.label} className="stat r" style={{ transitionDelay: `${i * 0.15}s` }}>
            <p className="st-label">$ {s.label}</p>
            <p className="st-val"><CountUp value={s.value} /><span className="st-unit">{s.unit}</span></p>
            <p className="st-jp">{s.jp}</p>
          </div>
        ))}
      </div>
    </Cmd>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <Cmd id="faq" cmd="man ryo.s | grep -A1 FAQ" note="よくある質問">
      <div className="faq-list r d1">
        {FAQS.map((f, i) => (
          <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
            <button type="button" className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
              <span className="fq-mark">{open === i ? 'v' : '>'}</span>
              <span className="fq-no">Q{i + 1}.</span>
              <span className="fq-t">{f.q}</span>
            </button>
            <div className="faq-a-wrap"><p className="faq-a">A. {f.a}</p></div>
          </div>
        ))}
      </div>
    </Cmd>
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
    <Cmd id="contact" cmd="ssh ryo.s@future" note="お問い合わせ">
      <p className="out-line r">Connecting... <span className="c-ok">connection established.</span> お仕事の依頼・ご相談など、お気軽にどうぞ。送信でメール作成画面が開きます。</p>
      <h2 className="contact-giant r d1">LET'S CREATE<br /><span className="ht-glow">THE FUTURE_</span></h2>
      <div className="contact-grid">
        <div className="r d2">
          <div className="link-rows">
            <a className="link-row" href="mailto:ry0.s3k1n0@gmail.com"><span className="lr-cmd">$ mail</span><span>ry0.s3k1n0@gmail.com</span></a>
            <a className="link-row" href="https://github.com/Nomex2" target="_blank" rel="noopener noreferrer"><span className="lr-cmd">$ git</span><span>github.com/Nomex2</span></a>
            <a className="link-row" href="https://x.com/Ryo_Sekino" target="_blank" rel="noopener noreferrer"><span className="lr-cmd">$ x</span><span>@Ryo_Sekino</span></a>
            <a className="link-row" href="https://www.instagram.com/nome_x2/" target="_blank" rel="noopener noreferrer"><span className="lr-cmd">$ ig</span><span>@nome_x2</span></a>
          </div>
        </div>
        <form className="c-form r d3" onSubmit={submit}>
          <label className="c-field"><span>name:</span><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
          <label className="c-field"><span>email:</span><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
          <label className="c-field ta"><span>message:</span><textarea rows={5} value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} required /></label>
          <button type="submit" className="c-submit">{sent ? '[ OK ] メール画面を開きました' : '[ SEND MESSAGE → ]'}</button>
        </form>
      </div>
    </Cmd>
  );
}

function HobbiesPage({ onBack }) {
  const [typed, setTyped] = useState(REDUCED);
  const onDone = useCallback(() => setTyped(true), []);
  return (
    <main className="hobby-page">
      <section className={`cmd-sec${typed ? ' typed' : ''}`} data-label="hobbies">
        <div className="w">
          <BootLog onDone={onDone} lines={[
            { text: 'ryo.s@future:~$ unlock', cls: 'c-cmd' },
            { text: 'verifying passphrase... ACCESS GRANTED.', cls: 'c-ok' },
            { text: 'mounting /hidden/hobbies ... done. ようこそ、隠し部屋へ。', cls: 'c-warn' },
          ]} speed={12} startDelay={200} />
          <h1 className="hero-title r d1">HIDDEN ROOM<span className="ht-glow">_</span></h1>
          <p className="hero-jp r d2">// 技術の外側にある好きなことも、ものづくりの感性を育ててくれています。</p>
          <button type="button" className="back-btn r d2" onClick={() => onBack('home')}>[ ← exit — back to home ]</button>

          <p className="sec-prompt r d2" style={{ marginTop: '70px' }}><span className="p1">ryo.s@future</span><span className="p2">:/hidden$</span> ls ./hobbies</p>
          <div className="hobby-grid">
            {HOBBIES.map((hobby, index) => (
              <article className="hobby-card r" key={hobby.name} style={{ transitionDelay: `${index * 0.15}s` }}>
                <div className="hb-head">
                  <span className="hb-dir">drwx------</span>
                  <span className="hb-no">0{index + 1}</span>
                </div>
                <p className="hb-kana">{hobby.kana}</p>
                <h3>{hobby.name}</h3>
                <p className="hb-body">{hobby.body}</p>
                <p className="hb-note">{hobby.note}</p>
              </article>
            ))}
          </div>

          <p className="sec-prompt r" style={{ marginTop: '80px' }}><span className="p1">ryo.s@future</span><span className="p2">:/hidden$</span> top -g <span className="p-note">  # 現実で活きる要素があるゲームたち</span></p>
          <div className="game-list">
            {FEATURED_GAMES.map((game, index) => (
              <a className="game-row r" key={game.name} href={game.url} target="_blank" rel="noopener noreferrer" style={{ transitionDelay: `${index * 0.12}s` }}>
                <span className="gm-no">PID {1000 + index}</span>
                <span className="gm-name">{game.name}</span>
                <span className="gm-label">{game.label}</span>
                <span className="gm-note">{game.note}</span>
                <span className="gm-open">[→]</span>
              </a>
            ))}
          </div>
          <div className="game-detail r">
            {FEATURED_GAMES.map(g => (
              <p key={g.name}><span className="c-ok">{g.name}:</span> {g.body}</p>
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
  const [booted, setBooted] = useState(REDUCED);
  useReveal([view]);

  useEffect(() => {
    if (REDUCED) return;
    lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
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
    if (view === 'hobbies') { setActive('hobbies'); return undefined; }
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
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

  const openHobbies = useCallback(() => {
    setView('hobbies');
    setActive('hobbies');
    if (window.location.hash !== '#hobbies') window.history.pushState(null, '', '#hobbies');
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
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

  const handleCommand = useCallback(cmd => {
    const [head] = cmd.split(/\s+/);
    if (head === 'help' || head === '?') {
      return 'commands: about / works / strengths / achievements / faq / contact / home / unlock / exit';
    }
    if (head === 'unlock' || head === 'sudo') {
      openHobbies();
      return 'ACCESS GRANTED — welcome to the hidden room.';
    }
    if (head === 'exit' || head === 'logout' || head === 'q') {
      navigateSection('home');
      return 'bye. (returned to home)';
    }
    if (head === 'home' || head === 'top' || head === 'clear' || head === 'cd') {
      navigateSection('home');
      return null;
    }
    if (head === 'hobbies' || head === 'hidden') {
      return 'permission denied. hint: try "unlock"';
    }
    if (SECTIONS.includes(head)) {
      navigateSection(head);
      return null;
    }
    if (head === 'whoami') { navigateSection('about'); return null; }
    if (head === 'ls') { navigateSection('works'); return null; }
    if (head === 'ssh' || head === 'mail') { navigateSection('contact'); return null; }
    return `command not found: ${head} — try "help"`;
  }, [openHobbies, navigateSection]);

  return (
    <>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
      <Rain />
      <div className="crt" aria-hidden="true"></div>
      <div className="sweep" aria-hidden="true"></div>
      <TopBar active={active} />
      {view === 'hobbies'
        ? <HobbiesPage onBack={navigateSection} />
        : (
          <>
            <Hero onNav={navigateSection} />
            <About />
            <Works />
            <Strengths />
            <Achievements />
            <FAQ />
            <Contact />
            <footer className="footer">
              <div className="w">
                <p>process finished with exit code 0 — © 2026 Ryo.S. All rights reserved.</p>
              </div>
            </footer>
          </>
        )}
      <CmdBar onCommand={handleCommand} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
