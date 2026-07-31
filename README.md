# Ryo.S Portfolio Site v2

黒基調のエディトリアルデザイン + モーション演出(Lenis スムーススクロール / GSAP / Canvas生成アニメ)のポートフォリオサイト。

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
- `HOBBIES` / `FEATURED_GAMES` — 隠しページの内容
- `STRENGTHS` / `FAQS` — 強み・FAQ
- Achievements の数値は `Achievements()` 内の `stats`

## デザイントークン (assets/css/style.css の :root)

- `--bg0/--bg1/--bg2` 黒基調の背景 3 段階
- `--paper` 系 ライトセクション(Works / Achievements)
- `--accent` テラコッタ #D65C3F(アクセントはこの1色に集約)

## アクセシビリティ / モーション

- `prefers-reduced-motion: reduce` でスムーススクロール・Canvas・カーソル演出・リビールをすべて無効化
- FAQ は `aria-expanded` 付きの button、ナビも button 化済み
- カスタムカーソルはマウス環境(pointer: fine)のみ
