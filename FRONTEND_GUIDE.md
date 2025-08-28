# フロントエンド実装ガイド

## 🎯 AIによるフロントエンド実装用資料

この資料は、AIが本プロジェクトのフロントエンドを実装する際に必要な情報をまとめたものです。

---

## 📋 提供資料一覧

### 1. API仕様書
- **`API.md`** - 日本語による詳細なAPI仕様書
- **`examples/api-spec.json`** - OpenAPI 3.0仕様書（JSON形式）
- **Swagger UI** - `http://localhost:3000/api` で対話型API文書を確認可能

### 2. 型定義ファイル
```
src/shared/
├── types/company.types.ts    # Company型とEnum定義
└── dto/company.dto.ts        # API リクエスト/レスポンス DTO
```

### 3. サンプルレスポンス
- **`examples/sample-responses.json`** - 全エンドポイントのレスポンス例
- **`examples/api-responses/`** - 実際のAPIレスポンス（エクスポートスクリプト実行後）

### 4. エクスポートスクリプト
```bash
# アプリケーション起動後に実行
./examples/export-api-spec.sh
```

---

## 🏗️ 推奨フロントエンド構成

### 技術スタック推奨
```typescript
// 推奨技術スタック
{
  "framework": "React 18+ / Next.js 14+",
  "language": "TypeScript",
  "styling": "TailwindCSS / MUI / ChakraUI",
  "stateManagement": "Zustand / Redux Toolkit",
  "dataFetching": "TanStack Query (React Query)",
  "formHandling": "React Hook Form",
  "validation": "Zod / Yup"
}
```

### プロジェクト構成例
```
frontend/
├── src/
│   ├── types/                # API型定義のコピー
│   │   └── api.types.ts
│   ├── services/             # API呼び出しサービス
│   │   └── company.service.ts
│   ├── hooks/                # カスタムフック
│   │   └── useCompanies.ts
│   ├── components/           # UIコンポーネント
│   │   ├── CompanyList.tsx
│   │   ├── CompanyDetail.tsx
│   │   ├── CompanyForm.tsx
│   │   └── SearchFilters.tsx
│   ├── pages/                # ページコンポーネント
│   │   ├── CompanyListPage.tsx
│   │   └── CompanyDetailPage.tsx
│   └── utils/                # ユーティリティ
│       └── api.utils.ts
```

---

## 🔧 実装必須機能

### 1. 会社一覧画面
```typescript
interface CompanyListFeatures {
  pagination: true;           // ページネーション
  search: true;              // 会社名検索
  filtering: {
    companyType: boolean;    // 事業者区分フィルタ
    status: boolean;         // 運用状態フィルタ
  };
  sorting: {
    field: string;           // ソート項目選択
    order: 'asc' | 'desc';   // ソート順選択
  };
  actions: {
    view: true;              // 詳細表示
    edit: true;              // 編集
    delete: true;            // 削除
    create: true;            // 新規作成
  };
}
```

### 2. CRUD操作
- **作成**: 新規会社登録フォーム
- **読み取り**: 一覧表示・詳細表示
- **更新**: 既存会社情報編集
- **削除**: 会社情報削除（確認ダイアログ付き）

### 3. レスポンシブ対応
- デスクトップ、タブレット、モバイル対応
- タッチ操作対応

---

## 📊 データフロー設計

### 状態管理構造
```typescript
interface AppState {
  companies: {
    // データ
    items: Company[];
    selectedCompany: Company | null;
    
    // 状態
    loading: boolean;
    error: string | null;
    
    // ページネーション
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    
    // フィルタリング
    filters: {
      search: string;
      companyType?: CompanyType;
      status?: CompanyStatus;
      sortBy: string;
      sortOrder: 'asc' | 'desc';
    };
  };
  
  // UI状態
  ui: {
    sidebarOpen: boolean;
    modalOpen: boolean;
    currentView: 'list' | 'detail' | 'create' | 'edit';
  };
}
```

### API呼び出しサービス例
```typescript
class CompanyService {
  private baseURL = 'http://localhost:3000';
  
  // 一覧取得
  async getCompanies(params: CompanyQueryParams) {
    const url = new URL(`${this.baseURL}/companies`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, value.toString());
    });
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch companies');
    return response.json();
  }
  
  // 詳細取得
  async getCompany(companyCode: number) {
    const response = await fetch(`${this.baseURL}/companies/${companyCode}`);
    if (!response.ok) throw new Error('Company not found');
    return response.json();
  }
  
  // 作成
  async createCompany(data: CreateCompanyDto) {
    const response = await fetch(`${this.baseURL}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create company');
    return response.json();
  }
  
  // 更新
  async updateCompany(companyCode: number, data: UpdateCompanyDto) {
    const response = await fetch(`${this.baseURL}/companies/${companyCode}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update company');
    return response.json();
  }
  
  // 削除
  async deleteCompany(companyCode: number) {
    const response = await fetch(`${this.baseURL}/companies/${companyCode}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete company');
  }
}
```

---

## 🎨 UI/UX 要件

### デザインガイドライン
```typescript
interface UIRequirements {
  // カラーパレット
  colors: {
    primary: '#3B82F6';      // ブルー系
    secondary: '#64748B';    // グレー系
    success: '#10B981';      // グリーン系
    warning: '#F59E0B';      // オレンジ系
    error: '#EF4444';        // レッド系
  };
  
