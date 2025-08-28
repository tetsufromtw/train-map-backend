# マルチステージビルド用の基盤イメージ
FROM node:20-alpine AS base

# 日本語ロケールとタイムゾーンを設定
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    echo "Asia/Tokyo" > /etc/timezone

# 作業ディレクトリを設定
WORKDIR /app

# セキュリティのため非rootユーザーを作成
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# ====================
# 依存関係のインストールステージ
# ====================
FROM base AS deps

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 本番環境用の依存関係をインストール（ci使用でより高速・安全）
RUN npm ci --only=production && npm cache clean --force

# ====================
# ビルドステージ
# ====================
FROM base AS build

# 開発用依存関係も含めてすべてインストール
COPY package*.json ./
RUN npm ci

# ソースコードをコピー
COPY . .

# TypeScriptをコンパイルしてビルド
RUN npm run build

# ====================
# 本番環境ランナーステージ
# ====================
FROM base AS runner

# 本番環境であることを明示
ENV NODE_ENV=production
ENV PORT=3000

# 依存関係を本番環境ステージからコピー
COPY --from=deps /app/node_modules ./node_modules

# ビルド成果物をコピー
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# データファイルをコピー（CSV等）
COPY --from=build /app/src/data ./src/data

# 非rootユーザーに所有権を変更
RUN chown -R nestjs:nodejs /app
USER nestjs

# アプリケーションポートを公開
EXPOSE 3000

# ヘルスチェック用エンドポイントを設定
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# アプリケーションを起動
CMD ["node", "dist/main.js"]