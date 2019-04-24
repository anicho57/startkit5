
import 'babel-polyfill'
import $ from 'jquery';
import Barba from "barba.js";
import {TweenLite} from 'gsap/TweenMax';
import ScrollToPlugin from "gsap/ScrollToPlugin";
window.ScrollToPlugin = ScrollToPlugin
const imagesLoaded = require('imagesloaded');

import {googleAnalytics} from './plugins/ga';

import {pageLoading} from './modules/loading';
import {setIni} from './modules/common';
import {setCommon} from './modules/common';
import {scOffset} from './modules/common';
import {setTopPage} from './modules/top';
import {setCalendar} from './modules/fc';
import {setBgYoutube} from './modules/youtube';
import {setPhotoGallery} from './modules/photogallery';



Barba.Pjax.Dom.wrapperId = "js-container";
Barba.Pjax.Dom.containerClass = "page-content";
Barba.Pjax.Dom.dataNamespace = "page";
Barba.Pjax.ignoreClassLink = "no-ajax";

Barba.Pjax.originalPreventCheck = Barba.Pjax.preventCheck;

// googleAnalytics();
pageLoading();

// import ProgressBar  from 'progressbar.js';
// var line = new ProgressBar.Line('#js-progress');
$().ready(function(){
   Barba.Pjax.start();
   Barba.Prefetch.init();
});


Barba.Pjax.preventCheck = function(evt, element) {
   if (element) {
      if (!element.getAttribute('href')) {
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
      // var ignoreClasses = ['ab-item', 'custom-no-barba'];
      // for (var i = 0; i < ignoreClasses.length; i++) {
      //    if (element.classList.contains(ignoreClasses[i])) {
      //       return false;
      //    }
      // }
      if (!Barba.Pjax.originalPreventCheck(evt, element)) {
         return false;
      }
      return true;
   }
};


// 現在と同じページのリンクをクリックした場合、リロードをしない設定
const links = document.querySelectorAll('a[href]');
const cbk = function(e) {
  if ( e.currentTarget.href === window.location.href ) {
    e.preventDefault();
    e.stopPropagation();
  }
};
for ( let i = 0; i < links.length; i++ ) links[i].addEventListener('click', cbk);


Barba.Dispatcher.on('initStateChange', function() {
   // Googleアナリティクスに情報を送る
  if (typeof ga === 'function' && Barba.HistoryManager.history.length >= 1) {
    ga('send', 'pageview', location.pathname);
  }
//   if (typeof gtag === 'function' && Barba.HistoryManager.history.length >= 1) {
//     gtag('config', 'トラッキングID', {'page_path': location.pathname});
//   }
});


Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container, newPageRawHTML) {
   // console.log(currentStatus.namespace);
   setCommon();
   switch (true) {
       case /front/.test(currentStatus.namespace):
         $('#js-front-nav').find("a").each(function(index, el) {
            const target = $(this).attr('id');
            $.ajax({ url: target + '/e-json' })
            .done( data => {
               if (data.s){ $(this).prepend('<div class="lbl-emergency"><i class="icon-notice"></i> 重要なお知らせ</div>'); }
            })
            .fail(function() {
                  console.log('emergency error');
            });
            // fetch(target + '/e-json').then(response => {
            //    // console.log(response.status);
            //    return response.json();
            // }).then(json => {
            //    if (json.s){
            //       $(this).prepend('<div class="lbl-emergency"><i class="icon-notice"></i> 重要なお知らせ</div>');
            //    }
            // });
         });
         setBgYoutube();
         break;
       case /sogo-page/.test(currentStatus.namespace):
         setBgYoutube();
         break;
       case /top-page/.test(currentStatus.namespace):
         setTopPage();
         setCalendar('js-top-calendar','./event-json/');
         break;
       case /photogallery/.test(currentStatus.namespace):
         setPhotoGallery();
         break;
       case /event-calendar/.test(currentStatus.namespace):
         setCalendar('js-event-calendar', '../event-json/');
         break;
   }
   if ( Barba.HistoryManager.history.length === 1 ) {  // ファーストビュー
      setIni();
      return; // この時に更新は必要ないです
   }

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

   const js = container.getElementsByTagName("script");
   if (js.length > 0) {
      for ( let i = 0; i < js.length; i += 1) {
         if (js[i].src !== '') {
            const addjs = document.createElement("script");
            addjs.src = js[i].src;
            document.body.appendChild(addjs);
         } else {
            eval(js[i].innerHTML);
         }
      }
   }

});

