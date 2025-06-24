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
    "activando-entradas": {
      titulo: "Activando entradas...",
      icono: "assets/images/icon-entradas.svg",
      mensaje: "Por favor espere mientras se activan tus entradas",
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

  // Funcionalidad del contador
  function initCounter() {
    const wrapperCounter = document.querySelector('.wrapper-counter');
    
    if (!wrapperCounter) {
      return; // No está en una página con contador
    }

    const counterValue = wrapperCounter.querySelector('span');
    const incrementBtn = wrapperCounter.querySelector('img[src*="tecla+.svg"]');
    const decrementBtn = wrapperCounter.querySelector('img[src*="tecla-.svg"]');
    
    if (!counterValue || !incrementBtn || !decrementBtn) {
      return; // Faltan elementos necesarios
    }

    let currentValue = parseInt(counterValue.textContent) || 1;
    const minValue = 1;
    const maxValue = 999; // Límite máximo del contador

    // Función para actualizar el valor mostrado
    function updateCounterDisplay() {
      counterValue.textContent = currentValue;
    }

    // Función para incrementar
    function increment() {
      if (currentValue < maxValue) {
        currentValue++;
        updateCounterDisplay();
      }
    }

    // Función para decrementar
    function decrement() {
      if (currentValue > minValue) {
        currentValue--;
        updateCounterDisplay();
      }
    }

    // Agregar estilos de hover y cursor pointer a los botones
    incrementBtn.style.cursor = 'pointer';
    decrementBtn.style.cursor = 'pointer';
    
    incrementBtn.style.transition = 'opacity 0.2s ease';
    decrementBtn.style.transition = 'opacity 0.2s ease';

    // Event listeners para los botones
    incrementBtn.addEventListener('click', increment);
    decrementBtn.addEventListener('click', decrement);

    // Efectos visuales en hover
    incrementBtn.addEventListener('mouseenter', function() {
      this.style.opacity = '0.7';
    });
    
    incrementBtn.addEventListener('mouseleave', function() {
      this.style.opacity = '1';
    });

    decrementBtn.addEventListener('mouseenter', function() {
      this.style.opacity = '0.7';
    });
    
    decrementBtn.addEventListener('mouseleave', function() {
      this.style.opacity = '1';
    });

    // Función para obtener el valor actual (por si se necesita desde fuera)
    window.getCounterValue = function() {
      return currentValue;
    };

    // Función para establecer un valor específico
    window.setCounterValue = function(value) {
      const newValue = parseInt(value);
      if (newValue >= minValue && newValue <= maxValue) {
        currentValue = newValue;
        updateCounterDisplay();
        return true;
      }
      return false;
    };

    // Inicializar el display
    updateCounterDisplay();
  }

  // Inicializar el contador
  initCounter();

  // Inicializar scroll de lista de sorteos
  initSorteosScroll();
  
  // Inicializar scroll de lista de canjes
  initCanjesScroll();

  function initModificarCorreo() {
    const btnModificarCorreo = document.querySelector('a[href="#"] .user-info-edit');
    const editMessage = document.querySelector('.edit-message');
    const btnCloseEdit = document.querySelector('.btn-close-edit');
    
    if (btnModificarCorreo && editMessage) {
      btnModificarCorreo.closest('a').addEventListener('click', function(e) {
        e.preventDefault();
        editMessage.style.display = 'flex';
      });
    }
    
    if (btnCloseEdit && editMessage) {
      btnCloseEdit.addEventListener('click', function() {
        editMessage.style.display = 'none';
      });
    }
  }

  initModificarCorreo();
});

// Función para manejar el scroll de la lista de sorteos
function initSorteosScroll() {
  const scrollUpBtn = document.getElementById('scroll-up');
  const scrollDownBtn = document.getElementById('scroll-down');
  const listContainer = document.querySelector('.lista-sorteos');
  
  if (!scrollUpBtn || !scrollDownBtn || !listContainer) {
    return;
  }

  const scrollAmount = 60; // Cantidad de píxeles a hacer scroll por clic

  // Función para actualizar la visibilidad de las flechas
  function updateArrowVisibility() {
    const { scrollTop, scrollHeight, clientHeight } = listContainer;
    
    // Mostrar flecha hacia arriba si hay scroll hacia abajo
    if (scrollTop > 0) {
      scrollUpBtn.classList.add('visible');
    } else {
      scrollUpBtn.classList.remove('visible');
    }
    
    // Mostrar flecha hacia abajo si se puede hacer más scroll hacia abajo
    if (scrollTop + clientHeight < scrollHeight - 5) { // -5 para margen de error
      scrollDownBtn.classList.add('visible');
    } else {
      scrollDownBtn.classList.remove('visible');
    }
  }

  // Función para scroll hacia arriba
  scrollUpBtn.addEventListener('click', function() {
    listContainer.scrollTop -= scrollAmount;
  });

  // Función para scroll hacia abajo
  scrollDownBtn.addEventListener('click', function() {
    listContainer.scrollTop += scrollAmount;
  });

  // Escuchar el evento de scroll para actualizar las flechas
  listContainer.addEventListener('scroll', updateArrowVisibility);

  // Inicializar la visibilidad de las flechas
  setTimeout(updateArrowVisibility, 100); // Timeout para asegurar que el DOM esté completamente cargado

  // Opcional: Agregar hover effects para mejorar la UX
  [scrollUpBtn, scrollDownBtn].forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      if (this.classList.contains('visible')) {
        this.style.opacity = '1';
      }
    });
    
    btn.addEventListener('mouseleave', function() {
      if (this.classList.contains('visible')) {
        this.style.opacity = '1';
      }
    });
  });
}

