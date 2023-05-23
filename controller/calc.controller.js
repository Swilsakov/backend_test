const db = require("../db");

class CalcController {
  createOperation = async (req, res) => {
    try {
      const { num1, operator, num2 } = req.body;
      if (!(num1 && operator && num2)) {
        res.status(400).send("Enter all inputs");
      }
      const number1 = parseFloat(num1);
      const number2 = parseFloat(num2);
      const operatorType = operator;
      let resultOperation;

      switch (operatorType) {
        case "+":
          resultOperation = number1 + number2;
          break;
        case "-":
          resultOperation = number1 - number2;
          break;
        case "*":
          resultOperation = number1 * number2;
          break;
        case "/":
          resultOperation = Math.floor(number1 / number2);
          break;
        default:
          res.status(400).send("Неправильный оператор!");
          return;
      }

      let result;
      if (resultOperation) {
        result = await db.query(
          "INSERT INTO calculator (num1, num2, operator, result) values ($1, $2, $3, $4) RETURNING *",
          [number1, number2, operatorType, resultOperation]
        );
        result = result.rows[0];
      }

      res.status(201).json(result);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new CalcController();
