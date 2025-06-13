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

  // Sistema de popup genérico simplificado
  
  function mostrarPopup(config) {
    const messageDiv = document.querySelector(".message");
    if (!messageDiv) return;

    const messageContent = messageDiv.querySelector(".message-content");
    if (!messageContent) return;

    // Limpiar contenido anterior
    messageContent.innerHTML = '';

    // Botón de cerrar (siempre presente)
    const btnClose = document.createElement('span');
    btnClose.className = 'btn-close';
    btnClose.innerHTML = '<img src="assets/images/icon-close.svg">';
    messageContent.appendChild(btnClose);

    // Agregar icono si está configurado
    if (config.mostrarIcono && config.icono) {
      const icono = document.createElement('img');
      icono.src = config.icono;
      icono.alt = 'Icono';
      messageContent.appendChild(icono);
    }

    // Agregar título si está configurado
    if (config.mostrarTitulo && config.titulo) {
      const titulo = document.createElement('h2');
      titulo.textContent = config.titulo;
      messageContent.appendChild(titulo);
    }

    // Agregar mensaje
    const mensaje = document.createElement('p');
    mensaje.textContent = config.mensaje;
    messageContent.appendChild(mensaje);

    // Mostrar popup
    messageDiv.style.display = "flex";
    messageDiv.classList.add("show");

    // Agregar event listener al botón de cerrar
    btnClose.addEventListener("click", ocultarPopup);
  }

  function ocultarPopup() {
    const messageDiv = document.querySelector(".message");
    if (messageDiv) {
      messageDiv.style.display = "none";
      messageDiv.classList.remove("show");
    }
  }

  // Configuraciones predefinidas de popups
  const POPUP_CONFIGS = {
    imprimiendo: {
      titulo: "Imprimiendo...",
      icono: "assets/images/icon-print-popup.svg",
      mensaje: "Por favor espera mientras se imprimen tus cupones",
      mostrarTitulo: true,
      mostrarIcono: true
    },
    datosIncorrectos: {
      titulo: "Datos incorrectos",
      icono: "assets/images/icon-datos-incorrectos.svg",
      mensaje: "Debe dirigirse a una oficina enjoy club para actualizar sus datos",
      mostrarTitulo: true,
      mostrarIcono: true
    },
    error: {
      titulo: "Error",
      icono: "assets/images/icon-error.svg",
      mensaje: "Ha ocurrido un error inesperado",
      mostrarTitulo: true,
      mostrarIcono: true
    },
    sinIcono: {
      titulo: "Información",
      mensaje: "Información importante para el usuario",
      mostrarTitulo: true,
      mostrarIcono: false
    },
    soloMensaje: {
      mensaje: "Mensaje simple sin título ni icono",
      mostrarTitulo: false,
      mostrarIcono: false
    }
  };

  // Función para mostrar popup usando configuración predefinida
  function mostrarPopupPredefinido(tipo) {
    if (POPUP_CONFIGS[tipo]) {
      mostrarPopup(POPUP_CONFIGS[tipo]);
    }
  }

  // Event listeners para elementos existentes
  const btnPrint = document.getElementById("btn-print-cupones");
  if (btnPrint) {
    btnPrint.addEventListener("click", function (e) {
      e.preventDefault();
      mostrarPopupPredefinido('imprimiendo');
    });
  }

  // Event listener para cerrar popup al hacer clic fuera
  document.addEventListener('click', function(e) {
    const messageDiv = document.querySelector(".message");
    if (e.target === messageDiv) {
      ocultarPopup();
    }
  });

  // Exponer solo lo esencial globalmente
  window.PopupManager = {
    mostrarPredefinido: mostrarPopupPredefinido,
    ocultar: ocultarPopup
  };
});