// Función para manejar el scroll de la lista de canjes
function initCanjesScroll() {
  const scrollUpBtn = document.getElementById('scroll-up');
  const scrollDownBtn = document.getElementById('scroll-down');
  const listContainer = document.querySelector('.lista-canjes');
  
  if (!scrollUpBtn || !scrollDownBtn || !listContainer) {
    return;
  }

  const scrollAmount = 60; // Cantidad de píxeles a hacer scroll por clic

  // Función para actualizar la visibilidad de las flechas
  function updateArrowVisibility() {
    const { scrollTop, scrollHeight, clientHeight } = listContainer;
    
    // Mostrar flecha hacia arriba si hay scroll hacia abajo
    if (scrollTop > 0) {
      scrollUpBtn.classList.add('visible');
    } else {
      scrollUpBtn.classList.remove('visible');
    }
    
    // Mostrar flecha hacia abajo si se puede hacer más scroll hacia abajo
    if (scrollTop + clientHeight < scrollHeight - 5) { // -5 para margen de error
      scrollDownBtn.classList.add('visible');
    } else {
      scrollDownBtn.classList.remove('visible');
    }
  }

  // Función para scroll hacia arriba
  scrollUpBtn.addEventListener('click', function() {
    listContainer.scrollTop -= scrollAmount;
  });

  // Función para scroll hacia abajo
  scrollDownBtn.addEventListener('click', function() {
    listContainer.scrollTop += scrollAmount;
  });

  // Escuchar el evento de scroll para actualizar las flechas
  listContainer.addEventListener('scroll', updateArrowVisibility);

  // Inicializar la visibilidad de las flechas
  setTimeout(updateArrowVisibility, 100); // Timeout para asegurar que el DOM esté completamente cargado

  // Opcional: Agregar hover effects para mejorar la UX
  [scrollUpBtn, scrollDownBtn].forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      if (this.classList.contains('visible')) {
        this.style.opacity = '1';
      }
    });
    
    btn.addEventListener('mouseleave', function() {
      if (this.classList.contains('visible')) {
        this.style.opacity = '1';
      }
    });
  });
}

