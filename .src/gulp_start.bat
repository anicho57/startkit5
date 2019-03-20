@echo off
cd /d %~dp0
start gulp
exit


::sass --style compact --watch _sass:css --cache-location .sass-cache --compass
::node-sass -w _scss -o css --include-path _scss --source-map true --output-style compressed

:: --style      CSSのフォーマット
:: :expanded    {} で改行する形。よくみる CSS の記述形式はこれです。可読性たかし。
:: :nested      Sass ファイルのネストがそのまま引き継がれる形。
:: :compact     セレクタと属性を 1 行にまとめて出力。可読性低め。
:: :compressed  圧縮して出力（全ての改行・コメントをトルツメ）。可読性は投げ捨て。
:: --watch scssファイルの自動監視
:: sass:html/css sassファイルの場所:cssファイルの書き出し先
:: --cache-location キャッシュファイルの保存先

:: sudo gem install sass	Sassインストール
:: sudo gem install sass --pre	Sassプリリースインストール
:: sass --version	Sassバージョン確認
:: sass --watch style.scss:style.css	監視
:: sass --debug-info --watch style.scss:style.css	debug-info書き出し
:: sass --sourcemap --watch style.scss:style.css	Source maps書き出し
:: sass --style expanded --sourcemap --watch style.scss:style.css	アウトプットスタイル指定とSource maps書き出し
:: sass_options = {:debug_info => true}	[config.rb] Compassでdebug-info書き出し
:: sass --compass --sourcemap --watch style.scss:style.css	CompassでSource maps書き出し