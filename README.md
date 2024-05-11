[![License](https://img.shields.io/github/license/scombz-utilities/scombz-utilities-react?color=white&style=flat-square)](https://github.com/scombz-utilities/scombz-utilities-react/blob/main/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/scombz-utilities/scombz-utilities-react?color=white&style=flat-square)](https://github.com/scombz-utilities/scombz-utilities-react/graphs/contributors)
![Version for Chrome](https://img.shields.io/chrome-web-store/v/iejnanaabfgocfjbnmhkfheghbkanibj?color=yellow&style=flat-square)
![Chrome Users](https://img.shields.io/chrome-web-store/users/iejnanaabfgocfjbnmhkfheghbkanibj?color=yellow&style=flat-square)
![Version for Firefox](https://img.shields.io/amo/v/scombz-utilities?color=red&style=flat-square)
![Firefox Users](https://img.shields.io/amo/users/scombz-utilities?color=red&style=flat-square)

# ScombZ Utilities

使いにくい ScombZ のサイドメニューやテストを修正したり、ADFS ボタンの自動スキップができます。よりユーザビリティに優れた ScombZ を提供します。

[公式サイト](https://scombz-utilities.github.io/)

[![Chrome 版のリンク](./chrome.png)](https://chrome.google.com/webstore/detail/scombz-utilities/iejnanaabfgocfjbnmhkfheghbkanibj)

[![Firefox 版のリンク](./firefox.png)](https://addons.mozilla.org/ja/firefox/addon/scombz-utilities/)

## Tips

このプロジェクトは 旧 ScombZ Utilities からのリニューアル版です。
旧コードは以下のリポジトリにあります。

https://github.com/scombz-utilities/scombz-utilities-legacy

## 環境構築

環境構築は、ローカルで `Node.js` 環境を構築する方法と、Dockerを使った方法があります。  
パフォーマンス上の理由からローカルでの開発を推奨しますが、環境構築の手間を省くためにDockerを使うこともできます。  
WSL・Macを使用中の場合はローカル、Windowsを使用中の場合はDockerを使用することをお勧めします。

### ローカルでの開発

<details>
<summary> ローカルでの環境構築 </summary>

注意: **Nodeのバージョンは必ず`.node-version`記載のものに合わせること**

### nodeの準備

nodeのバージョンをは`20.11.1`で固定とします。

`.node-version`ファイルでバージョンを指定しているため、対応したバージョン管理ツールを使ってインストールしてください。
[asdf](https://asdf-vm.com/)や[nodenv](https://github.com/nodenv/nodenv)などのバージョン管理ツールを使うとよいでしょう。
このreadmeでは`nodenv`を使ったガイドを載せます。

---

<details>
<summary> asdfで実行する際の注意 </summary>

`asdf` の場合は`.node-version`を標準では読み込まないため、`~/.asdfrc`に以下の記述を追加してください。

```bash
legacy_version_file = yes
```

</details>

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

(記事確認時点では `v20.9.0`)

確認したバージョンをnodenvでインストールします。

( `.node-version`に記載されているのがv20.9.0でない場合はコマンドを適切に変更してください)

```bash
$ nodenv install 20.9.0
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

(記事確認時点では `v20.9.0`)

確認したバージョンをnodenvでインストールします。

( `.node-version`に記載されているのがv20.9.0でない場合はコマンドを適切に変更してください)

```bash
$ nodenv install 20.9.0
$ nodenv global 20.9.0
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

</details>

---

### Dockerでの開発

<details>
<summary> Dockerでの環境構築 </summary>

1. (まだの場合は)[Docker Desktop](https://www.docker.com/get-started/)をインストールしてください。
1. 以下のコマンドを実行して必要なモジュールをインストールしてください。makeコマンドが使えない場合は、makeをインストールするか、直接docker-composeコマンドを実行してください。

```bash
$ make i
or
$ docker compose run --rm app npm i
```

### 開発サーバーの立ち上げ

以下のコマンドで開発サーバーを立ち上げられます。
`build/chrome-mv3-dev`を読み込んでください。
tsxファイル等を更新するとライブローディングされます。

```bash
$ make dev
or
$ docker compose run --rm app npm run dev
```

### 配布用のビルド

以下のコマンドでビルドできます。
ChromeとFireFoxに対応したビルドがそれぞれ生成されます。

```bash
$ make build
or
$ docker compose run --rm app npm run build
```

</details>

## VScodeでの設定

開発においてコーディングルールをeslintに定義しています。
VScodeでは自動的にルールに合っているか解析+ルールに合ったように整形を行うことができるため、以下の拡張機能をインストールしてください。
VScodeのユーザー設定は`.vscode`ディレクトリ内に定義済みのため特に変える必要はない(はず)です。

- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## コーディング規則

- 基本的にすべてのコードは`src`、すべての外部ファイルは`assets`内に記載します。
- content_scriptはなるべくページ単位で`contents`ディレクトリ直下に記載してください。
- `contents`ファイル直下に1機能につき1つの`ts`もしくは`tsx`ファイルを設置し、コンポーネントや共通モジュールを定義する場合は`components`や`util`内に記載してimportで読み込んでください。
- Plasmoとの相性が悪いためLintではあえて指定していませんが、基本的に変数名はキャメルケースで統一します。特別な事情がない限りスネークケースは使わないでください。
- DOM操作は可読性のために`tsx`ではなく`ts`ファイル内に記述してください。同じ機能で`ts`と`tsx`の両方が必要になる場合、`tsx`でPlasmoの読み込みを行い`useEffect`等でtsを読み込みます。
- ライブラリを追加する場合、共同開発者は全員が再度`npm i`をする必要が生じます。影響範囲も大きいので必ず相談をしてください。
- 関数定義の際`function`は使わずアロー関数で定義します。
- 基本的にはJSX構文ではMUIコンポーネントを使ってください。

## 主なライブラリ

- [Plasmo](https://docs.plasmo.com/)
- [MUI](https://mui.com/material-ui/)
- ESLint
- Prettier
- TypeScript
