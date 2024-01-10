export const loginQuestions = [
  {
    type: "input",
    name: "username",
    message: "Enter your username",
  },
  {
    type: "password",
    name: "password",
    message: "Enter your password",
    mask: "*",
  },
];

export const currencyList = [
  {
    type: "list",
    name: "target",
    message: "Currency to trade",
    choices: [
      {
        name: "USD",
        value: "USD",
      },
      {
        name: "CLP",
        value: "CLP",
      },
      {
        name: "ARS",
        value: "ARS",
      },
      {
        name: "EUR",
        value: "EUR",
      },
      {
        name: "TRY",
        value: "TRY",
      },
      {
        name: "GBP",
        value: "GBP",
      },
    ],
  },
  {
    type: "input",
    name: "amount",
    message: "How much do you want to convert?",
  },
];

export const bankQuestions = [
  {
    type: "list",
    name: "operation",
    message: "Select the operation to make in the online Bank system",
    choices: ["View", "Deposit", "Withdraw", "Transfer", "Currency Converter"],
  },
];

export const depositQuestion = [
  {
    type: "input",
    name: "deposit",
    message: "How much do you want to deposit?",
  },
];
