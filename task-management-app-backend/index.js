(async () => {
  await require("./db")();
  console.log("Connected to Database.");
})();

const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const User = require("./models/User");
const Task = require("./models/Task");
app.use(cors());
app.use(express.json());
// available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

app.get("/getAllUsers", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.json(allUsers);
  } catch (error) {
    console.log(error);
  }
});
app.get("/getAllUsers/fetchalltasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(
    `Task Management app backend listening on port http://localhost:${port}`
  );
});
