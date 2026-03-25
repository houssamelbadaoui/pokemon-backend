const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const { arch } = require("os");

// path to pokemons.json
const filePath = path.join(__dirname, "../data/pokemons.json");

// function to read json file
function leerJson(archivo) {
  return JSON.parse(fs.readFileSync(archivo, "utf-8"));
}

const pokemons = leerJson(filePath);

// POST /combate/nuevo
router.post("/nuevo", (req, res) => {
  const { pokemon1, pokemon2 } = req.body;

  // validate fields
  if (!pokemon1 || !pokemon2) return res.status(400).json("faltan datos");

  // find them inside our pokemons.json
  const p1 = pokemons.find((p) => p.nombre === pokemon1);
  const p2 = pokemons.find((p) => p.nombre === pokemon2);

  if (!p1 || !p2) return res.status(400).json("Uno de los pokémon no existe");

  // create a unique ID
  const nuevoId = req.combates.length + 1;

  // create battle
  const combate = {
    id: nuevoId,
    pokemon1: {
      nombre: p1.nombre,
      vida: p1.vida,
    },
    pokemon2: {
      nombre: p2.nombre,
      vida: p2.vida,
    },
    turno: 1,
    ganador: null,
  };

  // save battle
  req.combates.push(combate);

  res.json({ combate: nuevoId });
});

// GET /lista todos los combates
router.get("/lista", (req, res) => {
  res.json({ combates: req.combates });
});

// GET / estado de un combate usando id
router.get("/estado/:id", (req, res) => {
  const id = Number(req.params.id);
  // find combate inside combates
  const combate = req.combates.find((c) => c.id === id);

  if (!combate) return res.status(400).json("Combate no encontrado");

  res.status(200).json(combate);
});

// POST /ataque
router.post("/ataque", (req, res) => {
  const { id, ataque } = req.body;

  // find battle
  const combate = req.combates.find((c) => c.id == id);

  if (!combate) return res.status(400).json("El combate no existe");

  // check if already finished
  if (combate.ganador) return res.status(400).json("El combate ya termino");

  // determine attacker & defender
  let attacker, defensor;
  if (combate.turno === 1) {
    attacker = combate.pokemon1;
    defensor = combate.pokemon2;
  } else {
    attacker = combate.pokemon2;
    defensor = combate.pokemon1;
  }

  // find data of pokemon attacker & defensor
  const attackerData = pokemons.find((p) => p.nombre === attacker.nombre);
  const defensorData = pokemons.find((p) => p.nombre === defensor.nombre);

  const defensorDefensa = defensorData.defensa;

  // find attaque
  const attackObj = attackerData.ataques.find((a) => a.nombre === ataque);
  if (!attackObj) return res.status(400).json("El ataque no existe");

  const randomFactor = Math.random() * 0.3 + 0.85;
  const potencia = attackObj.potencia;
  const daño = (potencia - defensorDefensa * 0.3) * randomFactor;

  //limit for daño
  if (daño < 5) daño = 5;

  // apply damage
  defensor.vida -= daño;
  if (defensor.vida < 0) defensor.vida = 0;

  // check winner
  if (defensor.vida === 0) {
    combate.ganador = attacker.nombre;
  }

  // change turn
  combate.turno = combate.turno === 1 ? 2 : 1;

  // response
  res.status(200).json({ golpe: Number(daño.toFixed(2)) });
});

// POST /borrar usando el id del combate
router.post("/borrar/:id", (req, res) => {
  const id = Number(req.params.id);
  const combate = req.combates.find((c) => c.id === id);

  // if the combate not found
  if (!combate) return res.status(400).json("El combate no existe");
  const index = req.combates.findIndex((c) => c.id === id);

  // remove combate
  req.combates.splice(index, 1);

  res.status(200).json({ status: "ok" });
});
module.exports = router;
