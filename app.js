// calculation module controller, storing data, brain of the app
let budgetController = (() => {
  let Expense = (id, description, value) => {
    // constructor for each expense that will be in app
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Income = function (id, description, value) {
    // constructor for each income that will be in app
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  return {
    addItem: (type, desc, val) => {
      let newItem;

      let id;
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1; // always will get the last one and increment by one
      } else {
        id = 0;
      }

      if (type === "exp") {
        newItem = new Expense(id, desc, val); // new expense
      } else if (type === "inc") {
        newItem = new Income(id, desc, val); // new income
      }

      // add into structure with expenses and incomes
      data.allItems[type].push(newItem);

      return newItem;
    },
  };
})();

// view module controller that will update fields and views in the UI, manipulation with UI
let UIController = (() => {
  let DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
  };

  return {
    getInput: () => {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    getDOMstrings: () => {
      // public access
      return DOMstrings;
    },
  };
})();

// global module controller , controling other two modules and use them in combination
// APP CONTROLLER is the place where we use and tell other modules what to do
let controller = ((budgetCtr, UICtr) => {
  let setupEventListeners = () => {
    let DOM = UIController.getDOMstrings();
    console.log(DOM);
    document.querySelector(DOM.inputButton).addEventListener("click", addItem);
    document.addEventListener("keypress", (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        addItem();
      }
    });
  };

  let addItem = () => {
    let input, newItem;
    // get the input data from the field
    input = UIController.getInput();

    // add the item to the budget controller
    newItem = budgetController.addItem(
      input.type,
      input.description,
      input.value
    );

    // add the item to the UI
    // calculate the budget
    // display the budget on the UI
  };

  return {
    init: () => {
      console.log("Application has started!");
      setupEventListeners();
    },
  };
})(budgetController, UIController);

// starting app
controller.init();
