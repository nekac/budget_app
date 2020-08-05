// calculation module controller, brain of the app
let budgetController = (() => {
  // code
})();

// view module controller that will update fields and views in the UI
let UIController = (() => {
  // code
})();

// global module controller , controling other two modules and use them in combination
let controller = ((budgetCtr, UICtr) => {
  let addItem = () => {
    // get the input data from the field
    // add the item to the budget controller
    // add the item to the UI
    // calculate the budget
    // display the budget on the UI
  };

  document.querySelector(".add__btn").addEventListener("click", addItem);

  document.addEventListener("keypress", (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      addItem();
    }
  });
})(budgetController, UIController);
