const Router = require("express");
const router = new Router();
const authController = require("../controller/auth.controller");

// Мидлвэр для проверки активности сессии
const checkSessionTimeout = (req, res, next) => {
  // Проверка активности сессии здесь
  // Если сессия активна, вызывайте next()
  // Если сессия неактивна, отправляйте ответ с ошибкой или перенаправляйте пользователя на страницу входа
  next();
};

router.post("/registration", authController.registration);
router.post("/login", authController.authorization);

router.get("/protected-route", checkSessionTimeout, (req, res) => {
  // Защищенный маршрут, доступный только при активной сессии
  res.send("Protected route");
});

module.exports = router;
