import Swiper from 'swiper'

export function setPhotoGallery(){
   let slider = new Swiper ('#slider', {
      // loop: true,
      spaceBetween: 24,
      navigation: {
         nextEl: '.gallery-next',
         prevEl: '.gallery-prev'
      }
   })
   let thumbs = new Swiper('#thumbs', {
      // loop: true,
      speed: 800,
      autoplay: {
         delay: 5000,
         disableOnInteraction: false,
      },
      centeredSlides: true,
      spaceBetween: 16,
      slidesPerView: 5,
      slideToClickedSlide: true,
      breakpoints: {
         650: {
            spaceBetween: 8,
            slidesPerView: 3
         }
      }
   });
   slider.controller.control = thumbs;
   thumbs.controller.control = slider;
}

