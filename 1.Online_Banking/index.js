import inquirer from "inquirer";

let tries = 0;
let maxTries = 3;
let users = [
  {
    username: "leona",
    password: "123",
    amount: 2000,
    isLocked: true,
  },
  {
    username: "lucian",
    password: "123",
    amount: 2000,
    isLocked: false,
  },
];

const loginQuestions = [
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

const bankQuestions = [
  {
    type: "list",
    name: "operation",
    message: "Select the operation to make in the online Bank system",
    choices: ["View", "Deposit", "Withdraw", "Transfer"],
  },
];

const bankOperations = (currentUser) => {
  inquirer
    .prompt(bankQuestions)
    .then((answers) => {
      let { operation } = answers;
      switch (operation) {
        case "View":
          console.log(`Your money: ${currentUser.amount} USD`);
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
    .prompt([
      {
        type: "input",
        name: "deposit",
        message: "How much do you want to deposit?",
      },
    ])
    .then((answers) => {
      let { deposit } = answers;
      let newBalance = currentUser.amount + parseFloat(deposit);
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
      let newBalance = currentUser.amount - parseFloat(withdraw);
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
      let newBalance = currentUser.amount - parseFloat(transfer);
      let targetUser = users.find((el) => el.username === target);

      if (newBalance < 0) {
        console.log("You don't have enough money");
      } else if (!targetUser) {
        console.log("Target Bank account doesn't exist");
        return false;
      } else {
        targetUser.amount += parseFloat(transfer);
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

authenticate();
