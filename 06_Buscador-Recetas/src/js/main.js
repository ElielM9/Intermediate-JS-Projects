// Constantes
const MODAL_CONTAINER = document.querySelector(`#modal-container`);
const SELECT_CATEGORIES = document.querySelector(`#select-categories`);
const FAVORITES_DIV = document.querySelector(`.favorites-container`);

// Funcion para iniciar la aplicacion
function startApp() {
  setupCategoryEvent();
  favoritesFunctionality();
}

function setupCategoryEvent() {
  if (SELECT_CATEGORIES) {
    SELECT_CATEGORIES.addEventListener(`change`, selectCategory);

    // Funcion para obtener categorias
    getCategories();
  }
}

// Funciones para favoritos
function favoritesFunctionality() {
  if (FAVORITES_DIV) {
    // Obtener las recetas favoritas del localStorage
    getFavoriteRecipes();
  }
}

// Funciones API

function getCategories() {
  // URL de la API para obtener categorias
  const API_CATEGORIES_URL = `https://www.themealdb.com/api/json/v1/1/categories.php`;

  // Fetch para obtener las categorias
  fetch(API_CATEGORIES_URL)
    .then((response) => response.json())
    .then((data) => showCategories(data.categories));
}

function selectCategory(event) {
  const CATEGORY = event.target.value;

  // URL de la API para obtener las recetas de la categoria seleccionada
  const API_RECIPES_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${CATEGORY}`;

  // Fetch para obtener las recetas
  fetch(API_RECIPES_URL)
    .then((response) => response.json())
    .then((result) => printRecipes(result.meals));
}

function selectRecipe(id) {
  // URL de la API para obtener la receta seleccionada
  const API_RECIPE_URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  // Fetch para obtener la receta
  fetch(API_RECIPE_URL)
    .then((response) => response.json())
    .then((result) => displayRecipe(result.meals[0]));
}

function showCategories(categories = []) {
  categories.forEach((category) => {
    // Obtener nombre de la categoria y almacenarlo en una variable para usarlo en el option
    const { strCategory } = category;

    // Crear elemento option para categoria
    const option = document.createElement(`OPTION`);
    option.value = strCategory;
    option.textContent = strCategory;

    SELECT_CATEGORIES.appendChild(option);
  });
}

function printRecipes(recipes = []) {
  const RECIPES_CONTAINER = document.querySelector(`#recipes-container`);

  // Limpiar contenido anterior
  clearHTML(RECIPES_CONTAINER);

  // Heading que indique si no hay resultados
  const noResults = document.createElement(`H2`);
  noResults.classList.add(
    `text-center`,
    `text-2xl`,
    `font-bold`,
    `text-gray-900`
  );
  noResults.textContent = `No se encontraron recetas`;

  // Revisa si no hay recetas para mostrar
  if (!recipes.length) {
    RECIPES_CONTAINER.appendChild(noResults);

    return;
  }

  recipes.forEach((recipe) => {
    const { strMeal, strMealThumb, idMeal } = recipe;

    const recipeCard = createRecipeCard(
      strMeal ?? recipe.title,
      strMealThumb ?? recipe.image,
      idMeal ?? recipe.id
    );

    RECIPES_CONTAINER.appendChild(recipeCard);
  });
}

