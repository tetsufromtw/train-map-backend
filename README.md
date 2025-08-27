# Train Map Backend

## プロジェクト概要
FAANG企業レベルのスケーラブルなNestJSバックエンドアーキテクチャ

## プロジェクト構造

```
src/
├── common/                 # 共通機能・ユーティリティ
│   ├── decorators/        # カスタムデコレータ
│   ├── filters/           # グローバル例外フィルタ
│   ├── guards/            # 認証・認可ガード
│   ├── interceptors/      # リクエスト/レスポンス変換
│   ├── pipes/             # データ変換・バリデーション
│   └── utils/             # ヘルパー関数
├── config/                 # 設定管理
│   ├── database.config.ts # データベース設定
│   ├── redis.config.ts    # Redis設定
│   └── app.config.ts      # アプリケーション設定
├── core/                   # コアビジネスロジック
│   ├── auth/              # 認証・認可システム
│   ├── user/              # ユーザー管理
│   ├── train/             # 電車データ管理
│   └── map/               # マップデータ管理
├── data/                   # 生データ・静的データ
│   ├── raw/               # 生データファイル（JSON/CSV/XML）
│   ├── seed/              # シードデータ（初期データ）
│   └── fixtures/          # テスト用固定データ
├── infrastructure/         # インフラストラクチャ層
│   ├── database/          # データベース接続・マイグレーション
│   ├── cache/             # キャッシュ実装
│   ├── external-apis/     # 外部API統合
│   └── messaging/         # メッセージキュー
├── shared/                 # 共有モデル・インターフェース
│   ├── dto/               # データ転送オブジェクト
│   ├── entities/          # データベースエンティティ
│   ├── interfaces/        # TypeScriptインターフェース
│   ├── types/             # 生データ用型定義
│   └── enums/             # 列挙型定義
├── modules/                # 機能モジュール
│   ├── health/            # ヘルスチェック
│   ├── metrics/           # メトリクス収集
│   └── logging/           # ログ管理
└── main.ts                 # アプリケーションエントリーポイント

docs/                       # プロジェクトドキュメント
├── data-schema/            # データスキーマ説明書
│   ├── train-data.md      # 電車データフィールド説明
│   ├── map-data.md        # 地図データフィールド説明
│   └── user-data.md       # ユーザーデータフィールド説明
├── api/                    # API仕様書
└── architecture/           # アーキテクチャドキュメント
```

## 各ディレクトリの詳細説明

### 📁 `common/`
アプリケーション全体で共有される横断的関心事を含むディレクトリ

- **`decorators/`**: カスタムデコレータ（@CurrentUser、@Roles等）
- **`filters/`**: グローバル例外ハンドリング、エラーレスポンス統一
- **`guards/`**: JWT認証、ロールベースアクセス制御
- **`interceptors/`**: ログ記録、レスポンス変換、パフォーマンス測定
- **`pipes/`**: バリデーション、データ変換、サニタイゼーション
- **`utils/`**: ヘルパー関数、共通ユーティリティ

### 📁 `config/`
環境別設定とコンフィグレーション管理

- **`database.config.ts`**: データベース接続設定（PostgreSQL/MySQL）
- **`redis.config.ts`**: Redisキャッシュ設定
- **`app.config.ts`**: アプリケーション全般の設定

### 📁 `core/`
ドメイン固有のビジネスロジックとサービス

- **`auth/`**: JWT認証、OAuth2、セッション管理
- **`user/`**: ユーザープロファイル、権限管理
- **`train/`**: 電車路線、時刻表、運行情報
- **`map/`**: 地図データ、位置情報、ルート計算

### 📁 `infrastructure/`
外部システムとの統合とデータ永続化

- **`database/`**: TypeORM設定、マイグレーション、コネクションプール
- **`cache/`**: Redis実装、キャッシュ戦略
- **`external-apis/`**: 第三者API統合（Google Maps、交通情報）
- **`messaging/`**: RabbitMQ、Kafka等のメッセージキュー

### 📁 `data/`
データベース使用前の静的データ・生データ管理

- **`raw/`**: 生データファイル（JSON、CSV、XMLなど）- 外部から取得したそのままのデータ
- **`seed/`**: シードデータ（アプリケーション初期化用の基本データ）
- **`fixtures/`**: テスト用固定データ・モックデータ

### 📁 `shared/`
アプリケーション全体で共有されるデータ構造

- **`dto/`**: APIリクエスト/レスポンスのデータ転送オブジェクト
- **`entities/`**: データベーステーブルマッピング
- **`interfaces/`**: TypeScript型定義、コントラクト
- **`types/`**: 生データ用TypeScript型定義（raw dataのスキーマ）
- **`enums/`**: 定数値、ステータス定義

### 📁 `docs/`
プロジェクト関連ドキュメント

- **`data-schema/`**: 各種データフィールドの詳細説明・仕様書
  - `train-data.md`: 電車データの各フィールド説明、データソース、更新頻度等
  - `map-data.md`: 地図データの座標系、精度、属性説明等  
  - `user-data.md`: ユーザーデータの各項目、プライバシー要件等
- **`api/`**: REST API仕様、エンドポイント詳細
- **`architecture/`**: システム設計書、技術選定理由等

### 📁 `modules/`
運用・監視に関する機能モジュール

- **`health/`**: システムヘルスチェック、依存関係監視
- **`metrics/`**: Prometheus メトリクス、パフォーマンス指標
- **`logging/`**: 構造化ログ、トレーシング

## 技術スタック
- **Framework**: NestJS
- **Database**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Monitoring**: Prometheus + Grafana
- **Documentation**: Swagger/OpenAPI

## 開発原則
1. **Single Responsibility**: 各モジュールは単一の責任を持つ
2. **Dependency Injection**: 疎結合なアーキテクチャ
3. **SOLID Principles**: 拡張可能で保守性の高いコード
4. **Clean Architecture**: ビジネスロジックとインフラの分離
5. **Test-Driven Development**: 高いテストカバレッジ

## スケーラビリティ対応
- **Horizontal Scaling**: ロードバランサー対応
- **Caching Strategy**: Redis による多層キャッシュ
- **Database Optimization**: インデックス最適化、クエリ最適化
- **Microservices Ready**: 将来的なマイクロサービス化に対応

## セットアップ

```bash
$ npm install
```

## 開発・実行

```bash
# 開発環境
$ npm run start

# 開発環境（ホットリロード）
$ npm run start:dev

# 本番環境
$ npm run start:prod
```

## テスト実行

```bash
# ユニットテスト
$ npm run test

# E2Eテスト
$ npm run test:e2e

# テストカバレッジ
$ npm run test:cov
```
