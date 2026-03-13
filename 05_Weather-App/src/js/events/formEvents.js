// Importaciones
import { FORM } from "../utils/selectors.js";
import { searchWeather } from "../modules/searchWeather.js";

// Función para manejar eventos
export function eventListeners() {
  FORM.addEventListener(`submit`, searchWeather);
}
