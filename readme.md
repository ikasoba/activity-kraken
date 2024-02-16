<h1>
<p align="center">
🐙 activity kraken 🐙
</p>
</h1>

ActivityPubに対応したSNSなどのinboxへ配達されるオブジェクトをフィルタリングしたりするためのプロキシです。

# 必要なもの
- [docker](https://docs.docker.com/engine/install/)
- [deno](https://docs.deno.com/runtime/manual/getting_started/installation)

# セットアップ

> [!NOTE]
> このソフトウェアは `http` での接続を待ち受けるので `nginx` や `apache`、 `cloudflare tunnels` などで `https` から接続できるよう設定することをおすすめします。

デフォルトでは、ポート`8000`にて接続を待ち受けます。

```sh
git clone https://github.com/ikasoba/activity-kraken/

# 初期化用のスクリプトを実行する場合
sh init.sh

# 実行
docker compose up
```

# 設定

> [!NOTE]
> `.env-example` をコピーして `.env` を作成することをおすすめします。

`.env` へ設定を記入してください。
各設定の説明は `.env-example` に詳しく書いてあります。

プロキシ先をmisskeyいんすあなどへ指定することでこのプロキシを適用できます。
また、インスタンスのドメインなどからこのプロキシへ接続できるようにしないと効果はありません。

```sh
# プロキシが動くポート番号
PORT=8000

# プロキシ先
PROXY_HOST=https://example.com/

# 連合されてくる投稿などを除外するためのフィルタ用のファイル
# ファイル内容は改行で区切られた正規表現の一覧であるべきです
# また、一覧が空の場合はすべての投稿を許可します
CONTENT_FILTER_FILE=./content-filter.txt

# HTTPリクエストの最大サイズ
MAX_CONTENT_SIZE=512mb

# 連合されてくる投稿などの内容に含められるメンションの最大数
MAX_MENTIONS=3

# 連合されてくる投稿を受け入れられるホストのホワイトリスト
# ファイル内容は改行で区切られたホスト名の一覧であるべきです
# また、一覧が空の場合はすべてのホストをブロックします
# (一覧の中に `*` (半角アスタリスク) があるとワイルドカードとして処理します。)
HOST_FILTER_FILE=./host-filter.txt
```

# 投稿のフィルタ

`content-filter.txt` へ 正規表現を記入することでフィルタできます。

```
ジェネリッ+クすあま
ベイクドモチョチョ
```

と記入すれば `ベイクドモチョチョ` や `ジェネリックすあま`、 `ジェネリッッッックすあま` などが含まれる投稿をプロキシしないようにできます。

# 連合元のホワイトリスト

投稿などを連合できるホストをホワイトリストで管理できます。

`host-filter.txt` へホスト名を記入することで指定できます。

```
*
```

と記入すればすべてのホストを許可します。

```
example.com
example.net
```

と記入すれば example.com と example.net からのみ投稿などを受け入れます。

# (misskeyのみ) 連合しているインスタンス一覧の取り込み

ホストのホワイトリスト(デフォルトでは`./host-filter.txt`) を設定するためのヘルパーとして、連合しているインスタンスの一覧をAPIから取得するスクリプトが同封されています。

```sh
deno run -A scripts/getFederatingHosts.ts
```