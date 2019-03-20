import $ from 'jquery'
import Swiper from 'swiper'

const topMainSlide = new Swiper('#js-top-slide', {
   effect: 'fade',
   speed: 1500,
   loop: true,
   autoplay: {
      delay: 3000,
      disableOnInteraction: false,
   },
});
const pickupBanner = new Swiper('#js-pickup-banner', {
   speed: 1000,
   loop: true,
   slidesPerView: 3,
   // centeredSlides: true,
   spaceBetween: 20,
   navigation: {
      nextEl: '#js-pickup-next',
      prevEl: '#js-pickup-prev',
   },
   pagination: {
      el: '#js-pickup-pager',
      clickable: true,
   },
   autoplay: {
      delay: 3000,
      disableOnInteraction: false,
   },
});