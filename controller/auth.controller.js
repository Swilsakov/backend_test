const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  registration = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!(username && email && password)) {
        res.status(400).send("Enter all inputs");
      }
      let hashPassword = await bcrypt.hash(password, 10);
      let user = await db.query(
        "INSERT INTO users (username, email, hashed_password) values ($1, $2, $3) RETURNING *",
        [username, email, hashPassword]
      );
      const token = jwt.sign(
        {
          id: user.rows[0].id,
          email,
        },
        "test_db",
        { expiresIn: "5m" }
      );
      user.rows[0].token = token;
      res.status(201).json(user.rows[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };

  authorization = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).send("Enter all inputs");
        return;
      }
      let user = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      user = user.rows[0];
      if (user && (await bcrypt.compare(password, user.hashed_password))) {
        const token = jwt.sign(
          {
            id: user.id,
            email,
          },
          "test_db",
          { expiresIn: "5m" }
        );
        user.token = token;
        const currentDate = new Date().toISOString();
        await db.query("UPDATE users SET last_login = $1 WHERE id = $2", [
          currentDate,
          user.id,
        ]);
        user.last_login = currentDate;
        res.status(200).json(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new AuthController();
