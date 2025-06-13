# Sistema de Popup Genérico - Versión Simplificada

## Características

✅ **Un solo popup genérico** que se arma con contenido dinámico
✅ **Configuraciones predefinidas** para casos comunes
✅ **Condiciones de visualización**: Controla si mostrar título y/o icono

## Popups Predefinidos Disponibles

1. **`imprimiendo`** - Con título e icono de impresión
2. **`datosIncorrectos`** - Con título e icono de alerta  
3. **`error`** - Con título e icono de error
4. **`sinIcono`** - Solo con título, sin icono
5. **`soloMensaje`** - Solo mensaje, sin título ni icono

## Uso

```javascript
// Mostrar popup predefinido
PopupManager.mostrarPredefinido('imprimiendo');
PopupManager.mostrarPredefinido('datosIncorrectos');
PopupManager.mostrarPredefinido('error');
PopupManager.mostrarPredefinido('sinIcono');
PopupManager.mostrarPredefinido('soloMensaje');

// Cerrar popup
PopupManager.ocultar();
```

## Ejemplo en HTML

```html
<button onclick="PopupManager.mostrarPredefinido('imprimiendo')">
  Imprimir Cupones
</button>

<!-- El popup se cierra automáticamente al hacer clic en X o fuera del popup -->
```

## Archivos del Sistema

- **`assets/js/main.js`** - Contiene el sistema de popup
- **`ejemplo-popup.html`** - Página de ejemplo para probar los popups

El sistema es simple, funcional y fácil de usar. Solo necesitas llamar `PopupManager.mostrarPredefinido()` con el tipo de popup que quieres mostrar.
