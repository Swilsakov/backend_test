const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkSessionTimeout = async (req, res, next) => {
  const token = req.headers.authorization || req.query.token;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    // Проверка валидности токена
    const decode = jwt.verify(token, "test_db");
    const { id, email } = decode;

    // Получение пользователя из базы данных
    const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    // Проверка времени последнего успешного входа и таймаута
    const lastLogin = user.rows[0].last_login;
    const currentTime = new Date();
    sessionTimeout = 5 * 60 * 1000;
    const sessionExpired =
      lastLogin.getTime() + sessionTimeout < currentTime.getTime();

    if (sessionExpired) {
      return res.status(401).send("Session expired");
    }

    // Продление сессии на каждый запрос
    await db.query("UPDATE users SET last_login = NOW() WHERE id = $1", [id]);

    // Продолжение выполнения запроса
    req.user = { id, email };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send("Unauthorized");
  }
};
