# Ryo.S Portfolio Site — COLLAGE

スクラップブック(切り貼り)をテーマにしたポートフォリオ。マスキングテープ・ポラロイド・破り紙・手描きドゥードルの装飾はすべて余白に置き、本文は白いカード＋黒文字で可読性を確保。ダイヤルを回すと隠し部屋(Hobbies)が開く。React + GSAP + Lenis / esbuild ビルド / Cloudflare Pages。

## 構成

- `index.html` — SEO/OGPメタ入りのエントリ。`assets/js/bundle.js` を読み込むだけ
- `src/app.jsx` — アプリ本体のソース(React + GSAP + Lenis)。**編集するのはこのファイル**
- `assets/js/bundle.js` — esbuild でビルドされた成果物(コミットして GitHub Pages でそのまま配信)
- `assets/css/style.css` — デザインシステム(カラーは `:root` の CSS 変数で一元管理)
- `uploads/` — 画像(大きい画像は WebP 化済み)

## 開発フロー

```bash
npm install        # 初回のみ
npm run watch      # src/app.jsx を監視して assets/js/bundle.js に自動ビルド(ローカルプレビュー用)
npm run serve      # http://localhost:8080 でプレビュー
npm run build      # 本番ビルド → dist/ に出力(Cloudflare Pages が実行するコマンド)
```

## デプロイ (Cloudflare Pages 自動デプロイ)

GitHub リポジトリと Cloudflare Pages を連携済みなら、**main に push するだけで自動ビルド&公開**されます。

- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- `bundle.js` はコミット不要(.gitignore 済み。Cloudflare 側でビルドされます)
- `_headers` で静的アセットの長期キャッシュを設定済み

## コンテンツの更新場所 (src/app.jsx)

- `WORKS` — 制作実績(ARG Project は現在プレースホルダ)
- `HOBBIES` / `FEATURED_GAMES` — 隠し部屋(`unlock`)の内容
- `STRENGTHS`(levelはゲージ%) / `FAQS` — 強み・FAQ
- Achievements の数値は `Achievements()` 内の `stats`
- コマンドの追加は `App()` 内の `handleCommand`

## デザイントークン (assets/css/style.css の :root)

- `--bg` 端末ブラック / `--mint` `--green` 蛍光グリーン系
- `--cyan` 出力・リンク / `--amber` 警告 / `--red` エラー
- 走査線・グリッチ等の演出は EXTRA MOTION セクション

## アクセシビリティ / モーション

- `prefers-reduced-motion: reduce` でスムーススクロール・Canvas・カーソル演出・リビールをすべて無効化
- FAQ は `aria-expanded` 付きの button、ナビも button 化済み
- 走査線/グリッチ/レインは prefers-reduced-motion で全停止
