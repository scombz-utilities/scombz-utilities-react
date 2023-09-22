# ScombZ Utilitiesモダン化プロジェクト

ScombZ UtilitiesをReactとTypeScriptでモダン化しよう

## Plasmoに関する日本語ドキュメントは以下参照

https://zenn.dev/nado1001/articles/plasmo-browser-extension

content scriptは`contents`内に記載
backgroundはbackgrounds.tsに記載

## 環境構築

注意: **Nodeのバージョンは必ず`.node-version`記載のものに合わせること**

### nodeの準備

nodeのバージョンをは`20.5.1`で固定とします。
2023年9月現在、最新のLTSではあるので普通に`brew install node`でも動きはするのですが、
今後nodeを使い続けることと、このレポジトリ以外でのプロジェクトでバージョン違いが起こると大変なので
[asdf](https://asdf-vm.com/)や[nodenv](https://github.com/nodenv/nodenv)などのバージョン管理ツールを使うとよいでしょう。
このreadmeでは`nodenv`を使ったガイドを載せるので、**こちらの利用を強く推奨**します。

---

<details>
<summary> nodenvのインストール for Mac </summary>

① HomeBrewでnodenvのインストールを行います。

```bash
$ brew install nodenv
```

② `~/.zshrc`の最終行にhookを追加します。以下のコマンド2つを実行してください。

（echoではなく、vim等で直接書き込んでも問題ありません）

```bash
$ echo 'export PATH="$HOME/.nodenv/bin:$PATH"' >> ~/.zshrc
```

```bash
$ echo 'eval "$(nodenv init -)"' >> ~/.zshrc
```

③ このままでは `.zshrc`が読み込まれていないので、再読み込みを行います。

```bash
$ source ~/.zshrc
```

④ `.node-version`に記載されているnodeのバージョンを確認して下さい。

(記事確認時点では `v20.5.1`)

確認したバージョンをnodenvでインストールします。

( `.node-version`に記載されているのがv20.5.1でない場合はコマンドを適切に変更してください)

```bash
$ nodenv install 20.5.1
```

⑤ nodenvをリフレッシュします

```bash
$ nodenv rehash
```

⑥ インストールされたnodeのバージョンが合っているかを確認します

```bash
$ node -v
```

</details>

<details>
<summary> nodenvのインストール for Windows (Ubuntu)</summary>

**ここからは必ずWSL Ubuntuを使用してください**

① ビルドツールが無いかもしれないのでインストールします(あればスキップで構わない)

```bash
$ sudo apt install build-essential
```

② 公式の手順でnodenvのインストールを行います(公式: https://github.com/nodenv/nodenv)。さらに、 `nodenv install` を有効にするため、node-buildもインストールします(野良記事: https://omohikane.com/ubuntu_intall_nodenv/)。

```bash
$ git clone https://github.com/nodenv/nodenv.git ~/.nodenv
$ cd ~/.nodenv && src/configure && make -C src
$ git clone https://github.com/nodenv/node-build.git ~/.nodenv/plugins/node-build
```

③ `~/.bashrc`の最終行にhookを追加します。以下のコマンド2つを実行してください。

（echoではなく、vim等で直接書き込んでも問題ありません）

（bash以外のシェルを使っている場合は出力先を適宜変更してください）

```bash
$ echo 'export PATH="$HOME/.nodenv/bin:$PATH"' >> ~/.bashrc
```

```bash
$ echo 'eval "$(nodenv init -)"' >> ~/.bashrc
```

③ このままでは `.bashrc`が読み込まれていないので、再読み込みを行います。

```bash
$ source ~/.bashrc
```

④ `.node-version`に記載されているnodeのバージョンを確認して下さい。

(記事確認時点では `v20.5.1`)

確認したバージョンをnodenvでインストールします。

( `.node-version`に記載されているのがv20.5.1でない場合はコマンドを適切に変更してください)

```bash
$ nodenv install 20.5.1
$ nodenv global 20.5.1
```

⑤ nodenvをリフレッシュします

```bash
$ nodenv rehash
```

⑥ インストールされたnodeのバージョンが合っているかを確認します

```bash
$ node -v
```

</details>

---

### 依存関係パッケージのインストール

このレポジトリでは基本的にパッケージ管理には`npm`を用います。
以下のコマンドを実行して依存関係をインストールしてください。

```bash
$ npm i
```

### VScodeでの開発

開発においてコーディングルールをeslint, stylelintに定義しています。
VScodeでは自動的にルールに合っているか解析+ルールに合ったように整形を行うことができるため、以下の拡張機能をインストールしてください。
VScodeのユーザー設定は`.vscode`ディレクトリ内に定義済みのため特に変える必要はない(はず)です。

- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

### 開発サーバーの立ち上げ

以下のコマンドで開発サーバーを立ち上げられます。
`build/chrome-mv3-dev`を読み込んでください。
tsxファイル等を更新するとライブローディングされます。

```bash
$ npm run dev
```

### 配布用のビルド

以下のコマンドでビルドできます。
ChromeとFireFoxに対応したビルドがそれぞれ生成されます。

```bash
$ npm run build
```

## 主なライブラリ

- [Plasmo](https://docs.plasmo.com/)
- [MUI](https://mui.com/material-ui/)
- react-hook-form
- ESLint
- StyleLint
- Prettier
- sass
