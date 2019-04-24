import $ from 'jquery';
import inView from 'in-view';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import photoswipeSimplify from 'photoswipe-simplify';

export function setIni(){

   const pageup = $('#js-pageup');
   let startPos = 0;
   $(window).on('scroll', function(){
      let currentPos = $(this).scrollTop();

      if(currentPos >= 200) {
         pageup.addClass('is-show');
      } else {
         pageup.removeClass('is-show');
      }

      if (currentPos > startPos) {
         if (currentPos >= 200) {
            $('body').addClass('is-header-hide');
         } else {
            $('body').removeClass('is-header-hide');
         }
      } else {
         $('body').removeClass('is-header-hide');
      }
      startPos = currentPos;
   });

   $('#js-sp-menu').on('click', function(){
      $('html').toggleClass('sp-menu-open');
   });
   $( document ).on('click', '.sp-menu-open a', function(){
      $('html').removeClass('sp-menu-open');
   });
}

export function setCommon(){

   $("[data-pswp]").find("a").each(function(index, el) {
      if (!$(this).find('img').length) {
         $(this).append('<img style="height:0;position:absolute;" >');
      }
   });
   window.PhotoSwipe = PhotoSwipe;
   window.PhotoSwipeUI_Default = PhotoSwipeUI_Default;
   photoswipeSimplify.init({
      history: false,
      focus: false,
      bgOpacity: .8,
      fullscreenEl: false,
      shareEl: false
   });

   // view animation
   inView.offset(60);
   inView('.fadein,.skirtin').on('enter', el => {
      $(el).addClass('is-view');
   });

   $('a[href^="http"]:not([href*="' + location.hostname + '"])').attr('target', '_blank').addClass('is-blank');
   $('a[href$=".pdf"]').attr('target', '_blank').addClass('is-pdf');
   $('a').filter(function(){return /\.(jpe?g|png|gif)$/i.test(this.href);}).addClass('is-image');

   // acordion
   const button = $('.js-accordion > :first-child');
   let body = button.next();
   body.hide();
   button.on('click', function(){
      body = $(this).next();
      body.stop().slideToggle(600, () =>{
         if (body.css('display') === 'none'){
            $(this).removeClass('is-open');
         }else{
            $(this).addClass('is-open');
         }
         // $(window).trigger('scroll');
      });
   });

   // tab
   const tabMenu = $('.js-tab-menu');
   const tabContents = $('.js-tab-contents').children();
   tabMenu.children().on('click', function(){
      const index = $(this).index();
      tabMenu.children().removeClass('is-select');
      tabContents.removeClass('is-select');
      $(this).addClass('is-select');
      tabContents.eq(index).addClass('is-select');
   });
   if (location.hash){
      let index = location.hash;
      index = index.slice(1,2) * 1 - 1;
      tabMenu.children().removeClass('is-select');
      tabContents.removeClass('is-select');
      tabMenu.children().eq(index).addClass('is-select');
      tabContents.eq(index).addClass('is-select');
   }

   // page scroll
   $('a[href^="#"]:not([href$="#"])').on("click", function(e) {
      e.preventDefault();
      const href= $(this).attr( "href");
      const target = $(href === "#top" || href === "" ? 'html' : href);
      const offsetY = (href === "#top" || href === "") ? 0 : scOffset(target);
      TweenLite.to( window, .8,{
         scrollTo:{
            y : target,
            offsetY : offsetY,
            autoKill : false
         },
         ease : Quart.easeOut}
      );
   });

}

export function scOffset(target){
   let v = $('#js-content-nav').outerHeight();
   // console.log(target);
   if ($(target).offset().top <  $(window).scrollTop()){
      // console.log('to-Up');
      v += $('#js-header').outerHeight();
   }else{
      // console.log('to-Down');
   }
   return v;
}