function createRecipeCard(title, image, id) {
  const card = document.createElement(`DIV`);
  card.classList.add(
    `card-recipe`,
    `flex`,
    `flex-col`,
    `rounded-lg`,
    `bg-white`,
    `shadow-md`,
    `overflow-hidden`,
    `hover:shadow-xl`,
    `transition-shadow`,
    `duration-300`
  );

  const cardImage = document.createElement(`IMG`);
  cardImage.classList.add(`w-full`, `h-48`, `object-cover`);
  cardImage.src = image;
  cardImage.alt = `Imagen de la receta ${title}`;

  const cardBody = document.createElement(`DIV`);
  cardBody.classList.add(
    `card-recipe__body`,
    `p-4`,
    `flex`,
    `flex-col`,
    `flex-grow`,
    `justify-between`,
    `gap-4`
  );

  const cardTitle = document.createElement(`H3`);
  cardTitle.classList.add(
    `card-recipe__title`,
    `text-lg`,
    `text-center`,
    `font-bold`,
    `text-gray-900`
  );
  cardTitle.textContent = title;

  const cardBtn = document.createElement(`BUTTON`);
  cardBtn.classList.add(
    `card-recipe__btn`,
    `rounded-md`,
    `py-2`,
    `w-full`,
    `bg-amber-500`,
    `text-white`,
    `font-bold`,
    `transition-colors`,
    `duration-300`,
    `hover:bg-amber-600`
  );
  cardBtn.setAttribute(`data-meal-id`, id);
  cardBtn.textContent = `Ver Receta`;
  cardBtn.onclick = () => {
    selectRecipe(id);
  };

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardBtn);

  card.appendChild(cardImage);
  card.appendChild(cardBody);

  return card;
}

function displayRecipe(recipe) {
  const { strMeal, strInstructions, idMeal, strMealThumb } = recipe;

  const modalTitle = document.querySelector(`.modal__title`);
  const modalBody = document.querySelector(`.modal__body`);
  const modalFooter = document.querySelector(`.modal__footer`);

  // Obtener los ingredientes y cantidades de la receta
  const ingredientsContainer = getIngredients(recipe);

  modalTitle.textContent = strMeal; // Nombre de la receta
  modalBody.innerHTML = `
            <img
              src="${strMealThumb}"
              alt="Imagen de la receta ${strMeal}"
              class="w-full h-48 object-cover rounded-md mb-4"
            />
            <h4 class="text-lg font-semibold text-gray-800 mb-2">
              Ingredientes:
            </h4>
            ${ingredientsContainer}
            <h4 class="text-lg font-semibold text-gray-800 mb-2">
              Preparación:
            </h4>
            <p id="recipe-instructions" class="text-gray-700">
              ${strInstructions}
            </p>
  `;

  // Limpiar el footer
  clearHTML(modalFooter);

  // Crear boones de guardar favoritos y cerrar el modal.

  // Boton para guardar favoritos
  const saveFvoriteModalBtn = document.createElement(`BUTTON`);
  saveFvoriteModalBtn.classList.add(
    `modal__btn`,
    `rounded-md`,
    `px-4`,
    `py-2`,
    `bg-amber-500`,
    `text-white`,
    `font-bold`,
    `transition-colors`,
    `duration-300`,
    `hover:bg-amber-600`,
    `cursor-pointer`,
    `focus:outline-none`
  );
  saveFvoriteModalBtn.textContent = existingRecipeStorage(idMeal)
    ? `Eliminar de Favoritos`
    : `Guardar como Favorito`;

  // Lógica para guardar la receta como favorita en localStorage
  saveFvoriteModalBtn.onclick = () => {
    // Verifica si la receta ya existe en el local storage
    if (existingRecipeStorage(idMeal)) {
      // Si existe, eliminarla de favoritos
      removeFavoriteRecipe(idMeal);

      // Cambiar el texto del botón
      saveFvoriteModalBtn.textContent = `Guardar como Favorito`;

      // Mostrar un toast
      showToast(`Receta eliminada de favoritos`);

      return;
    }

    // Crear objeto de la receta
    const recipeObj = {
      id: idMeal,
      title: strMeal,
      image: strMealThumb,
      instructions: strInstructions,
    };

    // Agregar la receta a favoritos
    addFavoriteRecipe(recipeObj);

    // Cambiar el texto del botón
    saveFvoriteModalBtn.textContent = `Eliminar de Favoritos`;

    // Mostrar un toast
    showToast(`Receta guardada como favorito`);
  };

  // Boton para cerrar el modal
  const closeModalBtn = document.createElement(`BUTTON`);
  closeModalBtn.classList.add(
    `modal__btn`,
    `rounded-md`,
    `px-4`,
    `py-2`,
    `bg-red-500`,
    `text-white`,
    `font-bold`,
    `transition-colors`,
    `duration-300`,
    `hover:bg-red-600`,
    `cursor-pointer`,
    `focus:outline-none`
  );
  closeModalBtn.textContent = `Cerrar`;
  closeModalBtn.onclick = () => closeModal();

  // Agregar los botones al HTML
  modalFooter.appendChild(saveFvoriteModalBtn);
  modalFooter.appendChild(closeModalBtn);

  // Mostrar el modal
  openModal();

  // Cerrar el modal al tocar fuera de el
  MODAL_CONTAINER.onclick = (e) => closeModalOffScreen(e);
}

