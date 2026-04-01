/* Componente UI para el resumen de la cuenta */

// Importaciones
import { appState } from "../core/state.js";
import { calculateTip } from "../core/order_logic.js";
import { cleanHTML } from "../utils/domUtils.js";
import { confirmOrder } from "./ticketUI.js";

export function updateSummary() {
  // Destructuring a la orden actual
  const { table, hour, order } = appState.currentOrder;

  //
  const summaryCard = document.querySelector(`#summary-card`);
  summaryCard.classList.add(`appear`);

  // Funcion para limpiar el HTML previo
  cleanHTML(summaryCard);

  // Si el arreglo está vacío, elimina el resumen
  if (!order.length) {
    summaryCard.classList.remove(`appear`);
    cleanHTML(summaryCard);

    return;
  }

  // Crear el header dinamicamente
  const summaryCardHeader = document.createElement(`DIV`);
  summaryCardHeader.classList.add(
    `card-header`,
    `bg-light`,
    `py-3`,
    `border-0`,
    `rounded-top-4`,
  );
  summaryCardHeader.innerHTML = `<h2 class="fs-5 fw-bold mb-0 text-primary text-center">Resumen de la cuenta</h2>`;

  const summaryCardBody = document.createElement(`DIV`);
  summaryCardBody.classList.add(`card-body`, `p-4`);

  // Información de la mesa y hora seleccionadas
  const infoHeader = document.createElement(`DIV`);
  infoHeader.classList.add(
    `pb-2`,
    `border-bottom`,
    `d-flex`,
    `justify-content-between`,
  );
  infoHeader.innerHTML = `
    <p class="mb-1 text-secondary"><strong>Mesa:</strong> 
      <span class="badge bg-light text-primary">
        ${table}
      </span>
    </p>
    <p class="mb-0 text-secondary"><strong>Hora:</strong> ${hour}</p>
  `;

  summaryCardBody.appendChild(infoHeader);

  // Lista de productos en la orden
  const orderList = document.createElement(`UL`);
  orderList.classList.add(`list-group`, `list-group-flush`);

  let subTotal = 0;

  // Iterar sobre el arreglo de pedidos
  order.forEach((product) => {
    const { id, name, price, quantity } = product;
    const subTotalItem = price * quantity;

    subTotal += subTotalItem;

    // Elementos de la lista
    const listItem = document.createElement(`LI`);
    listItem.classList.add(
      `list-group-item`,
      `d-flex`,
      `justify-content-between`,
      `align-items-center`,
      `gap-3`,
    );
    listItem.innerHTML = `
       <div class="flex-grow-1 flex-wrap min-w-0">
        <p class="fw-bold mb-0">${name}</p>
        <small class="text-muted">Cantidad: ${quantity} x $${price.toFixed(2)}</small>
       </div>
       <span class="fw-bold flex-shrink-0 text-dark text-center mx-3 " style="width: 100px;">$${subTotalItem.toFixed(2)}</span>
       `;

    // Boton de eliminar
    const btnDelete = document.createElement(`BUTTON`);
    btnDelete.classList.add(
      `btn`,
      `btn-sm`,
      `btn-outline-danger`,
      `flex-shrink-0`,
    );
    btnDelete.style.width = `38px`;
    btnDelete.style.height = `38px`;
    btnDelete.innerHTML = `<i class="bi bi-trash"></i>`;

    // Funcion para eliminar del pedido
    btnDelete.addEventListener(`click`, () => {
      deleteProduct(id);
    });

    listItem.appendChild(btnDelete);

    orderList.appendChild(listItem);
  });

  // Pasarle el valor a la variable dentro del objeto
  appState.currentOrder.subTotal = subTotal;

  summaryCardBody.appendChild(orderList);

  // Total de la orden sin propina
  const orderTotalContainer = document.createElement(`DIV`);
  orderTotalContainer.classList.add(
    `d-flex`,
    `justify-content-between`,
    `align-items-center`,
    `mb-2`,
    `pt-2`,
    `border-top`,
  );
  orderTotalContainer.innerHTML = `
        <span class="fw-bold text-secondary">Subtotal:</span>
        <span class="fs-4 fw-bold text-primary">$${subTotal.toFixed(2)}</span>
  `;

  summaryCardBody.appendChild(orderTotalContainer);

  // Formulario para calcular las propinas
  renderTipForm(summaryCardBody);

  // Footer de la card con totales, selector de propina, totales y boton
  const summaryCardFooter = document.createElement(`DIV`);
  summaryCardFooter.classList.add(`card-footer`, `border-top-0`, `p-4`);

  // Renderizar los totales en el HTML
  renderTotalsContainer(summaryCardFooter);

  // Ensamblaje de la card principal
  summaryCard.appendChild(summaryCardHeader);
  summaryCard.appendChild(summaryCardBody);
  summaryCard.appendChild(summaryCardFooter);
}

