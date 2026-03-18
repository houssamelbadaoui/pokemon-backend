const express = require("express");
const app = express();

// connect el middleware
const combatesMiddleware = require("./middleware/combates");
app.use(combatesMiddleware);

// middleware to read json
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

// test middleware combates
app.get("/test", (req, res) => {
  res.json(req.combates);
});
app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
