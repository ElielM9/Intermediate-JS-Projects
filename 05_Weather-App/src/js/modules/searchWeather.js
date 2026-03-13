// Importaciones
import { showError } from "../utils/alerts.js";
import { showLoader } from "./showLoader.js";
import { consultApi } from "../api/consultApi.js";

export function searchWeather(e) {
  e.preventDefault();

  // Obtener los valores de los inputs de la interfaz gráfica
  const CITY_NAME = document.querySelector(`#city-name`).value.trim();
  const SELECTED_COUNTRY = document.querySelector(`#country-name`).value;
  const STRING_VOID = ``;

  // Validar que los inputs no estén vacíos
  if (CITY_NAME === STRING_VOID || SELECTED_COUNTRY === STRING_VOID) {
    showError(`Por favor, ingrese un nombre de ciudad y país válidos.`);

    return;
  }

  // Mostrar el loader antes de consultar la API
  showLoader();

  // Consultar la API después de 3 segundos
  setTimeout(() => {
    consultApi(CITY_NAME, SELECTED_COUNTRY);
  }, 1500);
}
