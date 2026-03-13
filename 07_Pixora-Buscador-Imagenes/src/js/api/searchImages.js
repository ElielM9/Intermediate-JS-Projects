/* Importaciones */
import { REGISTERS_PER_PAGE } from "../utils/selectors.js";
import { calculatePages } from "../utils/helpers.js";
import { renderImages } from "../modules/imageRender.js";

/* Funciones */

export function searchImages(currentPage) {
  const term = document.querySelector(`#search-term`).value;

  const API_KEY = `53095941-15c0123b5eb4b92a48a772f33`;
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${term}&per_page=${REGISTERS_PER_PAGE}&page=${currentPage}`;

  console.log(currentPage);

  fetch(URL)
    .then((response) => response.json())
    .then((result) => {
      let results = result.hits;
      let totalPages = calculatePages(result.totalHits);

      renderImages(results, totalPages, currentPage);
    });
}
