
const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend Food DEI funcionando"
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor Food DEI en http://localhost:${PORT}`);
});
