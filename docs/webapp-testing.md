# webapp-testing

## 概要
`webapp-testing` は、Playwrightを使ってローカルWebアプリケーションを検証・デバッグするための Skill です。静的HTMLと動的Webアプリを切り分け、必要に応じてサーバー起動補助スクリプトを使いながら、DOM確認、スクリーンショット、セレクタ探索、操作検証を行います。

## 使う場面
- ローカルWebアプリのUI動作を Playwright で確認したい。
- フロントエンドの表示崩れ、操作不具合、コンソールエラーを調べたい。
- 動的アプリでレンダリング後のDOMやスクリーンショットを確認したい。
- 開発サーバーを起動してからブラウザ自動化を実行したい。

## 使わない場面
- Web UIを伴わないバックエンドやCLIのテスト。
- Playwrightではなく既存のユニットテストだけで十分な作業。
- サーバー起動やブラウザ操作なしに静的なコードレビューだけをしたい場合。

## 実行フロー
1. 対象が静的HTMLか動的Webアプリかを確認する。
2. 動的Webアプリでサーバーが未起動なら、`scripts/with_server.py --help` を先に確認する。
3. Playwrightスクリプトでページに移動し、`networkidle` を待つ。
4. スクリーンショット、DOM、コンソールログからセレクタと状態を把握する。
5. 発見したセレクタで操作や検証を実行し、ブラウザを閉じる。

## 生成・更新する主な成果物
- Playwright を使った検証スクリプト
- スクリーンショットやDOM調査結果
- コンソールログ、UI不具合の再現情報
- ローカルサーバー起動を含む検証手順

## 参照リソース
- `SKILL.md`
- `LICENSE.txt`
- `scripts/with_server.py`
- `examples/element_discovery.py`
- `examples/static_html_automation.py`
- `examples/console_logging.py`

## 注意点
- 動的アプリではDOM確認前に必ず `networkidle` を待つ。
- `scripts/with_server.py` はまず `--help` を実行し、必要になるまで中身を読まない。
- ブラウザは headless の Chromium を使い、処理後に必ず閉じる。
- セレクタは実際にレンダリングされた状態を確認してから決める。