function getIngredients(recipe) {
  const ingredientsContainer = document.createElement(`UL`);
  ingredientsContainer.classList.add(
    `list-disc`,
    `list-inside`,
    `text-gray-700`,
    `mb-4`
  );

  // Iterar por los ingredientes y cantidades de la receta y crear un elemento li para cada uno de ellos
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      const ingredientElement = document.createElement(`li`);
      ingredientElement.textContent = `${measure} ${ingredient}`;

      ingredientsContainer.appendChild(ingredientElement);
    }
  }

  return ingredientsContainer.outerHTML;
}

// Función para agregar la receta a favoritos
function addFavoriteRecipe(recipeObj) {
  // Obtener los favoritos
  const favorites = JSON.parse(localStorage.getItem(`favorites`)) || [];

  // Agregar la receta al favoritos y almacenarlo en el local storage
  localStorage.setItem(`favorites`, JSON.stringify([...favorites, recipeObj]));
}

// Funcion para eliminar la receta de favoritos
function removeFavoriteRecipe(id) {
  // Obtener los favoritos
  const favorites = JSON.parse(localStorage.getItem(`favorites`)) || [];

  // Filtrar la receta que se desea eliminar
  const updateFavorites = favorites.filter((favorite) => favorite.id !== id);

  // Almacenar los favoritos actualizados en el local storage
  localStorage.setItem(`favorites`, JSON.stringify(updateFavorites));
}

function existingRecipeStorage(id) {
  const favorites = JSON.parse(localStorage.getItem(`favorites`)) || [];

  // Verifica si la receta ya existe en el local storage
  return favorites.some((favorite) => favorite.id === id);
}

// Funcion para mostrar un toast
function showToast(message) {
  const toastContainer = document.querySelector(`.toast-container`);
  const toastBody = document.querySelector(`.toast-body`);

  toastBody.textContent = message;
  toastContainer.classList.remove(`hidden`);
  setTimeout(() => {
    toastContainer.classList.add(`hidden`);
  }, 3000);
}

// Función para abrir el modal con las instrucciones de la receta
function openModal() {
  MODAL_CONTAINER.classList.remove(`hidden`);
  document.body.classList.add(`overflow-hidden`);
}

// Función para cerrar el modal con las instrucciones de la receta
function closeModal() {
  MODAL_CONTAINER.classList.add(`hidden`);
  document.body.classList.remove(`overflow-hidden`);
}

// Función para cerrar el modal al hacer clic fuera de él
function closeModalOffScreen(event) {
  const REFERENCE = event.target.parentElement.parentElement; // Referencia al modal

  // Verifica si el clic fue fuera del modal
  if (REFERENCE === MODAL_CONTAINER) {
    closeModal();
  }
}

// Función para obtener los favoritos del local storage
function getFavoriteRecipes() {
  const favorites = JSON.parse(localStorage.getItem(`favorites`)) || [];

  if (favorites.length) {
    printRecipes(favorites);

    return;
  }

  const noResults = document.createElement(`P`);
  noResults.classList.add(`text-center`, `text-gray-700`, `mt-8`);
  noResults.textContent = `No hay recetas favoritas`;

  const RECIPES_CONTAINER = document.querySelector(`#recipes-container`);
  RECIPES_CONTAINER.appendChild(noResults);
}

// Helpers
function clearHTML(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
}

// Evento para cargar la aplicacion al cargar el DOM
document.addEventListener(`DOMContentLoaded`, startApp);
