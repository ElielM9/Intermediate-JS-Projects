/* Importaciones */
import { SEARCHER_FORM_ID } from "../utils/selectors.js";
import { validateForm } from "../modules/formValidator.js";

export function handleSearcherForm() {
  SEARCHER_FORM_ID.addEventListener(`submit`, validateForm);
}
