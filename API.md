# Train Map Backend API 仕様書

## 概要
FAANG企業レベルの電車マップバックエンドAPIです。鉄道会社データの完全なCRUD操作を提供します。

## ベースURL
```
http://localhost:3000
```

## Swagger UI
対話型API文書：`http://localhost:3000/api`

---

## 📋 エンドポイント一覧

### 1. 鉄道会社一覧取得
**GET** `/companies`

**説明**: ページネーション、フィルタリング、検索機能付きで鉄道会社一覧を取得

**クエリパラメータ**:
```typescript
{
  companyType?: 0 | 1 | 2 | 3;  // 0:その他, 1:JR, 2:大手私鉄, 3:準大手私鉄
  status?: 0 | 1 | 2;           // 0:運用中, 1:運用前, 2:廃止
  search?: string;              // 会社名での検索
  page?: number;                // ページ番号 (デフォルト: 1)
  limit?: number;               // 1ページあたりの件数 (デフォルト: 10, 最大: 100)
  sortBy?: string;              // ソート項目 (デフォルト: "sortOrder")
  sortOrder?: "asc" | "desc";   // ソート順 (デフォルト: "asc")
}
```

**レスポンス例**:
```json
{
  "data": [
    {
      "companyCode": 1,
      "railwayCode": 11,
      "companyName": "JR北海道",
      "companyNameKana": "ジェイアールホッカイドウ",
      "companyNameOfficial": "北海道旅客鉄道株式会社",
      "companyNameAbbreviated": "JR北海道",
      "companyUrl": "http://www.jrhokkaido.co.jp/",
      "companyType": 1,
      "status": 0,
      "sortOrder": 1
    }
  ],
  "total": 175,
  "page": 1,
  "limit": 10,
  "totalPages": 18
}
```

### 2. 鉄道会社詳細取得
**GET** `/companies/{companyCode}`

**説明**: 指定された会社コードの鉄道会社詳細を取得

**パスパラメータ**:
- `companyCode` (number): 事業者コード

**レスポンス例**:
```json
{
  "companyCode": 1,
  "railwayCode": 11,
  "companyName": "JR北海道",
  "companyNameKana": "ジェイアールホッカイドウ",
  "companyNameOfficial": "北海道旅客鉄道株式会社",
  "companyNameAbbreviated": "JR北海道",
  "companyUrl": "http://www.jrhokkaido.co.jp/",
  "companyType": 1,
  "status": 0,
  "sortOrder": 1
}
```

### 3. 鉄道会社新規作成
**POST** `/companies`

**説明**: 新しい鉄道会社を作成

**リクエストボディ**:
```json
{
  "companyCode": 999,
  "railwayCode": 99,
  "companyName": "新規鉄道会社",
  "companyNameKana": "シンキテツドウガイシャ",
  "companyNameOfficial": "新規鉄道株式会社",
  "companyNameAbbreviated": "新規鉄道",
  "companyUrl": "http://www.example.com/",
  "companyType": 0,
  "status": 1,
  "sortOrder": 999
}
```

### 4. 鉄道会社更新
**PATCH** `/companies/{companyCode}`

**説明**: 既存の鉄道会社情報を更新

**パスパラメータ**:
- `companyCode` (number): 事業者コード

**リクエストボディ** (部分更新可能):
```json
{
  "companyName": "更新された会社名",
  "status": 0
}
```

### 5. 鉄道会社削除
**DELETE** `/companies/{companyCode}`

**説明**: 指定された鉄道会社を削除

**パスパラメータ**:
- `companyCode` (number): 事業者コード

**レスポンス**: `204 No Content`

### 6. 事業者区分一覧取得
**GET** `/companies/types`

**説明**: 利用可能な事業者区分の一覧を取得

**レスポンス例**:
```json
[
  { "value": 0, "label": "その他" },
  { "value": 1, "label": "JR" },
  { "value": 2, "label": "大手私鉄" },
  { "value": 3, "label": "準大手私鉄" }
]
```

### 7. 運用状態一覧取得
**GET** `/companies/statuses`

**説明**: 利用可能な運用状態の一覧を取得

**レスポンス例**:
```json
[
  { "value": 0, "label": "運用中" },
  { "value": 1, "label": "運用前" },
  { "value": 2, "label": "廃止" }
]
```

### 8. データ再読み込み
**GET** `/companies/reload`

**説明**: CSVファイルからデータを再読み込み

**レスポンス例**:
```json
{
  "message": "Companies reloaded from CSV successfully"
}
```

---

## 📊 データモデル

### Company型定義
```typescript
interface Company {
  companyCode: number;           // 事業者コード (必須, ユニーク)
  railwayCode: number;           // 鉄道コード (必須, 10-99)
  companyName: string;           // 事業者名 (必須)
  companyNameKana?: string;      // 事業者名カナ (任意)
  companyNameOfficial?: string;  // 正式名称 (任意)
  companyNameAbbreviated?: string; // 略称 (任意)
  companyUrl?: string;           // WebサイトURL (任意)
  companyType?: CompanyType;     // 事業者区分 (任意)
  status?: CompanyStatus;        // 運用状態 (任意)
  sortOrder?: number;            // 並び順 (任意)
}
```

### Enum定義
```typescript
enum CompanyType {
  OTHER = 0,           // その他
  JR = 1,             // JR
  MAJOR_PRIVATE = 2,  // 大手私鉄
  SEMI_MAJOR_PRIVATE = 3 // 準大手私鉄
}

enum CompanyStatus {
  ACTIVE = 0,         // 運用中
  PRE_OPERATION = 1,  // 運用前
  ABOLISHED = 2       // 廃止
}
```

---

## 🚨 エラーレスポンス

### HTTPステータスコード
- **200**: 成功
- **201**: 作成成功
- **204**: 削除成功
- **400**: 不正なリクエスト（バリデーションエラー）
- **404**: リソースが見つからない
- **500**: サーバー内部エラー

### エラーレスポンス形式
```json
{
  "statusCode": 400,
  "message": ["companyName should not be empty"],
  "error": "Bad Request"
}
```

---

## 🔧 使用例

### JavaScript/TypeScript実装例
```javascript
// 会社一覧取得
const getCompanies = async (page = 1, limit = 10) => {
  const response = await fetch(`/companies?page=${page}&limit=${limit}`);
  return await response.json();
};

// 新規会社作成
const createCompany = async (companyData) => {
  const response = await fetch('/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData),
  });
  return await response.json();
};

// 会社更新
const updateCompany = async (companyCode, updateData) => {
  const response = await fetch(`/companies/${companyCode}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  return await response.json();
};
```

---

## 📝 フロントエンド実装ガイド

### 推奨実装機能
1. **会社一覧表示** - ページネーション付き
2. **検索・フィルタ機能** - 会社名、事業者区分、運用状態
3. **詳細表示** - モーダルまたは詳細ページ
4. **CRUD操作** - 作成、更新、削除フォーム
5. **レスポンシブデザイン** - モバイル対応
6. **エラーハンドリング** - ユーザーフレンドリーなエラー表示

### 状態管理推奨構造
```typescript
interface AppState {
  companies: {
    data: Company[];
    loading: boolean;
    error: string | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters: {
      search: string;
      companyType?: CompanyType;
      status?: CompanyStatus;
    };
  };
}
```