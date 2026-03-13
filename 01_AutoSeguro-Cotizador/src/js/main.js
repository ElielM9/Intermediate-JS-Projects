/* Funciones constructoras */

function Insurance(brand, year, type) {
  this.brand = brand;
  this.year = year;
  this.type = type;
}

/* Realizar cotizacion con los datos */
Insurance.prototype.calculateCost = function () {
  /*
   * Incrementar el valor de la cotización según el tipo de seguro:
   * Si es la opción 1 (Americano) incrementa el valor 1.15
   * Si es la opción 2 (Asiatico) incrementa el valor 1.05
   * Si es la opción 3 (Europeo) incrementa el valor 1.35
   */

  let count;
  let baseCost = 2000; // Valor inicial de la cotización

  switch (this.brand) {
    case `1`:
      count = baseCost * 1.15;
      break;

    case `2`:
      count = baseCost * 1.05;
      break;

    case `3`:
      count = baseCost * 1.35;
      break;
  }

  // Leer el año
  const yearsDifference = new Date().getFullYear() - this.year;

  // Cada año que la diferencia sea mayor al actual, el costo se reduce un 3%.
  count -= (yearsDifference * 3 * count) / 100;

  /*
   * Si el tipo seleccionado es basico, se multiplica un 30% más
   * Si el tipo seleccionado es completo, se multiplica un 50% más
   */

  if (this.type === `basic`) {
    count *= 1.3; // Count = count * 1.3 
  } else if (this.type === `complete`) {
    count *= 1.5;
  }

  return count;
};

function UserInterface() {}

/* Llenar los años */
UserInterface.prototype.fillOptions = () => {
  const selectYear = document.querySelector(`#year`);
  const max = new Date().getFullYear(),
    min = max - 20;

  for (let i = max; i >= min; i--) {
    // Crear un nuevo elemento <option> para cada año
    const optionYear = document.createElement(`option`);
    optionYear.value = i;
    optionYear.textContent = i;

    // Añadir los años al select en el HTML
    selectYear.appendChild(optionYear);
  }
};

/* Mostrar alertas */
UserInterface.prototype.showMessages = (message, type) => {
  // Quitar los anteriores para evitar duplicados
  const existingMessage = document.querySelector(`.alert--${type}`);

  // Si ya existe un mensaje del mismo tipo, no agregar uno nuevo
  if (existingMessage) {
    existingMessage.textContent = message;

    return;
  }

  // Crear un nuevo div para el mensaje
  const alertMessage = document.createElement(`div`);

  if (type === `error`) {
    alertMessage.classList.add(`alert`, `alert--error`);
  } else {
    alertMessage.classList.add(`alert`, `alert--success`);
  }

  alertMessage.classList.add(`message`);
  alertMessage.textContent = message;

  // Añadir el div a la sección de resultados
  const resultsContainer = document.querySelector(`#quotation-results`);
  resultsContainer.appendChild(alertMessage);

  setTimeout(() => {
    alertMessage.remove();
  }, 3000);
};

/* Mostrar los resultados */
UserInterface.prototype.showResults = (insurance, total) => {
  const { brand, year, type } = insurance;
  switch (brand) {
    case "1":
      brandText = "Americana";
      break;
    case "2":
      brandText = "Asiática";
      break;
    case "3":
      brandText = "Europea";
      break;
  }

  switch (type) {
    case "basic":
      typeText = "Básico";
      break;
    case "complete":
      typeText = "Completo";
      break;
  }

  // Crear los resultados
  const divResult = document.createElement(`div`);
  divResult.classList.add(`result`);
  divResult.innerHTML = `
    <h3 class="result__heading">Resultado de tu cotización</h3>
    <ul class="result__list">
      <li class="result__item"><span>Tipo de marca: </span> ${brandText}</li>
      <li class="result__item"><span>Año de fabricación: </span> ${year}</li>
      <li class="result__item"><span>Tipo de seguro: </span> ${typeText}</li>
      <li class="result__item"><span>Total: </span> ${total}</li>
    </ul>
  `;

  // Mostrar el loader
  const loader = document.querySelector(`#loader`);
  loader.classList.add(`loader--active`);

  setTimeout(() => {
    // Esperar 3 segundos para mostrar el loader y después quitarlo
    loader.classList.remove(`loader--active`);

    // Limpiar resultados previos para evitar duplicados
    cleanHtml();

    // Añadir los resultados al HTML
    const resultsContainer = document.querySelector(`#quotation-results`);
    resultsContainer.appendChild(divResult);
  }, 3000);
};

// Instanciar el objeto UI
const userInterface = new UserInterface();

/* Cargar el documento para iniciar la app */
document.addEventListener(`DOMContentLoaded`, startApp);

/* Funciones */

function startApp() {
  // Llenar los años
  userInterface.fillOptions();

  // Asignar eventos al formulario
  handleFormEvents();
}

function handleFormEvents() {
  const form = document.querySelector(`#quote-form`);

  // Al enviar el formulario de cotización de seguro de auto: llamar la función quoteInsurance()
  form.addEventListener(`submit`, quoteInsurance);
}

function quoteInsurance(e) {
  e.preventDefault();

  // Limpiar resultados previos para evitar duplicados
  cleanHtml();

  // Obtener los valores seleccionados del formulario (Marca, año y tipo)
  const selectedBrand = document.querySelector(`#brand`).value;
  const selectedYear = document.querySelector(`#year`).value;
  const selectedType = document.querySelector(
    `input[name="type"]:checked`
  ).value;

  // Validar que todos los campos estén seleccionados
  const voidValue = ``;
  if (
    selectedBrand === voidValue ||
    selectedYear === voidValue ||
    selectedType === voidValue
  ) {
    // Mostrar mensaje de error al no seleccionar algún campo
    userInterface.showMessages(`Por favor, complete todos los campos`, `error`);

    return;
  }

  // Mostrar mensaje de cargando (loader) e indicar que se está calculando la cotización
  userInterface.showMessages(`Cargando...`, `success`);

  // Instanciar el seguro del auto
  const carInsurance = new Insurance(selectedBrand, selectedYear, selectedType);

  // Llamar la función para calcular el costo total
  const totalCost = carInsurance.calculateCost();

  // Mostrar los resultados
  userInterface.showResults(carInsurance, totalCost);
}

function cleanHtml() {
  // Limpiar los resultados previos (si existen)
  const existingResults = document.querySelectorAll(`.result`);

  existingResults.forEach((result) => result.remove());
}