// Funcionalidad del teclado touchscreen
document.addEventListener('DOMContentLoaded', function() {
  const input = document.querySelector('.input-edit');
  const teclas = document.querySelectorAll('.tecla-img');
  const symbolsRow = document.querySelector('.symbols-row');
  let isShiftActive = false;
  let isSymbolsActive = false;
  
  teclas.forEach(tecla => {
    tecla.addEventListener('click', function() {
      // Evitar que este event listener afecte las teclas del popup de reestablecer PIN
      if (this.closest('#popup-reestablecer-pin')) {
        return;
      }
      
      const letra = this.querySelector('.tecla-letra').textContent;
      
      // Manejar teclas especiales
      if (this.classList.contains('tecla-backspace')) {
        // Borrar último carácter
        input.value = input.value.slice(0, -1);
        
      } else if (this.classList.contains('tecla-shift')) {
        // Alternar mayúsculas/minúsculas
        isShiftActive = !isShiftActive;
        this.style.background = isShiftActive ? 
          'linear-gradient(135deg, rgba(232, 209, 44, 0.9) 0%, rgba(200, 180, 20, 0.9) 100%)' :
          'linear-gradient(135deg, rgba(100, 100, 100, 0.95) 0%, rgba(80, 80, 80, 0.95) 100%)';
        
        // Actualizar todas las letras
        updateLetterCase();
        
      } else if (this.classList.contains('tecla-symbols')) {
        // Alternar vista de símbolos
        isSymbolsActive = !isSymbolsActive;
        symbolsRow.style.display = isSymbolsActive ? 'flex' : 'none';
        this.querySelector('.tecla-letra').textContent = isSymbolsActive ? 'ABC' : '123';
        
      } else if (this.classList.contains('tecla-space')) {
        // Agregar espacio
        input.value += ' ';
        
      } else if (this.classList.contains('tecla-enter')) {
        // Simular envío o nueva línea (para este caso, podríamos cerrar el modal)
        console.log('Enter presionado:', input.value);
        
      } else {
        // Agregar carácter normal
        let charToAdd = letra;
        
        // Aplicar mayúscula si shift está activo y es una letra
        if (/[a-zA-ZñÑ]/.test(letra)) {
          charToAdd = isShiftActive ? letra.toUpperCase() : letra.toLowerCase();
        }
        
        input.value += charToAdd;
        
        // Desactivar shift después de escribir una letra
        if (isShiftActive && /[a-zA-ZñÑ]/.test(letra)) {
          isShiftActive = false;
          document.querySelector('.tecla-shift').style.background = 
            'linear-gradient(135deg, rgba(100, 100, 100, 0.95) 0%, rgba(80, 80, 80, 0.95) 100%)';
          updateLetterCase();
        }
      }
      
      // Efecto visual de pulsación
      this.style.transform = 'translateY(2px)';
      setTimeout(() => {
        this.style.transform = '';
      }, 100);
      
      // Mantener focus en el input
      input.focus();
    });
  });
  
  function updateLetterCase() {
    const letterTeclas = document.querySelectorAll('.tecla-img:not(.tecla-shift):not(.tecla-backspace):not(.tecla-symbols):not(.tecla-space):not(.tecla-enter)');
    letterTeclas.forEach(tecla => {
      const span = tecla.querySelector('.tecla-letra');
      const currentText = span.textContent;
      
      if (/[a-zA-ZñÑ]/.test(currentText)) {
        span.textContent = isShiftActive ? currentText.toUpperCase() : currentText.toLowerCase();
      }
    });
  }
  
  // Inicializar con minúsculas
  updateLetterCase();

  // Funcionalidad del popup para reestablecer PIN
  const reestablecerPinBtn = document.getElementById('reestablecer-pin-btn');
  const popupReestablecerPin = document.getElementById('popup-reestablecer-pin');
  const closePopupBtn = document.getElementById('close-popup');
  const nuevoPinInput = document.getElementById('nuevo-pin-input');
  const mensajePin = document.getElementById('mensaje-pin');

  // Mostrar popup al hacer clic en "Reestablecer pin"
  if (reestablecerPinBtn) {
    reestablecerPinBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (popupReestablecerPin) {
        popupReestablecerPin.style.display = 'flex';
      }
    });
  }

  // Cerrar popup
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', function() {
      if (popupReestablecerPin) {
        popupReestablecerPin.style.display = 'none';
        if (nuevoPinInput) nuevoPinInput.value = '';
        if (mensajePin) mensajePin.style.visibility = 'hidden';
      }
    });
  }

  // Funcionalidad del teclado completo para PIN (solo números activos)
  if (popupReestablecerPin) {
    const todasLasTeclas = popupReestablecerPin.querySelectorAll('.tecla-img');
    
    todasLasTeclas.forEach(tecla => {
      tecla.addEventListener('click', function() {
        const letra = this.querySelector('.tecla-letra').textContent;
        
        // Solo procesar números del 0-9
        if (/^[0-9]$/.test(letra) && nuevoPinInput && nuevoPinInput.value.length < 4) {
          nuevoPinInput.value += letra;
        }
        
        // Funcionalidad del botón borrar
        if (letra === '⌫' && nuevoPinInput && nuevoPinInput.value.length > 0) {
          nuevoPinInput.value = nuevoPinInput.value.slice(0, -1);
        }
        
        // Funcionalidad del botón enter (confirmar)
        if (letra === '↵') {
          if (nuevoPinInput && nuevoPinInput.value.length === 4) {
            // Aquí puedes agregar la lógica para enviar el nuevo PIN
            console.log('Nuevo PIN:', nuevoPinInput.value);
            
            // Mostrar mensaje de confirmación
            if (mensajePin) {
              mensajePin.textContent = 'PIN actualizado correctamente';
              mensajePin.style.visibility = 'visible';
              mensajePin.style.color = '#00AA00';
            }
            
            // Cerrar popup después de 2 segundos
            setTimeout(function() {
              if (popupReestablecerPin) {
                popupReestablecerPin.style.display = 'none';
                if (nuevoPinInput) nuevoPinInput.value = '';
                if (mensajePin) mensajePin.style.visibility = 'hidden';
              }
            }, 2000);
          } else {
            // Mostrar mensaje de error
            if (mensajePin) {
              mensajePin.textContent = 'El PIN debe tener 4 dígitos';
              mensajePin.style.visibility = 'visible';
              mensajePin.style.color = '#FF0000';
            }
          }
        }
      });
    });
  }

  // Cerrar popup al hacer clic fuera del contenido
  if (popupReestablecerPin) {
    popupReestablecerPin.addEventListener('click', function(e) {
      if (e.target === popupReestablecerPin) {
        popupReestablecerPin.style.display = 'none';
        if (nuevoPinInput) nuevoPinInput.value = '';
        if (mensajePin) mensajePin.style.visibility = 'hidden';
      }
    });
  }
});
