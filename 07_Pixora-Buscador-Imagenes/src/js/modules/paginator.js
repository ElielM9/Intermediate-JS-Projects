/* Importaciones */
import { clearPreviousResults } from "../utils/helpers.js";
import { searchImages } from "../api/searchImages.js";

// Generador que registra los elementos de acuerdo a la cantidad de páginas
function* createPaginator(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

export function renderPaginator(totalPages, currentPage) {
  const paginationContainer = document.querySelector(`#pagination-container`);
  let iterator = createPaginator(totalPages);

  clearPreviousResults(paginationContainer);

  // Generar el paginador
  while (true) {
    const { value, done } = iterator.next();

    if (done) return;

    // Generar un boton por elemento en el generador
    const pageButton = document.createElement(`a`);
    pageButton.href = `#`;
    pageButton.dataset.page = value;
    pageButton.textContent = value;
    pageButton.classList.add(`pagination__btn`);

    pageButton.onclick = () => {
      currentPage = value;
      searchImages(currentPage);
    };

    paginationContainer.appendChild(pageButton);
  }
}
