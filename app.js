const express = require("express");
const authRouter = require("./routes/auth.routes");
const calcRouter = require("./routes/calc.routes");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use("/api", authRouter);
app.use("/", calcRouter);

app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});
