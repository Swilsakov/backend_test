const jwt = require("jsonwebtoken");

const checkSessionExpiration = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, "test_db");
    const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
    if (decoded.exp <= currentTime) {
      return res.status(401).send("Session expired");
    }

    // Продолжение выполнения запроса
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send("Token expired");
    }

    console.log(error);
  }
};

module.exports = checkSessionExpiration;
