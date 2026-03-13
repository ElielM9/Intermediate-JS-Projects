/* Importaciones */
import { handleSearcherForm } from "./events/formEvents.js";

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener(`DOMContentLoaded`, startApp);

function startApp() {
  // Funcion para el formulario de busqueda
  handleSearcherForm();
}


