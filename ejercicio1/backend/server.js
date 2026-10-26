const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Devuelve un número entero aleatorio entre 1 y 100
function generarNumero() {
  return Math.floor(Math.random() * 100) + 1;
}

// Número oculto que el usuario debe adivinar (se genera al iniciar el servidor)
let numeroSecreto = generarNumero();

app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor funcionando correctamente" });
});

app.post("/guess", (req, res) => {
  const numero = Number(req.body?.numero);

  if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
    return res.status(400).json({ mensaje: "Debes enviar un número entero entre 1 y 100" });
  }

  if (numero === numeroSecreto) {
    return res.json({ resultado: "correcto", mensaje: `¡Correcto! El número era ${numeroSecreto}` });
  }

  if (numeroSecreto > numero) {
    return res.json({ resultado: "mayor", mensaje: `El número oculto es mayor que ${numero}` });
  }

  res.json({ resultado: "menor", mensaje: `El número oculto es menor que ${numero}` });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
