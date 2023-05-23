const Router = require("express");
const router = new Router();
const authController = require("../controller/auth.controller");
const checkSessionExpiration = require("../middleware/checkSession");
const calcRouter = require("./calc.routes");

router.post("/registration", authController.registration);
router.post("/login", authController.authorization);
router.get("/protected-route", checkSessionExpiration, (req, res) => {
  // Защищенный маршрут, доступный только при активной сессии
  res.send("Protected route");
});
router.use("/protected-route", calcRouter); // Добавляем calcRouter как подмаршрут для "/protected-route"

module.exports = router;
