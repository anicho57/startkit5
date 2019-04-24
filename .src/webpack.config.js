module.exports = {
   // モード値を production に設定すると最適化された状態で、
   // development に設定するとソースマップ有効でJSファイルが出力される
  //  mode: "production",
   mode: "development",
   // メインのJS
   entry: {
     app : "./js/index.js"
    },
   // 出力ファイル
   output: {
     filename: "[name].js"
   },
  //  optimization: {
  //     splitChunks: {
  //       name: 'vendor',
  //       chunks: 'initial',
  //     }
  // },
   module: {
     rules: [
       {
         // 拡張子 .ts の場合
         test: /\.js$/,
         // TypeScript をコンパイルする
         use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2018 を ES5 に変換
                '@babel/preset-env',
              ]
            }
          }
        ]
       },
     ]
   },
   // import 文で .ts ファイルを解決するため
   resolve: {
      // extensions: [
      //    '.ts','.js'
      // ],
      // Webpackで利用するときの設定
      alias: {
        //  vue: 'vue/dist/vue.js'
         $: 'jquery',
         jQuery: 'jquery'
      }
   }
 }