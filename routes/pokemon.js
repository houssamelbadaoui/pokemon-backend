const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// function to read json file
function leerJson(archivo) {
  return JSON.parse(fs.readFileSync(archivo));
}

// function to writeJson
function writeJson(archivo, datos) {
  fs.writeFileSync(archivo, JSON.stringify(datos, null, 2));
}

// correct path to json file
const filePath = path.join(__dirname, "../data/pokemons.json");
const pokemons = leerJson(filePath);

// GET lista de pokemons
router.get("/lista", (req, res) => {
  const nombres = pokemons.map((p) => p.nombre);
  res.json({ Pokemons: nombres });
});

// POST pokemon nueva
router.post("/nuevo", (req, res) => {
  const pokemonNuevo = req.body;

  // validate fields
  const { nombre, tipo, vida, defensa, ataques } = pokemonNuevo;
  if (!nombre || !tipo || !vida || !defensa || !ataques)
    return res.status(400).json("faltan datos necesarios");

  pokemons.push(pokemonNuevo);
  writeJson(filePath, pokemons);
  res.status(200).json({ status: "ok" });
});

module.exports = router;
