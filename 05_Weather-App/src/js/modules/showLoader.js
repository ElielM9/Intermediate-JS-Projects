// Importaciones
import { MAIN__CONTAINER } from "../utils/selectors.js";
import { clearHTML } from "../utils/helpers.js";

// Función que muestra un loader antes de mostrar la información
export function showLoader() {
  // Limpiar el HTML
  clearHTML();

  const LOADER = document.createElement(`span`);
  LOADER.classList.add(`loader`);

  MAIN__CONTAINER.appendChild(LOADER);
}
