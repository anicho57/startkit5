import $ from 'jquery'


const button = $('.js-accordion > :first-child');
let body = button.next();
body.hide();
button.on('click', function(){
   body = $(this).next();
   body.stop().slideToggle(800, () =>{
      if (body.css('display') === 'none'){
         $(this).removeClass('is-open');
      }else{
         $(this).addClass('is-open');
      }
      // $(window).trigger('scroll');
   });
});

// $(function(){
//    var button = $('#js-sitemap > :first-child');
//    var body = button.next();
//    body.hide();
//    button.on('click', function(){
//       var it = this;
//       body = $(this).next();
//       body.stop().slideToggle(800, function(){
//          if (body.css('display') === 'none'){
//             $(it).removeClass('is-open');
//          }else{
//             $(it).addClass('is-open');
//          }
//       });
//    });
// });