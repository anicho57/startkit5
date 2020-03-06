import $ from 'jquery';
const imagesLoaded = require('imagesloaded');

export function pageLoading() {
   var loadingBody = $('#js-loading');
   var progress = $("#js-progress"); //プログレスバーの要素
   let r;

   $('body').imagesLoaded({ background: true })
      .progress( function( instance, image ) {
         // console.log(instance);
         let target_position = (instance.progressedCount / instance.images.length);
         // console.log(instance.progressedCount,instance.elements.length);
         $(progress).css("transform", "scaleX(" + target_position + ")"); //幅を代入
      })
      .done( function( instance ) {
         loadingOpen()
      })
      .fail( function() {
         loadingOpen()
      //   console.log('all images loaded, at least one is broken');
      });

   function figureRadius(w, h) {
      return Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / 2;
   }
   function loadingOpen(){
      // var data = document.querySelector("#load-page").getBBox();
      // r = figureRadius(data.width, data.height);
      TweenLite.to( '#js-loadtext', .7,{
            opacity: 0,
            onComplete: function () {
               loadingBody.addClass('is-loaded');
            }
         },
      );

      TweenMax.to("#load-cover", 1, {
         delay: .5,
         attr: { height: "100%" } ,
         onComplete: function () {
            $('#js-loading').remove();
         },
         ease : Power2.easeInOut
      });
      TweenMax.to("#load-cc", .9, {
         delay: .5,
         attr: { height: "100%" } ,
         ease : Power2.easeInOut
      });
   }
}
