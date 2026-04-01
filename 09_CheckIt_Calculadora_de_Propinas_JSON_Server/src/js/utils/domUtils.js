/* Utilidades para manipular el DOM  */

export function showAlert(message) {
  // Alerta previa
  const existingAlert = document.querySelector(`.invalid-feedback`);

  // Constantes de configuración
  const ALERT_TIMEOUT = 3000;

  // Si no existe una alerta, entonces
  if (!existingAlert) {
    const alert = document.createElement(`DIV`);
    alert.classList.add(`invalid-feedback`, `d-block`, `text-center`);
    alert.textContent = message;

    document.querySelector(`.modal-body`).appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, ALERT_TIMEOUT);
  }
}

export function showMainView() {
  // Seleccionar las secciones ocultas
  const mainView = document.querySelector(`#main-view`);
  mainView.classList.remove(`d-none`);
}

export function cleanHTML(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function clearOrderUI() {
  // Ocultar la seccion de app control
  const mainView = document.querySelector(`#main-view`);
  mainView.classList.add(`d-none`);

  // Ocultar el resumen y eliminar los datos dentro de él
  const summaryCard = document.querySelector(`#summary-card`);
  summaryCard.classList.remove(`appear`);
  cleanHTML(summaryCard);

  // Resetear los inputs en el Modal
  document.querySelector(`#table`).value = ``;
  document.querySelector(`#hour`).value = ``;
}
