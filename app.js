/* ***
BUDGET CONTROLLER
*** */

// calculation module controller, storing data, brain of the app
let budgetController = (() => {
  let Expense = function (id, description, value) {
    // constructor for each expense that will be in app
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calculatePercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
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
    deleteItem: (type, id) => {
      let idElements;
      idElements = data.allItems[type].map((current) => {
        // new array
        return current.id;
      });
      index = idElements.indexOf(id); // exact index number of the element

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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
    calculatePercentages: () => {
      data.allItems.exp.forEach((current) => {
        current.calculatePercentage(data.totals.inc);
      });
    },
    getBudget: () => {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExpences: data.totals.exp,
        percentage: data.percentage,
      };
    },
    getPercentages: () => {
      let allPercentages;
      allPercentages = data.allItems.exp.map((current) => {
        return current.getPercentage();
      });
      return allPercentages;
    },
  };
})();

/* ***
UI CONTROLLER
*** */

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
    container: ".container",
    expencesPercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  let formatNumber = (number, type) => {
    let numberSplit, int, dec, sign;

    number = Math.abs(number);
    number = number.toFixed(2);

    numberSplit = number.split(".");

    int = numberSplit[0];
    dec = numberSplit[1];

    if (int.length > 3) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length); // input 26324, output 26,324
    }

    type === "exp" ? (sign = "-") : (sign = "+");

    return sign + " " + int + "." + dec;
  };

  let nodeListForEach = (list, callback) => {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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
          '<div class="item clearfix" id="inc-*id*"><div class="item__description">*description*</div><div class="right clearfix"><div class="item__value">*value*</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-*id*"><div class="item__description">*description*</div><div class="right clearfix"><div class="item__value">*value*</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // replace placeholder with some real data, data received fron the object
      newHtml = html.replace("*id*", obj.id);
      newHtml = newHtml.replace("*description*", obj.description);
      newHtml = newHtml.replace("*value*", formatNumber(obj.value, type));
      // add that HTML to the DOM
      document
        .querySelector(element)
        .insertAdjacentHTML("beforeBegin", newHtml);
    },

    deleteListItem: (selectorId) => {
      let element;
      element = document.getElementById(selectorId);
      element.parentNode.removeChild(element);
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
      let type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalIncome,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExpences, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: (percentages) => {
      let fields;
      fields = document.querySelectorAll(DOMstrings.expencesPercentageLabel);

      nodeListForEach(fields, (current, index) => {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    displayDate: () => {
      let now, month, months, year;
      now = new Date();

      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent =
        months[month] + " " + year;
    },

    changedType: () => {
      let fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, (current) => {
        current.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.inputButton).classList.toggle("red");
    },

    getDOMstrings: () => {
      // public access
      return DOMstrings;
    },
  };
})();

/* ***
MAIN APP CONTROLLER
*** */

// global module controller , controling other two modules and use them in combination
// APP CONTROLLER is the place where we use and tell other modules what to do
let controller = ((budgetCtr, UICtr) => {
  let setupEventListeners = () => {
    let DOM = UIController.getDOMstrings();
    document.querySelector(DOM.inputButton).addEventListener("click", addItem);
    document.addEventListener("keypress", (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        addItem();
      }
    });

    document.querySelector(DOM.container).addEventListener("click", deleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UIController.changedType);
  };

  let updateBudget = () => {
    // calculate the budget
    budgetController.calculateBudget();
    // display the budget on the UI
    let budget = budgetController.getBudget();
    // return the budget
    UIController.displayBudget(budget);
  };

  let updatePercentages = () => {
    // calculate percentages
    budgetController.calculatePercentages();
    // read percentages from the controler
    let percentages;
    percentages = budgetController.getPercentages();
    // update the UI
    UIController.displayPercentages(percentages);
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
      // calculate and update percentages
      updatePercentages();
    }
  };

  let deleteItem = (event) => {
    let itemId, splitId, type, id;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      splitId = itemId.split("-"); // array of 1st element before dash and 2nd is after the dash
      type = splitId[0];
      id = parseInt(splitId[1]);

      // delete item from the structure
      budgetController.deleteItem(type, id);
      // delete item from the UI
      UIController.deleteListItem(itemId);
      // update and show the new budget
      updateBudget();
    }
  };

  return {
    init: () => {
      console.log("Application has started!");
      UIController.displayDate();
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

// ==> starting app
controller.init();
