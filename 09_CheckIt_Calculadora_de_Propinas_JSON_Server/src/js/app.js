/* Aplicación principal */

// Importaciones
import { startOrder } from "./core/order_logic.js";

// Funciones
function startApp() {
  initOrderListener();
}

function initOrderListener() {
  const btnStartOrder = document.querySelector(`#start-order`);

  btnStartOrder.addEventListener(`click`, () => {
    const inputTable = document.querySelector(`#table`);
    const inputHour = document.querySelector(`#hour`);

    startOrder(inputTable, inputHour);
  });
}

/* Inicializacion de la app */
document.addEventListener(`DOMContentLoaded`, startApp);
