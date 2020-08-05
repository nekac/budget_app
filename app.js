// calculation module controller, storing data, brain of the app
let budgetController = (() => {
  let Expense = function (id, description, value) {
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
    budget: 0,
    percentage: -1, // not existing, can not be calculated
  };

  let calculateTotal = (type) => {
    let sum = 0;

    data.allItems[type].forEach((current) => {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  return {
    addItemToTheStucture: (type, desc, val) => {
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
    calculateBudget: () => {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // clalculate the budget
      data.budget = data.totals.inc - data.totals.exp;
      // calculate percentage of the income is spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1; // non existing
      }
    },
    getBudget: () => {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExpences: data.totals.exp,
        percentage: data.percentage,
      };
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
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
  };

  return {
    getInput: () => {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    addListItem: (obj, type) => {
      // create HTML string with placeholder
      let html, newHtml, element;

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-*id*"><div class="item__description">*description*</div><div class="right clearfix"><div class="item__value">*value*</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-*id*"><div class="item__description">*description*</div><div class="right clearfix"><div class="item__value">*value*</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // replace placeholder with some real data, data received fron the object
      newHtml = html.replace("*id*", obj.id);
      newHtml = newHtml.replace("*description*", obj.description);
      newHtml = newHtml.replace("*value*", obj.value);
      // add that HTML to the DOM
      document
        .querySelector(element)
        .insertAdjacentHTML("beforeBegin", newHtml);
    },

    clearFields: () => {
      let fields, fieldsArray;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      fieldsArray = Array.prototype.slice.call(fields); // creating prototype array
      fieldsArray.forEach((current, index, array) => {
        // clear all fields
        current.value = "";
      });
      // focus on the first element, first input field
      fieldsArray[0].focus();
    },

    displayBudget: (obj) => {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent =
        obj.totalIncome;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExpences;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
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

  let updateBudget = () => {
    // calculate the budget
    budgetController.calculateBudget();
    // display the budget on the UI
    let budget = budgetController.getBudget();
    // return the budget
    UIController.displayBudget(budget);
  };

  let addItem = () => {
    let input, newItem;
    // get the input data from the field
    input = UIController.getInput();

    // only if test is passed and data is there inside fields
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // add the item to the budget controller
      newItem = budgetController.addItemToTheStucture(
        input.type,
        input.description,
        input.value
      );

      // add the item to the UI
      UIController.addListItem(newItem, input.type);

      // clear fileds
      UIController.clearFields();

      // caculcate and update the budget
      updateBudget();
    }
  };

  return {
    init: () => {
      console.log("Application has started!");
      UIController.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpences: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

// starting app
controller.init();
