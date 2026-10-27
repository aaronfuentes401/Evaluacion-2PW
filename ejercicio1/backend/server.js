
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

function generarNumero() {
  return Math.floor(Math.random() * 100) + 1;
}

let numeroSecreto = generarNumero();

app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor funcionando correctamente" });
});

app.post("/guess", (req, res) => {
  const { numero } = req.body || {};

  if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
    return res.status(400).json({
      mensaje: "El número debe ser un entero entre 1 y 100",
    });
  }

  if (numero === numeroSecreto) {
    return res.json({ resultado: "correcto" });
  }

  return res.json({
    resultado: numeroSecreto > numero ? "mayor" : "menor",
  });
});

app.post("/reset", (req, res) => {
  numeroSecreto = generarNumero();
  return res.json({ mensaje: "Se generó un nuevo número" });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
