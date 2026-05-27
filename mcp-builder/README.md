# mcp-builder

## 概要
`mcp-builder` は、LLMが外部APIやサービスを扱えるようにする高品質な MCP Server を設計・実装するための Skill です。調査、設計、TypeScript または Python での実装、テスト、評価作成までの流れを扱います。

## 使う場面
- 外部APIや社内サービスを MCP Server として公開したい。
- TypeScript MCP SDK または Python/FastMCP でサーバーを実装したい。
- LLMが使いやすいツール名、入力スキーマ、出力形式、エラー応答を設計したい。
- 実装後に MCP Inspector や評価問題で品質を確認したい。

## 使わない場面
- MCPではない通常のWeb APIやCLIを作るだけの場合。
- 外部サービス仕様や認証方式を調査しないまま実装したい場合。
- 破壊的操作を含むツールを、安全性や注釈なしに追加したい場合。

## 実行フロー
1. MCP仕様、対象API、認証方式、主要ユースケースを調査する。
2. 包括的なAPIカバレッジとワークフロー向けツールのバランスを決める。
3. ツール名、入力スキーマ、出力スキーマ、ページネーション、エラー応答を設計する。
4. TypeScript または Python の実装ガイドに沿ってサーバーを作る。
5. ビルド、構文確認、MCP Inspector で動作を検証する。
6. 実データに基づく読み取り専用の評価問題を作成し、LLMが使えるか確認する。

## 生成・更新する主な成果物
- MCP Server の実装コード
- ツール定義、入力スキーマ、出力スキーマ
- APIクライアント、認証処理、ページネーション、エラー処理
- MCP Inspector での検証結果
- 評価用XMLや質問回答セット

## 参照リソース
- `SKILL.md`
- `LICENSE.txt`
- `reference/mcp_best_practices.md`
- `reference/node_mcp_server.md`
- `reference/python_mcp_server.md`
- `reference/evaluation.md`
- `scripts/connections.py`
- `scripts/evaluation.py`
- `scripts/example_evaluation.xml`
- `scripts/requirements.txt`

## 注意点
- ツール説明とエラーは、LLMが次に何をすべきか判断できる具体性にする。
- 認証情報や秘密情報をコードや評価データに含めない。
- 破壊的操作には `destructiveHint` などの注釈と慎重な設計を入れる。
- 評価問題は独立、読み取り専用、現実的、検証可能、安定した答えを持つものにする。
