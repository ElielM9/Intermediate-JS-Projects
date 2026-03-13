// Importaciones
import { convertKelvinToCelsius } from "../utils/helpers.js";
import { MAIN__CONTAINER } from "../utils/selectors.js";

// Función para mostrar los resultados en el HTML
export function showWeather(data) {
  const {
    name,
    main: { temp, temp_max, temp_min },
    weather: [{ description, icon }],
    sys: { country },
  } = data;

  const CELCIUS = convertKelvinToCelsius(temp);
  const TEMP_MIN = convertKelvinToCelsius(temp_min);
  const TEMP_MAX = convertKelvinToCelsius(temp_max);

  // Crear la card que muestra el clima
  const WEATHER_CARD = document.createElement(`div`);
  WEATHER_CARD.classList.add(`weather-card`);
  WEATHER_CARD.innerHTML = `
      <h2 class="weather-card__location">${name}, ${country}</h2>
      <p class="weather-card__temperature">${CELCIUS}&#8451;</p>
      <img class="weather-card__icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description} icono">
      <p class="weather-card__description">${description}</p>
      <p class="weather-card__range">Min: ${TEMP_MIN} / Max: ${TEMP_MAX} &#8451;</p>`;

  // Añadir la card al HTML
  MAIN__CONTAINER.appendChild(WEATHER_CARD);
}
