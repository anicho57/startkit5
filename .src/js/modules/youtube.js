import $ from 'jquery';

export function setBgYoutube(){
   var tag = document.createElement('script');
   tag.src = "https://www.youtube.com/iframe_api";
   var firstScriptTag = document.getElementsByTagName('script')[0];
   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

   var player;
   var yid = 'qWhXixtNFsc';
   window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player('js-movie', {
         width: '1280',
         height: '720',
         videoId: yid,
         playerVars: {
            'showinfo': 0,
            // 'autoplay': 1,
            // 'loop': 1,
            // 'playlist': yid,
            'controls': 0,
            'rel': 0,
            'iv_load_policy': 3
         },
         events: {
            'onReady': function(e) {
               player.mute();
               player.playVideo();

               var timer = new Timer(function () {
                  player.seekTo(0)
                  timer.reset(player.getDuration() * 1000 - 10);
               }, player.getDuration() * 1000);

            },
            'onStateChange': function(e){
               // console.log(e.data);
               if (e.data == YT.PlayerState.ENDED) {
                  player.playVideo();
               }
               if (e.data == YT.PlayerState.PLAYING) {
                  $('#js-movie-intro-bg').addClass('is-hide');
               }
            }
         }
      });
   }
   function Timer(fn, t) {
      var timerObj = setInterval(fn, t);

      this.stop = function () {
         if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
         }
         return this;
      }

      this.start = function () {
         if (!timerObj) {
            this.stop();
            timerObj = setInterval(fn, t);
         }
         return this;
      }

      this.reset = function (newT) {
         t = newT;
         return this.stop().start();
      }
   }
}
