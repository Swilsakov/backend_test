const express = require("express");
const router = express.Router();
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const calculate = (req, res) => {
  rl.question("Введите выражение (например, 2 + 3): ", (input) => {
    const [num1, operator, num2] = input.split(" ");
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    let result;

    switch (operator) {
      case "+":
        result = number1 + number2;
        break;
      case "-":
        result = number1 - number2;
        break;
      case "*":
        result = number1 * number2;
        break;
      case "/":
        result = number1 / number2;
        break;
      default:
        res.status(400).send("Неправильный оператор!");
        rl.close();
        return;
    }

    res.status(200).send(`Результат: ${result}`);
    console.log(result);
    rl.close();
  });
};

module.exports = calculate;
