/* Servicio para interactuar con la API del menú */

// Importaciones
import { appState } from "../core/state.js";
import { renderCategoryFilter, renderMenu } from "../components/menuUI.js";

export function loadMenu() {
  const URL_MENU = `http://localhost:3000/menu`;

  fetch(URL_MENU)
    .then((response) => response.json())
    .then((data) => {
      // Asignar los datos al estado global de la app
      appState.dishes = data.dishes;
      appState.categories = data.categories;

      // Destructuring del estado de la app
      const { dishes, categories } = appState;

      // Función para llenar el filtro de categorías
      renderCategoryFilter(categories);

      // Función para renderizar el Menú
      renderMenu(dishes, categories);
    })
    .catch((error) => console.error(error));
}
