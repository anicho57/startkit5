import Barba from "barba.js";
import Velocity from 'velocity-animate';
import anime from 'animejs';
import $ from 'jquery';

Barba.Pjax.Dom.wrapperId = "js-container";
Barba.Pjax.Dom.containerClass = "page-content";
Barba.Pjax.Dom.dataNamespace = "page";
Barba.Pjax.ignoreClassLink = "no-ajax";

// Barba.Pjax.init();
Barba.Pjax.start();
Barba.Prefetch.init();

const FadeTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise
      .all([this.newContainerLoading, this.fadeOut()])
      .then(this.fadeIn.bind(this));
  },

  fadeOut: function() {
    return $(this.oldContainer).animate({ opacity: 0 }).promise();
  },

  fadeIn: function() {

    var _this = this;
    var $el = $(this.newContainer);
    $(this.oldContainer).hide();
    $el.css({
      visibility : 'visible',
      opacity : 0
    });
    $el.animate({ opacity: 1 }, 400, function() {
      _this.done();
    });
  }
});

var Animation1 = Barba.BaseTransition.extend({
    start: function(){
        this.newContainerLoading.then( this.finish.bind(this) );
    },
    finish: function(){
      var _this = this;
      Velocity( document.body, 'scroll', {
         duration: 700,
         easing: 'easeInOutExpo',
         complete: function(){
            _this.done();
         }
      });
    }
});

var Animation2 = Barba.BaseTransition.extend({
   start: function() {
         Promise
            .all([this.newContainerLoading, this.loadOut()])
            .then(this.loadIn.bind(this));
    },
    loadOut: function(resolve) {
        new Promise(function(resolve, reject) {
            anime({
                targets: this.oldContainer,
                opacity: 0,
                translateY: '-50vw'
            });
            resolve();
        })
    },
    loadIn: function() {
        var _this = this;
        anime({
            targets: this.newContainer,
            opacity: 1,
            translateY: ['80vh', 0],
            easing: 'easeInOutQuart'
        });
        $(this.oldContainer).hide();
        // 完了
        _this.done();
    },
});

Barba.Pjax.getTransition = function() {
  return FadeTransition;
//   return Animation2;
};

// head tag adjustment
Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container, newPageRawHTML) {
   var head = document.head;

   var newPageRawHead = newPageRawHTML.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
   var newPageHead = document.createElement('head');
   newPageHead.innerHTML = newPageRawHead;

   var removeHeadTags = [
      "meta[name='description']",
      "meta[property^='og']",
      "meta[name^='twitter']",
      "meta[itemprop]",
      "link[itemprop]", "link[rel='prev']",
      "link[rel='next']",
      "link[rel='canonical']"
   ].join(',');
   var headTags = head.querySelectorAll(removeHeadTags)
   for (var i = 0; i < headTags.length; i++) {
      head.removeChild(headTags[i]);
   }
   var newHeadTags = newPageHead.querySelectorAll(removeHeadTags)

   for (var i = 0; i < newHeadTags.length; i++) {
      head.appendChild(newHeadTags[i]);
   }

   // var $body = document.querySelector('body');
   //  if ( oldStatus && oldStatus.namespace ) {
   //      if ( ! currentStatus
   //      || ( currentStatus.namespace && currentStatus.namespace !== oldStatus.namespace ) ) {
   //          $body.removeClass( oldStatus.namespace );
   //      }
   //  }
   //  if ( currentStatus && currentStatus.namespace ) {
   //      $body.addClass( currentStatus.namespace );
   //  }
});

// Googleアナリティクスに情報を送る
// Barba.Dispatcher.on('initStateChange', function() {
//   if (typeof ga === 'function') {
//     ga('send', 'pageview', window.location.pathname.replace(/^\/?/, '/') + window.location.search);
//   }
// });

// var PageTransition = Barba.BaseTransition.extend({
//    start: function() {
//         // startはページトランジションの開始時に呼び出されるメソッド
//         var _this = this;
//         var _LoadOut =  new Promise(function(resolve) {
//             _this.LoadOut(resolve);
//         });

//         // トランジション開始と同時にnewContainerLoadingメソッドも呼ばれ、
//         // トランジション用のメソッドとどちらもresolve()であればthen()が呼ばれる。
//         Promise
//             .all([this.newContainerLoading, this.loadOut()])
//             .then(this.loadIn.bind(this));
//    },
//    loadOut :function(resolve){
//       // 何かアニメーション処理を書いてその処理が完了した際にresolve()を実行する。
//          // var _this = this;
//          // var _newc = this.newContainer;
//          // var _oldc = this.oldContainer;
//          // resolve();
//    },
//    loadIn: function () {
//       var _this = this;
//       var $el = $(this.newContainer);

//       $(this.oldContainer).hide();

//       $el.css({
//          visibility: 'visible',
//          opacity: 0
//       });
//       console.log('aaa');

//       $el.animate({ opacity: 1 }, 400, function () {

//          document.body.scrollTop = 0;
//          _this.done();
//       });
//    }
// });

Barba.Pjax.originalPreventCheck = Barba.Pjax.preventCheck;
Barba.Pjax.preventCheck = function(evt, element) {
   if (element) {
      if (!element.getAttribute('href')) {
         return false;
      }
      // 外部リンクはtarget="_blank"に
      var site_url = location.protocol + '//' + location.host;
      if (!element.href.startsWith(site_url)) {
         element.setAttribute('target', '_blank');
         return false;
      }
      // アンカーリンクであり同一ページでなければbarbaを有効に
      var url = location.protocol + '//' + location.host + location.pathname;
      var extract_hash = element.href.replace(/#.*$/, "");
      if (element.href.startsWith(location.protocol + '//' + location.host)) {
         if (element.href.indexOf('#') > -1 && extract_hash != url) {
            return true;
         }
      }
      // 拡張子が該当する場合はtarget="_blank"に
      if (/\.(xlsx?|docx?|pptx?|pdf|jpe?g|png|gif|svg)/.test(element.href.toLowerCase())) {
         element.setAttribute('target', '_blank');
         return false;
      }
      // 該当クラスに属していればBarbaを無効に
      var ignoreClasses = ['ab-item', 'custom-no-barba'];
      for (var i = 0; i < ignoreClasses.length; i++) {
         if (element.classList.contains(ignoreClasses[i])) {
            return false;
         }
      }
      if (!Barba.Pjax.originalPreventCheck(evt, element)) {
         return false;
      }
      return true;
   }
   return true;
};


Barba.Dispatcher.on('transitionCompleted', function( currentStatus, prevStatus ) {
   var headerFixed = false;
   if (location.hash) {
      var anchor = document.querySelector(location.hash);
      if (anchor) {
         var rect = anchor.getBoundingClientRect();
         var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
         if (headerFixed) {
            var header = document.getElementById('header');
            if (header) {
               top = top - header.clientHeight;
            }
         }
         var top = rect.top + scrollTop;
         window.scrollTo(0, top);
      } else {
         window.scrollTo(0, 0);
      }
   } else {
      window.scrollTo(0, 0);
   }


    var $body = $( 'body' );
    if ( prevStatus && prevStatus.namespace ) {
        if ( ! currentStatus
        || ( currentStatus.namespace && currentStatus.namespace !== prevStatus.namespace ) ) {
            $body.removeClass( prevStatus.namespace );
        }
    }
    if ( currentStatus && currentStatus.namespace ) {
        $body.addClass( currentStatus.namespace );
    }
});

// Barba.Pjax.start();

