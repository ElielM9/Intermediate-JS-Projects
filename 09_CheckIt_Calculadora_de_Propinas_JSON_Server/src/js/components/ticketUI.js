/* Componente UI para el ticket de la cuenta */

// Importaciones
import { appState } from "../core/state.js";
import { resetOrder } from "../core/order_logic.js";

export function confirmOrder() {
  // Botón para generar ticket
  const btnGenerateTicket = document.querySelector(`#btn-generate-ticket`);
  btnGenerateTicket.dataset.bsToggle = `modal`;
  btnGenerateTicket.dataset.bsTarget = `#ticket-modal`;

  // Cerrar el modal de confirmación y generar el ticket.
  btnGenerateTicket.onclick = () => {
    // Cerrar el modal antes de generar el ticket
    const confirmModal = document.querySelector(`#confirm-modal`);
    const confirmModalBootstrap = bootstrap.Modal.getInstance(confirmModal);
    confirmModalBootstrap.hide();

    // Generar el ticket
    generateTicket();
  };
}

function generateTicket() {
  // Obtener datos de la orden
  const { table, hour, order, subTotal, tip, totalFinal, actualDate } =
    appState.currentOrder;

  // Elementos de la orden
  const orderItemsHTML = order.map((product) => {
    const { name, quantity, price } = product;

    return `
    <li class="d-flex justify-content-between mb-1">
      <span>${quantity}x ${name}</span>
      <span>$${(price * quantity).toFixed(2)}</span>
    </li>`;
  });

  // Contenedor del HTML
  const ticketPrintContainer = document.querySelector(
    `#ticket-print-container`,
  );
  ticketPrintContainer.classList.add(`modal-body`, `p-4`, `text-center`);

  // Generar el cuerpo del ticket
  ticketPrintContainer.innerHTML = `
    <div class="text-center mb-4">
      <h3 class="fw-bold text-uppercase mb-0">CheckIt</h3>
      <p class="text-muted small mb-0">Ticket de Consumo</p>
    </div>

    <hr class="border-secondary border-dashed" />
    <div class="d-flex justify-content-between small mb-1">
      <span>Mesa: <strong>${table}</strong></span>
      <span>${actualDate}</span>
    </div>
    <div class="text-start small mb-3">
      Hora: <span>${hour}</span>
    </div>

    <hr class="border-secondary border-dashed" />

    <ul class="list-unstyled small text-start mb-3">
      ${orderItemsHTML.join(``)}
    </ul>

    <hr class="border-secondary border-dashed" />

    <div class="d-flex justify-content-between mb-1">
      <span>Subtotal:</span>
      <span>$${subTotal.toFixed(2)}</span>
    </div>
    <div class="d-flex justify-content-between mb-1 text-success">
      <span>Propina:</span>
      <span>$${tip.toFixed(2)}</span>
    </div>
    <div class="d-flex justify-content-between fw-bold fs-5 mt-2">
      <span>TOTAL:</span>
      <span class="text-primary">$${totalFinal.toFixed(2)}</span>
    </div>
    <p class="small mt-4 mb-0 text-center">¡Gracias por su preferencia!</p>
  `;

  // Resetear toda la app si se da click en imprimir o se toca fuera del ticket
  const btnPrintTicket = document.querySelector(`#btn-ticket-print`);
  btnPrintTicket.onclick = () => {
    setTimeout(() => {
      resetOrder();
    }, 500);
  };
}
