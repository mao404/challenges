import inquirer from "inquirer";
import {
  loginQuestions,
  currencyList,
  bankQuestions,
  depositQuestion,
  transferQuestion,
  withdrawQuestion,
  fundsWithdrawQuestion,
  continueQuestion,
} from "./questions.js";
import { config } from "./config.js";
import { users } from "./db.js";

let tries = 0;
let maxTries = 3;

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
          continueOperation(currentUser);
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
        case "Exit":
          process.exit(0);
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
      continueOperation(currentUser);
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
    .prompt(withdrawQuestion)
    .then((answers) => {
      let { withdraw } = answers;
      let newBalance = currentUser.balance.USD - parseFloat(withdraw);
      if (newBalance < 0) {
        console.log("You don't have enough funds");
      } else {
        console.log(
          `You withdrew ${withdraw} and your new balance is: ${newBalance}`
        );
        continueOperation();
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
    .prompt(transferQuestion)
    .then((answers) => {
      let { transfer, target } = answers;
      let newBalance = currentUser.balance.USD - parseFloat(transfer);
      let targetUser = users.find((el) => el.username === target);

      if (newBalance < 0) {
        console.log("You don't have enough funds");
      } else if (!targetUser) {
        console.log("Target Bank account doesn't exist");
        return false;
      } else {
        targetUser.balance.USD += parseFloat(transfer);
        console.log(
          `You transferred ${transfer} and your new balance is: ${newBalance}`
        );
      }
      continueOperation(currentUser);
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
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const exchangeRates = data.conversion_rates;
          const convertionRate = exchangeRates[target];
          const newBalance = amount * convertionRate;
          const currencyAdd = parseFloat(
            currentUser.balance[target] + newBalance
          ).toFixed(2);
          const realBalance = balance - amount;
          if (realBalance < 0) {
            console.log("Not enough funds to perform this task");
            currencyOperation(currentUser);
          } else {
            console.log(
              `Your new balance in ${target} is ${currencyAdd} and your base balance is ${realBalance}`
            );
            fundsWithdrawOperation(currentUser, target, currencyAdd);
          }
        });
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log(error.isTtyError);
      } else {
        // Something else went wrong
      }
    });
};

const fundsWithdrawOperation = (currentUser, target, currencyAdd) => {
  inquirer
    .prompt(fundsWithdrawQuestion)
    .then((answers) => {
      const { withdraw } = answers;
      switch (withdraw) {
        case "Yes":
          const comissionRate = 0.01; // 1%
          const funds = currencyAdd;
          const comission = parseFloat(funds * comissionRate).toFixed(2);
          console.log(`You just withdrew ${target} ${funds - comission} `);
          continueOperation(currentUser);
          break;
        case "No":
          continueOperation(currentUser);
          break;
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

const continueOperation = (currentUser) => {
  inquirer
    .prompt(continueQuestion)
    .then((answers) => {
      const { next } = answers;
      switch (next) {
        case "Yes":
          bankOperations(currentUser);
          break;
        case "No":
          process.exit(0);
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

authenticate();
