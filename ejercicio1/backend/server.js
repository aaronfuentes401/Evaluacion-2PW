
const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor funcionando correctamente" });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