function deleteProduct(id) {
  const { order } = appState.currentOrder;

  // Filtrar el arreglo y actualizar la cantidad
  const orderUpdated = order.filter((article) => article.id !== id);
  appState.currentOrder.order = [...orderUpdated];

  // Actualizar el resumen y mostrarlo
  updateSummary();

  // Resetear el formulario
  const productDeleted = document.querySelector(`#product-${id}`);
  productDeleted.value = 0;
}

function renderTipForm(summaryCardBody) {
  // Formulario para calcular las propinas
  const tipForm = document.createElement(`FORM`);
  tipForm.classList.add(`pt-3`, `border-top`);

  const tipFormHeading = document.createElement(`P`);
  tipFormHeading.classList.add(
    `text-secondary`,
    `small`,
    `fw-bold`,
    `mb-2`,
    `text-center`,
  );
  tipFormHeading.textContent = `¿Desea dejar propina?`;

  // Contenedor de los inputs de porcentaje
  const tipGroup = document.createElement(`DIV`);
  tipGroup.classList.add(
    `btn-group`,
    `w-100`,
    `shadow-sm`,
    `rounded-pill`,
    `overflow-hidden`,
  );
  tipGroup.role = `group`;

  // Porcentajes de propina
  const TIP_OPTIONS = [
    { value: 0, label: "0%" },
    { value: 10, label: "10%" },
    { value: 15, label: "15%" },
    { value: 20, label: "20%" },
  ];

  // Asignar el valor por defecto al Objeto de estado como 0
  appState.currentOrder.tip = 0;

  // Iteramos sobre los porcentajes
  TIP_OPTIONS.forEach((tip) => {
    const { value, label } = tip;

    // Crear radio buttons invisibles que guarden el valor.
    const tipRadioInput = document.createElement(`INPUT`);
    tipRadioInput.type = `radio`;
    tipRadioInput.classList.add(`btn-check`);
    tipRadioInput.name = `tip`;
    tipRadioInput.id = `tip-${value}`;
    tipRadioInput.value = value;
    tipRadioInput.addEventListener(`click`, (e) => {
      const selectedPercentage = Number(e.target.value);

      calculateTip(selectedPercentage);
    });

    // Si el valor es 0 o NaN, el valor por defecto es 0
    if (!value) tipRadioInput.checked = true;

    // Label para esconder el Input
    const tipLabel = document.createElement(`LABEL`);
    tipLabel.classList.add(`btn`, `btn-outline-primary`, `border-0`, `py-2`);
    tipLabel.setAttribute(`for`, `tip-${value}`);
    tipLabel.textContent = label;

    tipGroup.appendChild(tipRadioInput);
    tipGroup.appendChild(tipLabel);
  });

  // Ensamblar el formulario de propinas
  tipForm.appendChild(tipFormHeading);
  tipForm.appendChild(tipGroup);

  // Agregar el formulario de propinas al cuerpo de la tarjeta.
  summaryCardBody.appendChild(tipForm);
}

export function renderTotalsContainer(container) {
  // Destructuración
  const { tip, totalFinal } = appState.currentOrder;

  const summaryCardFooter =
    container || document.querySelector(`#summary-card .card-footer`);

  // Limpiar el HTML previo
  cleanHTML(summaryCardFooter);

  // Contenedor de los totales
  const totalsContainer = document.createElement(`DIV`);
  totalsContainer.classList.add(`total-pay`, `bg-light`, `rounded-4`);
  totalsContainer.innerHTML = `
    <div class="d-flex justify-content-between mb-2">
        <span class="text-secondary">Propina:</span>
        <span class="fw-bold text-success">+$${tip.toFixed(2)}</span>
    </div>
    <div class="d-flex justify-content-between align-items-center border-top pt-2 pb-2">
        <span class="fs-5 fw-bold">Total a Pagar:</span>
        <span class="fs-3 fw-bold text-primary">$${totalFinal.toFixed(2)}</span>
    </div>
  `;

  // Generar el boton de confirmar
  const btnConfirm = document.createElement(`BUTTON`);
  btnConfirm.classList.add(
    `btn`,
    `btn-primary`,
    `w-100`,
    `py-3`,
    `rounded-pill`,
    `fw-bold`,
    `shadow-sm`,
  );
  btnConfirm.textContent = `Confirmar pedido`;
  btnConfirm.dataset.bsToggle = `modal`;
  btnConfirm.dataset.bsTarget = `#confirm-modal`;
  btnConfirm.addEventListener(`click`, () => {
    confirmOrder();
  });

  // Mostrar el contenedor antes del boton
  summaryCardFooter.appendChild(totalsContainer);
  summaryCardFooter.appendChild(btnConfirm);
}
