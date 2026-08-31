# ギルティ 〜罪と罰と幸福〜

2人制・相互承認の約束トラッカー。約束を守れば仏が育ち、遅刻すれば悪魔が育つ（1本の天秤で押し合い、レベル1〜10）。

## 構成

- `public/index.html` — フロントエンド（単一ファイル・依存なし。Canvas描画、4秒間隔のポーリング同期）
- `api/*.js` — Vercel Serverless Functions（Node・依存パッケージなし）
  - `GET  /api/data` — 全状態（アカウント・申請履歴）
  - `POST /api/register` — アカウント登録/ログイン（最大2名）
  - `POST /api/request` — 「遅刻した/約束を守った」申請
  - `POST /api/decide` — 承認/却下
  - `POST /api/withdraw` — 申請の取り下げ
  - `POST /api/reset` — 全データ初期化
- データは Upstash Redis の単一キー `guilty:data` に JSON で保存

## デプロイ手順

1. このフォルダを GitHub にpushするか、Vercel CLI（`npm i -g vercel` → `vercel`）でデプロイ
2. Vercel ダッシュボード → 対象プロジェクト → **Storage** → Marketplace から **Upstash (Redis)** を作成しプロジェクトに接続
   - 接続すると `KV_REST_API_URL` / `KV_REST_API_TOKEN`（または `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`）が自動で環境変数に入る
3. 環境変数を反映するため **Redeploy**
4. 発行されたURLをスマホで開いて利用

### 注意

- Redis 未接続でも動くが、データはサーバーインスタンス内メモリ保持のため**随時消える**（動作確認用）
- 認証はアカウント名のみの性善説設計。URLを知っている人は誰でも操作できるため、公開範囲に注意（必要なら Vercel の Password Protection や Basic 認証を追加）
- 「自己承認（お試し）」ボタンが有効のまま。相手承認のみの本運用に切り替える場合は `public/index.html` の承認キュー描画部（`isMine` 分岐）を戻す

## ローカル確認

```
vercel dev
```

（Redis 環境変数が無ければメモリ動作）
