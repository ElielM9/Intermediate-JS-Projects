// Importaciones
import { FORM } from "./selectors.js";

// Funcion que muestra un mensaje de error
export function showError(message) {
  const ERROR_MESSAGE = message;

  // Eliminar alerta anterior
  const PREVIOUS_ALERT = document.querySelector(`.alert`);

  // Validar que no haya una alerta anterior para evitar duplicar alertas
  if (!PREVIOUS_ALERT) {
    // Crear alerta para mostrar el mensaje de error en la interfaz
    const alertDiv = document.createElement(`div`);
    alertDiv.textContent = ERROR_MESSAGE;
    alertDiv.classList.add(`alert`, `alert--error`);

    // Añadir alerta al formulario para mostrarlo en la interfaz
    FORM.appendChild(alertDiv);

    // Eliminar alerta después de 3 segundos
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
}
