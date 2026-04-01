/* Lógica para manejar el pedido */

// Importaciones
import { appState, resetAppState } from "./state.js";
import { showAlert, showMainView, clearOrderUI } from "../utils/domUtils.js";
import { loadMenu } from "../api/menuService.js";
import {
  updateSummary,
  renderTotalsContainer,
} from "../components/summaryUI.js";

export function startOrder(inputTable, inputHour) {
  // Obtener datos del formulario
  const inputTableValue = inputTable.value;
  const inputTableHour = inputHour.value;

  // Constantes iniciales
  const VOID_VALUE = ``;
  const MIN_TABLE_VALUE = 1;
  const MAX_TABLE_VALUE = 4;
  const OPENING_HOUR = `09:00`;
  const CLOSING_HOUR = `22:00`;

  // Revisar si hay campos vacíos
  const emptyFields = [inputTableValue, inputTableHour].some(
    (field) => field.trim() === VOID_VALUE,
  );

  // Si hay campos vacíos, mostrar alerta de error.
  if (emptyFields) {
    showAlert(`Todos los campos son obligatorios`);

    return;
  }

  // Validar que la mesa seleccionada no sea menor a 1 ni mayor a 4.
  if (inputTableValue < MIN_TABLE_VALUE || inputTableValue > MAX_TABLE_VALUE) {
    showAlert(`La mesa debe estar entre 1 y 4`);

    return;
  }

  // Validar que la hora esté en el horario de atención (9:00 - 22:00).
  if (inputTableHour < OPENING_HOUR || inputTableHour > CLOSING_HOUR)
    return showAlert(`La hora de atención es entre 09:00 y 22:00`);

  // Asignar los datos del formulario al objeto currentOrder dentro del estado
  appState.currentOrder = {
    ...appState.currentOrder,
    table: inputTableValue,
    hour: inputTableHour,
    get totalFinal() {
      return this.subTotal + this.tip;
    },
  };

  // Ocultar el modal despues de almacenar datos
  const modal = document.querySelector(`#modal`);
  const modalBootstrap = bootstrap.Modal.getInstance(modal);
  modalBootstrap.hide();

  // Mostrar la sección del menú y resumen.
  showMainView();

  // Obtener menu desde la API de JSON Server
  loadMenu();
}

export function addDishToOrder(product) {
  const { quantity, id } = product;
  let { order } = appState.currentOrder;

  if (quantity <= 0) {
    // Filtrar el arreglo para eliminar el producto con el id especificado y actualizar el estado de la app
    const orderUpdated = order.filter((article) => article.id !== id);
    appState.currentOrder.order = [...orderUpdated];

    updateSummary();

    return;
  }

  // Comprobar si un elemento ya existe en el arreglo
  const productExists = order.some((article) => article.id === id);

  if (productExists) {
    // Si el producto ya existe, actualizar la cantidad
    const orderUpdated = order.map((article) => {
      if (article.id === id) {
        article.quantity = quantity;
      }

      return article;
    });

    appState.currentOrder.order = [...orderUpdated];
  } else {
    // Si el producto no existe, agregarlo al arreglo
    appState.currentOrder.order = [...order, product];
  }

  // Actualizar el resumen y mostrarlo
  updateSummary();
}

export function calculateTip(selectedPercentage) {
  const { subTotal } = appState.currentOrder;

  // Calcular propina y total a pagar
  const tip = (subTotal * selectedPercentage) / 100;

  // Pasarle los valores al estado de la app
  appState.currentOrder.tip = tip;

  // Renderizar en el HTML
  renderTotalsContainer();
}

export function resetOrder() {
  // Resetear el estado de la app
  resetAppState();

  // Limpiar el HTML
  clearOrderUI();
}
