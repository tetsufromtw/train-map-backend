#!/bin/bash
# API仕様書エクスポートスクリプト

echo "🚀 Train Map Backend APIデータエクスポート開始..."

# アプリケーションが起動しているかチェック
if ! curl -s http://localhost:3000/api > /dev/null; then
    echo "❌ エラー: アプリケーションが起動していません"
    echo "   以下のコマンドでアプリを起動してください:"
    echo "   npm run start:dev"
    exit 1
fi

# エクスポートディレクトリ作成
mkdir -p examples/api-responses

echo "📄 OpenAPI仕様書をエクスポート中..."
curl -s http://localhost:3000/api-json | jq '.' > examples/api-spec.json
echo "✅ api-spec.json を作成しました"

echo "📝 サンプルレスポンスをエクスポート中..."

# 会社一覧（最初の3件）
echo "  - 会社一覧サンプル..."
curl -s "http://localhost:3000/companies?limit=3" | jq '.' > examples/api-responses/companies-list.json

# 会社詳細（JR北海道）
echo "  - 会社詳細サンプル..."
curl -s "http://localhost:3000/companies/1" | jq '.' > examples/api-responses/company-detail.json

# 事業者区分一覧
echo "  - 事業者区分一覧..."
curl -s "http://localhost:3000/companies/types" | jq '.' > examples/api-responses/company-types.json

# 運用状態一覧
echo "  - 運用状態一覧..."
curl -s "http://localhost:3000/companies/statuses" | jq '.' > examples/api-responses/company-statuses.json

# フィルタリング例
echo "  - フィルタリング例（JR会社のみ）..."
curl -s "http://localhost:3000/companies?companyType=1&limit=5" | jq '.' > examples/api-responses/companies-jr-only.json

# 検索例
echo "  - 検索例（「JR」で検索）..."
curl -s "http://localhost:3000/companies?search=JR&limit=5" | jq '.' > examples/api-responses/companies-search-jr.json

echo ""
echo "🎉 エクスポート完了！"
echo ""
echo "📁 作成されたファイル:"
echo "   - examples/api-spec.json (OpenAPI仕様書)"
echo "   - examples/api-responses/ (サンプルレスポンス)"
echo ""
echo "🔧 フロントエンド開発者への提供ファイル:"
echo "   1. API.md (日本語API仕様書)"
echo "   2. examples/api-spec.json (OpenAPI仕様書)"
echo "   3. examples/api-responses/ (実際のレスポンス例)"
echo "   4. src/shared/types/ (TypeScript型定義)"
echo "   5. src/shared/dto/ (DTO定義)"