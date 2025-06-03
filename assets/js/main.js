document.addEventListener("DOMContentLoaded", function () {
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

  // Event listener para el botón imprimir
  if (btnPrint) {
    btnPrint.addEventListener("click", function (e) {
      e.preventDefault();
      showPrintMessage();
    });
  }

  // Event listener para cerrar el popup
  if (btnClose) {
    btnClose.addEventListener("click", function () {
      hidePrintMessage();
    });
  }

  // Cerrar popup al hacer click fuera del contenido
  if (messageDiv) {
    messageDiv.addEventListener("click", function (e) {
      if (e.target === messageDiv) {
        hidePrintMessage();
      }
    });
  }
});
