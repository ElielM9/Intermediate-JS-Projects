// Importaciones
import { MAIN__CONTAINER } from "./selectors.js";

// Función para convertir de Kelvin a celcius
export function convertKelvinToCelsius(kelvin) {
  return parseInt(kelvin - 273.15);
}

// Función para limpiar el HTML
export function clearHTML() {
  while (MAIN__CONTAINER.firstChild) {
    MAIN__CONTAINER.removeChild(MAIN__CONTAINER.firstChild);
  }
}