Barba.Dispatcher.on('transitionCompleted', function( currentStatus, prevStatus ) {
   if (location.hash) {
      var anchor = location.hash;
      anchor = anchor.replace(/\//g, '').replace(/\?/g, '').replace(/\./g, '').replace(/%/g, '').replace(/=/g, '').replace(/&/g, '');
      if ( anchor && $(anchor).length > 0 ){
         const offsetY = scOffset(anchor);
         TweenLite.to( window, .8,{
            scrollTo:{
               y : anchor,
               offsetY : offsetY,
               autoKill : false
            },
            ease : Quart.easeOut}
         );
         // window.scrollTo(0, top);
      } else {
         window.scrollTo(0, 0);
      }
   }

   switch (true) {
       case /request/.test(currentStatus.namespace):
         $('#js-zip').on('keyup', function(){
            AjaxZip3.zip2addr(this,'','address','address', '', '', false);
         });
         AjaxZip3.onSuccess = function() {
            $('input[name=address2]').focus();
         };
         $('select[name="grade"] option[value=""]').html('--- 現在の学年／在籍状況 ---');
         $('select[name="pref"] option[value=""]').html('--- 都道府県 ---');
         break;
       case /contact/.test(currentStatus.namespace):
         $('#js-zip').on('keyup', function(){
            AjaxZip3.zip2addr(this,'','address','address', '', '', false);
         });
         AjaxZip3.onSuccess = function() {
            $('input[name=address2]').focus();
         };
         break;
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


Barba.Pjax.getTransition = function() {
  return FadeTransition;
};


const FadeTransition = Barba.BaseTransition.extend({
   layer : $('#js-page-transition'),
   start: function () {
      Promise
         .all([this.newContainerLoading, this.fadeOut()])
         .then(this.fadeIn.bind(this));
   },

   fadeOut: function () {
      const def = Barba.Utils.deferred();
      this.layer.addClass('is-active');
      $('body').addClass('is-transition');
      // TweenLite.to( window, .3, {
      //    scrollTo:{
      //       y : 0,
      //       autoKill : false
      //    },
      //    ease : Quart.easeOut
      // });
      TweenLite.to( this.oldContainer, .5, {
         ease : Power1.easeIn,
         x : -50,
         opacity: 0,
         onComplete:function(){
            window.scrollTo(0, 0);
            $(this).removeAttr('style');
            def.resolve();
         }
      });
      return def.promise;
   },

   fadeIn: function () {
      var _this = this;
      var $el = $(this.newContainer);
      imagesLoaded( 'main', { background: '.page-hero' }, () => {
         $(this.oldContainer).hide();
         $el.css({
            visibility : 'visible',
         });
         $('body').removeClass('is-transition');
         TweenLite.fromTo( $el, .5, {
            x : 50,
            opacity : 0
         },{
            ease: Power1.easeOut,
            x : 0,
            opacity : 1,
            onComplete:function(){
               _this.layer.removeClass('is-active');
               $el.removeAttr('style');
               _this.layer.removeAttr('style');
               _this.done();
            }
         });
      });
   }
});

// const PageTransition = Barba.BaseTransition.extend({
//    el : $('#js-page-transition'),
//    start: function() {
//       Promise
//          .all([this.newContainerLoading, this.pageOut()])
//          .then(this.pageIn.bind(this));
//    },

//    pageOut: function() {
//       const def = Barba.Utils.deferred();
//       this.el.addClass('is-active');
//       TweenLite.to( this.oldContainer, 1.2, {
//          ease : Power1.easeIn,
//          // x : -80,
//          opacity: .5,
//          onComplete:function(){
//             // $(this).removeAttr('style');
//             def.resolve();
//          }
//       });
//       return def.promise;
//    },

//    pageIn: function() {
//       var _this = this;
//       var $el = $(this.newContainer);
//       //  var $el = $('#js-page-transition');
//       window.scrollTo(0, 0);
//       $(this.oldContainer).hide();
//       $el.css({
//          visibility : 'visible',
//       });
//       this.el.removeClass('is-active');
//       TweenLite.fromTo( $el, 1, {
//          // x : 80,
//          opacity : .5
//       },{
//          ease: Power1.easeOut,
//          x : 0,
//          opacity : 1,
//          onComplete:function(){
//             setCommon();
//             $el.removeAttr('style');
//             _this.el.removeAttr('style');
//             _this.done();
//          }
//       });
//    }
// });
