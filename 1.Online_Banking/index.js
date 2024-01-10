import inquirer from "inquirer";
import {
  loginQuestions,
  currencyList,
  bankQuestions,
  depositQuestion,
} from "./questions.js";
import { config } from "./config.js";

let tries = 0;
let maxTries = 3;
let users = [
  {
    username: "leona",
    password: "123",
    balance: {
      USD: 2000,
      CLP: 0,
      ARS: 0,
      EUR: 0,
      TRY: 0,
      GPB: 0,
    },
    isLocked: true,
  },
  {
    username: "lucian",
    password: "123",
    balance: {
      USD: 2000,
      CLP: 0,
      ARS: 0,
      EUR: 0,
      TRY: 0,
      GPB: 0,
    },
    isLocked: false,
  },
];

const authenticate = () => {
  inquirer
    .prompt(loginQuestions)
    .then((answers) => {
      let { username, password } = answers;
      let currentUser = users.find((el) => el.username === username);
      if (!currentUser) {
        console.log("User doesn't exist");
        return false;
      }
      if (currentUser.isLocked) {
        console.log("User is locked, please contact the Bank");
        return false;
      } else if (
        username === currentUser.username &&
        password === currentUser.password
      ) {
        console.log(`Welcome to the Bank ${username}`);
        bankOperations(currentUser);
      } else {
        console.log("Username or Password is incorrect");
        tries++;
        console.log(`Number of tries left: ${maxTries - tries}`);
        authenticate();

        if (maxTries === tries) {
          currentUser.isLocked = true;
          return false;
        }
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
};

const bankOperations = (currentUser) => {
  inquirer
    .prompt(bankQuestions)
    .then((answers) => {
      let { operation } = answers;
      switch (operation) {
        case "View":
          console.log(`Your balance is: ${currentUser.balance.USD} USD`);
          break;
        case "Deposit":
          depositOperation(currentUser);
          break;
        case "Withdraw":
          withdrawOperation(currentUser);
          break;
        case "Transfer":
          transferOperation(currentUser);
          break;
        case "Currency Converter":
          currencyOperation(currentUser);
          break;
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
};

const depositOperation = (currentUser) => {
  inquirer
    .prompt(depositQuestion)
    .then((answers) => {
      let { deposit } = answers;
      let newBalance = currentUser.balance.USD + parseFloat(deposit);
      console.log(
        `Your deposit is: ${deposit} and your new balance is: ${newBalance}`
      );
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log(error.isTtyError);
      } else {
        // Something else went wrong
      }
    });
};

const withdrawOperation = (currentUser) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "withdraw",
        message: "How much do you want to withdraw?",
      },
    ])
    .then((answers) => {
      let { withdraw } = answers;
      let newBalance = currentUser.balance.USD - parseFloat(withdraw);
      if (newBalance < 0) {
        console.log("You don't have enough money");
      } else {
        console.log(
          `You withdrew ${withdraw} and your new balance is: ${newBalance}`
        );
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log(error.isTtyError);
      } else {
        // Something else went wrong
      }
    });
};

const transferOperation = (currentUser) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "transfer",
        message: "How much do you want to transfer?",
      },
      {
        type: "input",
        name: "target",
        message: "To who do you want to transfer?",
      },
    ])
    .then((answers) => {
      let { transfer, target } = answers;
      let newBalance = currentUser.balance.USD - parseFloat(transfer);
      let targetUser = users.find((el) => el.username === target);

      if (newBalance < 0) {
        console.log("You don't have enough money");
      } else if (!targetUser) {
        console.log("Target Bank account doesn't exist");
        return false;
      } else {
        targetUser.balance.USD += parseFloat(transfer);
        console.log(
          `You transferred ${transfer} and your new balance is: ${newBalance}`
        );
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log(error.isTtyError);
      } else {
        // Something else went wrong
      }
    });
};

const currencyOperation = (currentUser) => {
  inquirer
    .prompt(currencyList)
    .then((answers) => {
      const API_KEY = config.API.API_KEY;
      const balance = currentUser.balance.USD;
      let { amount, target } = answers;
      let apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
      console.log(apiUrl);
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log(error.isTtyError);
      } else {
        // Something else went wrong
      }
    });
};

authenticate();
