const db = require("../db");
const jwt = require("jsonwebtoken");

class CalcController {
  createOperation = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    try {
      // проверка на сессию
      const decoded = jwt.verify(token, "test_db");
      const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
      if (!decoded.exp <= currentTime) {
        // запрос на создание
        const { num1, operator, num2, user_id } = req.body;
        if (!(num1 && operator && num2 && user_id)) {
          res.status(400).send("Enter all inputs");
        }

        // проверка на user_id
        const isChecked = await db.query(
          "SELECT user_id FROM calculator where user_id = $1",
          [user_id]
        );
        if (isChecked.rows.length > 0) {
          // логика калькулятора
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

          // get result
          let result;
          if (resultOperation) {
            result = await db.query(
              "INSERT INTO calculator (num1, num2, operator, result, user_id) values ($1, $2, $3, $4, $5) RETURNING *",
              [number1, number2, operatorType, resultOperation, user_id]
            );
            result = result.rows[0];
          }
          res.status(201).json(result);
        } else {
          res.status(400).send("Неправильный user_id!");
        }
      } else {
        return res.status(401).send("Session expired");
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).send("Session expired (token)");
      }
      console.log(error);
    }
  };

  getAllOperations = async (req, res) => {
    try {
      const { user_id } = req.body;
      const operations = await db.query(
        "SELECT * FROM calculator where user_id = $1",
        [user_id]
      );
      res.status(200).json(operations.rows);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new CalcController();
