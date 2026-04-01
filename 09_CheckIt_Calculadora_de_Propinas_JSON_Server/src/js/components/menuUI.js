/* Componente UI para el menú */

// Importaciones
import { appState } from "../core/state.js";
import { cleanHTML } from "../utils/domUtils.js";
import { addDishToOrder } from "../core/order_logic.js";

export function renderCategoryFilter(categories) {
  const categorySelect = document.querySelector(`#category-select`);

  // Limpiar el html previo, excepto la opción "Todas las categorías"
  while (categorySelect.children.length > 1)
    categorySelect.removeChild(categorySelect.lastChild);

  categories.forEach((category) => {
    const { id, label } = category;

    const option = document.createElement(`OPTION`);
    option.value = id;
    option.textContent = label;

    categorySelect.appendChild(option);
  });

  // Función para hacer el cambio de categoría
  categorySelect.addEventListener(`change`, filterDishes);
}

function filterDishes(e) {
  const categorySelected = parseInt(e.target.value);
  const { dishes, categories } = appState;

  // Si no hay categoría seleccionada (0 o NaN) se muestran todas.
  if (!categorySelected) return renderMenu(dishes, categories);

  // Filtrar el arreglo
  const dishesFiltered = dishes.filter(
    (dish) => dish.category_id === categorySelected,
  );

  // Pintar los platillos y categorias filtradas en el HTML
  renderMenu(dishesFiltered, categories);
}

export function renderMenu(dishes, categories) {
  const menuContent = document.querySelector(`#menu-content`);

  // Limpiar el HTML previo
  cleanHTML(menuContent);

  // Iterar sobre el arreglo de platillos
  dishes.forEach((dish, index) => {
    const { id, name, price, description, category_id } = dish;

    // Buscar las categorias con find
    const categoryObj = categories.find((cat) => cat.id === category_id);
    const categoryLabel = categoryObj.label;

    // Crear la columna
    const colDiv = document.createElement(`DIV`);
    colDiv.classList.add(`col`, `appear`);
    colDiv.style.animationDelay = `${index * 0.3}s`;

    // Crear card
    const cardDiv = document.createElement(`DIV`);
    cardDiv.classList.add(
      `card`,
      `h-100`,
      `border-0`,
      `shadow-sm`,
      `rounded-4`,
      `menu-item-card`,
    );

    const cardBody = document.createElement(`DIV`);
    cardBody.classList.add(`card-body`, `p-4`, `d-flex`, `flex-column`);

    const cardBadge = document.createElement(`SPAN`);
    cardBadge.classList.add(
      `cardBadge`,
      `bg-warning-subtle`,
      `text-primary`,
      `align-self-start`,
      `mb-2`,
      `px-3`,
    );
    cardBadge.textContent = categoryLabel;

    const cardTitle = document.createElement(`H3`);
    cardTitle.classList.add(`fs-5`, `fw-bold`, `mb-1`);
    cardTitle.textContent = name;

    const cardDesc = document.createElement(`P`);
    cardDesc.classList.add(`text-muted`, `small`, `mb-2`);
    cardDesc.textContent = description;

    const cardPriceTag = document.createElement(`P`);
    cardPriceTag.classList.add(
      `text-primary`,
      `fw-bold`,
      `fs-4`,
      `mt-auto`,
      `mb-2`,
    );
    cardPriceTag.textContent = `$${price}`;

    const cardInputQty = document.createElement(`INPUT`);
    cardInputQty.type = `number`;
    cardInputQty.min = 0;
    cardInputQty.max = 10;
    cardInputQty.value = 0;
    cardInputQty.id = `product-${id}`;
    cardInputQty.classList.add(
      `form-control`,
      `text-center`,
      `rounded-pill`,
      `border-primary`,
      `fw-bold`,
      `shadow-sm`,
    );

    // Función que detecta la cantidad y el platillo que está agregandose
    cardInputQty.addEventListener(`change`, (e) => {
      let quantity = parseInt(cardInputQty.value);

      // Validar que la cantidad elegida no sea mayor a 10 ni menor a 0
      if (quantity > 10) quantity = 10;
      if (quantity < 0) quantity = 0;

      cardInputQty.value = quantity;

      addDishToOrder({ ...dish, quantity });
    });

    // Contenedor del input
    const cardQtyContainer = document.createElement(`DIV`);
    cardQtyContainer.classList.add(`mt-auto`);

    const cardQtyLabel = document.createElement(`label`);
    cardQtyLabel.classList.add(
      `form-label`,
      `small`,
      `text-muted`,
      `fw-bold`,
      `mb-1`,
      `ms-2`,
    );
    cardQtyLabel.textContent = `Cantidad`;

    cardQtyContainer.appendChild(cardQtyLabel);
    cardQtyContainer.appendChild(cardInputQty);

    // Ensamblar la card
    cardBody.appendChild(cardBadge);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardDesc);
    cardBody.appendChild(cardPriceTag);
    cardBody.appendChild(cardQtyContainer);

    // Añadir el body al div
    cardDiv.appendChild(cardBody);

    // Añadir la card a la columna
    colDiv.appendChild(cardDiv);

    // Añadir la columna al Contenedor del menú
    menuContent.appendChild(colDiv);
  });
}
