const express = require("express");
const app = express();

// connect el middleware
const combatesMiddleware = require("./middleware/combates");
app.use(combatesMiddleware);

// middleware to read json
app.use(express.json());

// montar pokemon route
const pokemonRoutes = require("./routes/pokemon");
app.use("/pokemon", pokemonRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
