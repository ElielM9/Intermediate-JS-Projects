/* Importaciones */
import { REGISTERS_PER_PAGE } from "./selectors.js";

// Función para limpiar resultados anteriores del DOM
export function clearPreviousResults(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

// Función para calcular el número total de páginas
export function calculatePages(totalHits) {
  return parseInt(Math.ceil(totalHits / REGISTERS_PER_PAGE));
}
