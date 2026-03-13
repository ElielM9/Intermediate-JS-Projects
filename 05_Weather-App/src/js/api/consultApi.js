// Importaciones
import { clearHTML } from "../utils/helpers.js";
import { showError } from "../utils/alerts.js";
import { showWeather } from "../modules/showWeather.js";

// Función que consulta la API
export function consultApi(cityName, countryCode) {
  const API_KEY = `2d143467c2e890d28d6f09fbd953e757`;
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${API_KEY}`;

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      // Limpiar HTML antes de mostrar resultados
      clearHTML();

      console.log(data);

      // Validar que los resultados existan
      if (data.cod === `404`) {
        showError(`Ciudad no encontrada`);

        return;
      }

      // Mostrar resultados en el HTML
      showWeather(data);
    });
}
