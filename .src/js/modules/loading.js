import $ from 'jquery';
import { TweenLite } from 'gsap/TweenMax';

export function pageLoading() {
   let now_position = 0; //プログレスバーの現在の位置
   var imgs = document.images; //すべての画像
   var len = imgs.length; //画像の総数
   var loaded_counter = 0; //読み込み完了の数値
   var loadingBody = $('#js-loading');
   var progress = $("#js-progress"); //プログレスバーの要素
   var timer = null;

   for (var i = 0; i < len; i++) {
      let img = new Image();
      img.src = imgs[i].src;
      img.onload = function(){
         loaded_counter++;
      }
   };
   window.addEventListener('load',function(){
      loaded_counter = len;
   });

   timer = setInterval(function () {
      if (now_position > 99.9) {
         now_position = 100;
         clearInterval(timer);
         timer = null;
         loadingBody.addClass('is-loaded');
         TweenLite.to('#js-load-u', 1, {
            delay: .2,
            y: "-100%"
         });
         TweenLite.to('#js-load-d', 1, {
            delay: .2,
            y: "100%",
            onComplete: function () {
               $('#js-loading').remove();
            }
         });
      }
      // 読込画像数/画像総数*100のパーセント算出
      var target_position = (loaded_counter / len) * 100;
      now_position += (target_position - now_position) * 0.2;
      $("#js-percent").text(Math.floor(now_position) + '%'); //読込量を取得
      $(progress).css("transform", "scaleX(" + now_position / 100 + ")"); //幅を代入
   }, 25);
}
