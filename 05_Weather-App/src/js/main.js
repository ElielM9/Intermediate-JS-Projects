// Importaciones
import { eventListeners } from "./events/formEvents.js";

window.addEventListener(`load`, startApp);

// Función para iniciar la app
function startApp() {
  // Funcion de eventos
  eventListeners();
}
