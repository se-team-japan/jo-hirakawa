# Talent Official MVP Landing Page

タレント公式サイトのMVP（最小限の製品）バージョンです。

## 特徴

- 白基調×黒字×余白×タイポグラフィのミニマルなデザイン
- Next.js (App Router) + TypeScript + Tailwind CSS
- 1ページのランディングページ
- 静的コンテンツはJSONファイルで管理
- Framer Motionによるアニメーション

## セットアップ

```bash
# 依存関係のインストール
npm install

# nodemailer をまだ入れていない場合
npm install nodemailer

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構造

```
├── app/
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # メインページ
│   └── globals.css     # グローバルスタイル
├── components/
│   ├── sections/       # セクションコンポーネント
│   └── ui/             # UIコンポーネント
├── content/
│   └── static/         # 静的コンテンツ（JSON）
└── public/
    └── images/         # 画像ファイル
```

## コンテンツの編集

各セクションのコンテンツは以下のJSONファイルで管理されています：

- `content/static/site.json` - サイト全体の設定
- `content/static/profile.json` - プロフィール情報
- `content/static/news.json` - ニュース一覧

## 画像の追加

- Hero画像: `public/images/hero.jpg` (または `hero.mp4`)
- プロフィール画像: `public/images/portrait.jpg`

画像を追加したら、各コンポーネント内の画像パスを更新してください。

## お問い合わせフォーム / メール送信の設定

`/api/contact` 経由でのお問い合わせフォーム送信には、以下の環境変数を `.env.local` に設定してください（実際の値に置き換えてください）:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_v3_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_v3_secret_key
RECAPTCHA_MIN_SCORE=0.5

CONTACT_TO_EMAIL=info@example.com
MAIL_FROM="サイト事務局 <no-reply@jo-hirakawa.com>"

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_user
SMTP_PASS=your_pass
```

- **Fromポリシー**: 送信元`From`は `MAIL_FROM` で固定されます（なりすまし防止）。
- **Reply-Toポリシー**: フォーム送信者のメールアドレスが `Reply-To` に設定されます。
- **reCAPTCHA v3**: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`と`RECAPTCHA_SECRET_KEY`には、Google reCAPTCHA v3のサイトキー／シークレットキーを設定してください。

## ビルド

```bash
npm run build
npm start
```

## デプロイ

Vercelへのデプロイを推奨します。


