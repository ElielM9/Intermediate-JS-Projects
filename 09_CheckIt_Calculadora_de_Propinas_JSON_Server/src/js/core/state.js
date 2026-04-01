/* Estado de la aplicación */

export let appState = getInitialState();

function getInitialState() {
  return {
    dishes: [],
    categories: [],
    currentOrder: {
      table: ``,
      hour: ``,
      order: [],
      subTotal: 0,
      tip: 0,
      get totalFinal() {
        return this.subTotal + this.tip;
      },
      actualDate: new Date().toLocaleDateString(),
    },
  };
}

export function resetAppState() {
  appState = getInitialState();
}
