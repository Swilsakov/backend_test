const express = require("express");
const authRouter = require("./routes/auth.routes");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});
