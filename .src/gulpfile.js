var path = {
    src : '', // Gulpに関わるもろもろ
    dist : '../', // 公開ファイル置き場
};

// gulp本体
var gulp = require('gulp');
// Browser Sync
var browsersync = require('browser-sync').create();
// BrowserSync
function browserSync(done) {
  browsersync.init({
    open: false,
    reloadDelay: 0,
    proxy: '127.0.0.1',
    ghostMode: {
        clicks: false,
        forms: false,
        scroll: false
    }
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

gulp.task('src-reload', function(){
    browserSync.reload();
});
// bs reload target
// cssはsass taskで
var html_src = [
    path.dist + '**/*.html',
    path.dist + '**/*.php',
    path.dist + '**/*.js',
    // path.dist + '**/*.{png,jpg,gif,svg}',
    '!'+path.dist+'.src/**/*.*'
];

// 変更ファイルのみ抽出
// var changed = require('gulp-changed');
var cache = require('gulp-cached');
var sassPartialsImported = require('gulp-sass-partials-imported');
// sassコンパイル
var sass_src = path.src + 'sass/**/*.scss';
var sass_dist = path.dist + 'css/';
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
// var postcss = require('gulp-postcss');
// var cssnext = require('postcss-cssnext');
var prefix = require('gulp-autoprefixer');
// var csscomb = require('gulp-csscomb');
var sassglob = require("gulp-sass-glob");

function css(){
    // var processors = [
    //   cssnext({
    //       browsers: ['last 3 versions', 'ie 11', 'ios 10', 'android 4.4'],
    //   })
    // ];
    return gulp.src(sass_src)

        .pipe(cache('sass'))
        // .pipe(sassglob())
        .pipe(sassPartialsImported(path.src + 'sass/'))

        .pipe(sourcemaps.init()) // ソースマップ吐き出す設定
        // .pipe(plumber({ // エラー時にgulpが止まらない。
        //     errorHandler: notify.onError('Error: <%= error.message %>') // gulp-notifyでエラー通知を表示
        // }))
        // :expanded        {} で改行する形。よくみる CSS の記述形式はこれです。可読性たかし。
        // :nested      Sass ファイルのネストがそのまま引き継がれる形。
        // :compact     セレクタと属性を 1 行にまとめて出力。可読性低め。
        // :compressed  圧縮して出力（全ての改行・コメントをトルツメ）。可読性は投げ捨て。
        // .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sass({outputStyle: 'compressed'}).on('error', function(err) {
            console.error(err.message);
            browsersync.notify(err.message.replace(/\r\n/g, "<br>").replace(/(\n|\r)/g, "<br>"), 6000); // Display error in the browser
            this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
        }))
        // .pipe(postcss(processors))
        .pipe(prefix({
          browsers: ['last 2 versions', 'ie 11', 'ios 10', 'android 4.4'],
          cascade: false,
          grid: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest( sass_dist ))
        .pipe(browsersync.stream({match: '**/*.css'}));
};


var js_src = path.src + 'js/**/*.js';
var ts_src = path.src + 'ts/**/*.ts';
var js_dist = path.dist + 'js/';
var plumber = require("gulp-plumber");
var webpack = require('webpack');
var webpackstream = require('webpack-stream');
var webpackconfig = require('./webpack.config.js');

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp.src(js_src)
      .pipe(plumber())
      .pipe(webpackstream(webpackconfig, webpack))
      // folder only, filename is specified in webpack config
      .pipe(gulp.dest(js_dist))
    //   .pipe(browsersync.stream())
  );
}


gulp.task('default', gulp.series( gulp.parallel(browserSync,  function(){

    gulp.watch( html_src, browserSyncReload );
    gulp.watch( sass_src, css );
    gulp.watch( js_src, scripts );

})));

