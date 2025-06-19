// Gestor de RUTs - Funcionalidad independiente
document.addEventListener("DOMContentLoaded", function() {
  
  // Inicializar gestor de RUTs
  function initRutManager() {
    // Prevenir inicialización múltiple
    if (window.rutManagerInitialized) return;
    window.rutManagerInitialized = true;
    
    const btnAgregarRut = document.getElementById('btn-agregar-rut');
    const popupAgregarRut = document.getElementById('popup-agregar-rut');
    const btnCerrarRut = document.getElementById('btn-close-rut');
    const inputRut = document.getElementById('input-rut');
    const btnConfirmarRut = document.getElementById('btn-confirmar-rut');
    const btnBorrarRut = document.getElementById('btn-borrar-rut');
    const wrapperRutEntradas = document.querySelector('.wrapper-rut-entradas');
    const wrapperBotonRut = document.getElementById('wrapper-boton-rut');

    // Salir si no están los elementos necesarios
    if (!btnAgregarRut || !popupAgregarRut || !inputRut || !wrapperRutEntradas) {
      return;
    }

    // Configurar botón de confirmar como oculto inicialmente
    if (wrapperBotonRut) {
      wrapperBotonRut.style.visibility = 'hidden';
      wrapperBotonRut.style.opacity = '0';
      wrapperBotonRut.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    }

    // Mostrar popup
    btnAgregarRut.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      popupAgregarRut.style.display = 'flex';
      inputRut.value = '';
      actualizarBotonConfirmar();
    });

    // Cerrar popup
    if (btnCerrarRut) {
      btnCerrarRut.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cerrarPopup();
      });
    }

    // Cerrar popup al hacer clic fuera
    popupAgregarRut.addEventListener('click', function(e) {
      if (e.target === popupAgregarRut) {
        cerrarPopup();
      }
    });

    // Función para cerrar popup
    function cerrarPopup() {
      popupAgregarRut.style.display = 'none';
      inputRut.value = '';
    }

    // Event listeners para el teclado numérico usando delegación de eventos
    let ultimoClick = 0; // Para prevenir doble click accidental
    
    popupAgregarRut.addEventListener('click', function(e) {
      // Prevenir clicks muy rápidos (debounce)
      const ahora = Date.now();
      if (ahora - ultimoClick < 200) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }
      ultimoClick = ahora;
      
      // Buscar si el elemento clickeado o su padre tiene data-numero
      let elemento = e.target;
      let numero = null;
      
      // Verificar si clickeamos directamente en un span con data-numero
      if (elemento.tagName === 'SPAN' && elemento.hasAttribute('data-numero')) {
        numero = elemento.getAttribute('data-numero');
      }
      // O si clickeamos en una imagen dentro de un span con data-numero
      else if (elemento.tagName === 'IMG' && elemento.parentElement.tagName === 'SPAN' && elemento.parentElement.hasAttribute('data-numero')) {
        numero = elemento.parentElement.getAttribute('data-numero');
      }
      
      if (numero !== null) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('Agregando número:', numero); // Debug
        
        const valorAnterior = inputRut.value;
        const valorSinFormato = inputRut.value.replace(/[^0-9kK]/g, '');
        
        // Limitar a 9 caracteres (8 dígitos + 1 dígito verificador)
        if (valorSinFormato.length < 9) {
          inputRut.value = valorAnterior + numero;
          console.log('Valor después:', inputRut.value); // Debug
          actualizarBotonConfirmar();
        }
        return;
      }
      
      // Manejar botón borrar
      if (elemento.id === 'btn-borrar-rut' || (elemento.tagName === 'IMG' && elemento.parentElement.id === 'btn-borrar-rut')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (inputRut.value.length > 0) {
          inputRut.value = inputRut.value.slice(0, -1);
          actualizarBotonConfirmar();
        }
        return;
      }
    });

    // Formatear RUT automáticamente
    function formatearRut() {
      let valor = inputRut.value.replace(/[^0-9kK]/g, '');
      
      if (valor.length > 1) {
        const cuerpo = valor.slice(0, -1);
        const dv = valor.slice(-1);
        
        if (cuerpo.length <= 8) {
          let rutFormateado = '';
          
          // Agregar puntos cada 3 dígitos
          for (let i = cuerpo.length - 1, j = 0; i >= 0; i--, j++) {
            if (j > 0 && j % 3 === 0) {
              rutFormateado = '.' + rutFormateado;
            }
            rutFormateado = cuerpo[i] + rutFormateado;
          }
          
          inputRut.value = rutFormateado + '-' + dv.toUpperCase();
        }
      }
    }

    // Formatear RUT para mostrar en la lista
    function formatearRutParaLista(rut) {
      const rutLimpio = rut.replace(/[^0-9kK]/g, '');
      
      if (rutLimpio.length > 1) {
        const cuerpo = rutLimpio.slice(0, -1);
        const dv = rutLimpio.slice(-1);
        
        let rutFormateado = '';
        
        // Agregar puntos cada 3 dígitos
        for (let i = cuerpo.length - 1, j = 0; i >= 0; i--, j++) {
          if (j > 0 && j % 3 === 0) {
            rutFormateado = '.' + rutFormateado;
          }
          rutFormateado = cuerpo[i] + rutFormateado;
        }
        
        return rutFormateado + '-' + dv.toUpperCase();
      }
      
      return rut;
    }

    // Validar RUT chileno
    function validarRut(rut) {
      if (!rut || rut.trim() === '') return false;
      
      const rutLimpio = rut.replace(/[^0-9kK]/g, '');
      
      if (rutLimpio.length < 2) return false;
      
      const cuerpo = rutLimpio.slice(0, -1);
      const dv = rutLimpio.slice(-1).toUpperCase();
      
      // Verificar longitud del cuerpo (entre 7 y 8 dígitos)
      if (cuerpo.length < 7 || cuerpo.length > 8) return false;
      
      // Calcular dígito verificador
      let suma = 0;
      let multiplicador = 2;
      
      for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
      }
      
      const resto = suma % 11;
      const dvCalculado = resto < 2 ? resto.toString() : (11 - resto === 10 ? 'K' : (11 - resto).toString());
      
      return dv === dvCalculado;
    }

    // Actualizar visibilidad del botón confirmar
    function actualizarBotonConfirmar() {
      if (!wrapperBotonRut) return;
      
      const rutValido = validarRut(inputRut.value);
      
      if (rutValido) {
        wrapperBotonRut.style.visibility = 'visible';
        wrapperBotonRut.style.opacity = '1';
      } else {
        wrapperBotonRut.style.visibility = 'hidden';
        wrapperBotonRut.style.opacity = '0';
      }
    }

    // Confirmar y agregar RUT
    if (btnConfirmarRut) {
      btnConfirmarRut.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const rutIngresado = inputRut.value.trim();
        
        if (!rutIngresado) {
          alert('Por favor ingrese un RUT');
          return;
        }

        if (!validarRut(rutIngresado)) {
          alert('El RUT ingresado no es válido');
          return;
        }

        // Verificar si el RUT ya existe
        const rutsExistentes = wrapperRutEntradas.querySelectorAll('span:not(:first-child)');
        const rutYaExiste = Array.from(rutsExistentes).some(function(span) {
          return span.textContent.trim() === rutIngresado;
        });

        if (rutYaExiste) {
          alert('Este RUT ya ha sido agregado');
          return;
        }

        // Agregar el RUT a la lista (con formato)
        const nuevoRut = document.createElement('span');
        nuevoRut.textContent = formatearRutParaLista(rutIngresado);
        nuevoRut.style.cursor = 'pointer';
        nuevoRut.title = 'Hacer clic para eliminar';
        
        // Funcionalidad para eliminar RUT
        nuevoRut.addEventListener('click', function() {
          if (confirm('¿Desea eliminar este RUT?')) {
            this.remove();
          }
        });

        wrapperRutEntradas.appendChild(nuevoRut);
        
        // Cerrar popup
        cerrarPopup();
        
        alert('RUT agregado correctamente');
      });
    }

    // Soporte para teclado físico
    inputRut.addEventListener('input', function() {
      actualizarBotonConfirmar();
    });

    inputRut.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (validarRut(inputRut.value)) {
          btnConfirmarRut.click();
        }
      }
    });

    // Filtrar entrada de teclado físico
    inputRut.addEventListener('keydown', function(e) {
      // Permitir: backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
          // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true)) {
        return;
      }
      
      // Permitir solo números y K
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
          (e.keyCode < 96 || e.keyCode > 105) && 
          e.keyCode !== 75) { // 75 es K
        e.preventDefault();
      }
      
      // Limitar longitud
      const valorSinFormato = inputRut.value.replace(/[^0-9kK]/g, '');
      if (valorSinFormato.length >= 9 && e.keyCode !== 8 && e.keyCode !== 46) {
        e.preventDefault();
      }
    });
  }

  // Inicializar
  initRutManager();
});