  // タイポグラフィ
  typography: {
    fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif';
    sizes: {
      xs: '0.75rem';
      sm: '0.875rem';
      base: '1rem';
      lg: '1.125rem';
      xl: '1.25rem';
      '2xl': '1.5rem';
    };
  };
  
  // スペーシング
  spacing: {
    xs: '0.25rem';
    sm: '0.5rem';
    md: '1rem';
    lg: '1.5rem';
    xl: '3rem';
  };
}
```

### コンポーネント要件
1. **ヘッダー** - ナビゲーション、検索バー
2. **サイドバー** - フィルタリング、ソート機能
3. **メインコンテンツ** - 会社一覧カード/テーブル
4. **ページネーション** - ページ切り替え
5. **モーダル** - 詳細表示、作成/編集フォーム
6. **トーストメッセージ** - 成功/エラー通知

---

## ⚠️ エラーハンドリング

### エラータイプ別処理
```typescript
interface ErrorHandling {
  // ネットワークエラー
  networkError: {
    display: '接続エラーが発生しました';
    retry: true;
  };
  
  // バリデーションエラー (400)
  validationError: {
    display: 'フィールド単位でエラー表示';
    highlight: 'エラーフィールドをハイライト';
  };
  
  // 認証エラー (401)
  authError: {
    display: '認証が必要です';
    redirect: '/login';
  };
  
  // 権限エラー (403)
  permissionError: {
    display: 'アクセス権限がありません';
    action: '前のページに戻る';
  };
  
  // データ不在エラー (404)
  notFoundError: {
    display: 'データが見つかりません';
    action: '一覧に戻る';
  };
  
  // サーバーエラー (500)
  serverError: {
    display: 'サーバーエラーが発生しました';
    retry: true;
  };
}
```

---

## 📱 レスポンシブ対応

### ブレイクポイント
```css
/* モバイルファースト設計 */
.mobile    { /* ~768px   */ }
.tablet    { /* 768px~   */ }
.desktop   { /* 1024px~  */ }
.wide      { /* 1280px~  */ }
```

### レイアウト調整
- **モバイル**: カード形式、縦スクロール
- **タブレット**: 2カラムグリッド
- **デスクトップ**: テーブル形式、サイドバー表示

---

## 🚀 パフォーマンス要件

### 最適化指針
```typescript
interface PerformanceRequirements {
  // ページロード
  initialLoad: '< 2秒';
  
  // APIレスポンス
  dataFetch: '< 1秒';
  
  // ページ遷移
  navigation: '< 500ms';
  
  // 検索・フィルタ
  filtering: '< 300ms (debounce付き)';
  
  // 最適化手法
  optimization: [
    'コンポーネントの遅延ロード',
    'APIレスポンスキャッシュ',
    '仮想化（大量データ対応）',
    'デバウンス処理（検索）'
  ];
}
```

---

## 📋 実装チェックリスト

### 基本機能
- [ ] 会社一覧表示（ページネーション付き）
- [ ] 会社詳細表示
- [ ] 新規会社作成
- [ ] 会社情報編集
- [ ] 会社削除
- [ ] 検索機能
- [ ] フィルタリング（事業者区分・運用状態）
- [ ] ソート機能

### UI/UX
- [ ] レスポンシブデザイン
- [ ] ローディング状態
- [ ] エラー表示
- [ ] 成功メッセージ
- [ ] 確認ダイアログ
- [ ] バリデーション表示

### パフォーマンス
- [ ] コンポーネント最適化
- [ ] APIキャッシュ
- [ ] 遅延ローディング
- [ ] デバウンス処理

### アクセシビリティ
- [ ] キーボード操作対応
- [ ] スクリーンリーダー対応
- [ ] 適切なARIA属性
- [ ] フォーカス管理

---

## 📝 AI実装指示例

```markdown
# フロントエンド実装指示

以下の資料を基に、鉄道会社管理システムのフロントエンドを実装してください：

## 使用資料
1. API.md - API仕様書
2. examples/api-spec.json - OpenAPI仕様
3. src/shared/types/ - TypeScript型定義
4. examples/sample-responses.json - レスポンス例

## 実装要件
- React + TypeScript使用
- TailwindCSS でスタイリング
- 全CRUD操作を実装
- レスポンシブデザイン対応
- エラーハンドリング実装

## 重要な実装ポイント
- CompanyType と CompanyStatus は enum として扱う
- ページネーション機能必須
- 検索・フィルタ機能必須
- 確認ダイアログ付き削除機能
```

この資料により、AIは構造化された情報に基づいて一貫性のあるフロントエンドを実装できます。