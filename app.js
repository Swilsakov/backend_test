const express = require("express");
const authRouter = require("./routes/auth.routes");
const calcRouter = require("./routes/calc.routes");
const corsMiddleware = require("./middleware/cors.middleware");

const app = express();
const PORT = 8000;

app.use(corsMiddleware);
app.use(express.json());
app.use("/api", authRouter);
app.use("/", calcRouter);

app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});
