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

  // Funcionalidad del PIN
  function initPinKeyboard() {
    const inputPin = document.querySelector('.input-pin');
    const wrapperBotonIngresar = document.querySelector('.wrapper-boton-ingresar');
    const tecladoLinks = document.querySelectorAll('.teclado a');
    
    if (!inputPin || !wrapperBotonIngresar) {
      return; // No está en la página del PIN
    }

    // Configurar el botón como invisible inicialmente pero manteniendo su espacio
    wrapperBotonIngresar.style.visibility = 'hidden';
    wrapperBotonIngresar.style.opacity = '0';
    wrapperBotonIngresar.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';

    // Función para actualizar el estado del botón
    function updateButtonVisibility() {
      if (inputPin.value.length === 4) {
        wrapperBotonIngresar.style.visibility = 'visible';
        wrapperBotonIngresar.style.opacity = '1';
      } else {
        wrapperBotonIngresar.style.visibility = 'hidden';
        wrapperBotonIngresar.style.opacity = '0';
      }
    }

    // Manejar clicks en el teclado virtual
    tecladoLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const img = this.querySelector('img');
        if (!img) return;
        
        const imgSrc = img.src;
        
        // Determinar qué tecla se presionó basándose en el nombre del archivo
        if (imgSrc.includes('tecla-erase.svg')) {
          // Borrar último dígito
          if (inputPin.value.length > 0) {
            inputPin.value = inputPin.value.slice(0, -1);
            updateButtonVisibility();
          }
        } else if (imgSrc.includes('tecla-') && imgSrc.includes('.svg')) {
          // Extraer el número de la imagen (tecla-1.svg -> 1)
          const match = imgSrc.match(/tecla-(\d)\.svg/);
          if (match && inputPin.value.length < 4) {
            const digit = match[1];
            inputPin.value += digit;
            updateButtonVisibility();
          }
        }
      });
    });

    // También manejar entrada directa del teclado físico
    inputPin.addEventListener('input', function() {
      // Asegurar que solo contiene números y máximo 4 dígitos
      this.value = this.value.replace(/\D/g, '').substring(0, 4);
      updateButtonVisibility();
    });

    // Manejar teclas del teclado físico
    inputPin.addEventListener('keydown', function(e) {
      // Permitir: backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
          // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true)) {
        return;
      }
      // Asegurar que es un número (0-9) y no exceder 4 dígitos
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
      if (this.value.length >= 4 && e.keyCode >= 48 && e.keyCode <= 105) {
        e.preventDefault();
      }
    });

    // Inicializar el estado del botón
    updateButtonVisibility();
  }

  // Inicializar el teclado PIN
  initPinKeyboard();
});
