/* Importaciones */
import { SEARCHER_FORM_ID } from "../utils/selectors.js";

// Función para mostrar alertas en el DOM
export function showAlert(message) {
  // Validar que la alerta no exista
  const existingAlert = document.querySelector(`.alert`);

  if (!existingAlert) {
    const alert = document.createElement(`p`);
    alert.classList.add(`alert`, `alert--error`);
    alert.innerHTML = `<strong>Error:</strong> ${message}`;

    SEARCHER_FORM_ID.parentElement.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}
