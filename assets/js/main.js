document.addEventListener("DOMContentLoaded", function () {
  const CAROUSEL_CONFIG = {
    autoSlideInterval: 4000,
    fadeTransitionDuration: 800
  };

  function initCarousel() {
    const carouselWrapper = document.querySelector('.wrapper-carousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    if (!carouselWrapper || carouselItems.length === 0) {
      return;
    }

    let currentSlide = 0;
    let carouselInterval;

    carouselItems[0].classList.add('active');

    function nextSlide() {
      carouselItems[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % carouselItems.length;
      carouselItems[currentSlide].classList.add('active');
    }

    function goToSlide(slideIndex) {
      if (slideIndex >= 0 && slideIndex < carouselItems.length) {
        carouselItems[currentSlide].classList.remove('active');
        currentSlide = slideIndex;
        carouselItems[currentSlide].classList.add('active');
      }
    }

    function startAutoSlide() {
      carouselInterval = setInterval(nextSlide, CAROUSEL_CONFIG.autoSlideInterval);
    }

    function pauseAutoSlide() {
      clearInterval(carouselInterval);
    }

    function resumeAutoSlide() {
      pauseAutoSlide();
      startAutoSlide();
    }

    carouselWrapper.addEventListener('mouseenter', pauseAutoSlide);
    carouselWrapper.addEventListener('mouseleave', resumeAutoSlide);

    startAutoSlide();

    window.carouselControls = {
      next: nextSlide,
      goTo: goToSlide,
      pause: pauseAutoSlide,
      resume: resumeAutoSlide,
      getCurrentSlide: () => currentSlide,
      getTotalSlides: () => carouselItems.length
    };
  }

  initCarousel();

  const btnPrint = document.getElementById("btn-print-cupones");
  const messageDiv = document.querySelector(".message");
  const btnClose = document.querySelector(".btn-close");

  function showPrintMessage() {
    if (messageDiv) {
      messageDiv.style.display = "flex";
      messageDiv.classList.add("show");
    }
  }

  function hidePrintMessage() {
    if (messageDiv) {
      messageDiv.style.display = "none";
      messageDiv.classList.remove("show");
    }
  }

  if (btnPrint) {
    btnPrint.addEventListener("click", function (e) {
      e.preventDefault();
      showPrintMessage();
    });
  }

  if (btnClose) {
    btnClose.addEventListener("click", function () {
      hidePrintMessage();
    });
  }

  if (messageDiv) {
    messageDiv.addEventListener("click", function (e) {
      if (e.target === messageDiv) {
        hidePrintMessage();
      }
    });
  }
});
