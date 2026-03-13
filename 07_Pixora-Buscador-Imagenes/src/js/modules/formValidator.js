/* Importaciones */
import { showAlert } from "../utils/alerts.js";
import { searchImages } from "../api/searchImages.js";

export function validateForm(event) {
  event.preventDefault();

  const searchTerm = document.querySelector(`#search-term`).value;
  if (searchTerm === ``) {
    showAlert(`El término de búsqueda está vacío`);

    return;
  }

  let currentPage = 1;
  // Si el término de búsqueda es válido, buscar las imágenes
  searchImages(currentPage);
}
