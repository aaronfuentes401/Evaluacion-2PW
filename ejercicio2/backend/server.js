
const express = require("express");
const cors = require("cors");

const menuRoutes = require("./routes/menu");
const reservaRoutes = require("./routes/reserva");
const verificarExpiracion = require("./middleware/verificarExpiracion");

const app = express();

app.use(cors());
app.use(express.json());

// Verificar vencimiento antes de atender las rutas
app.use(verificarExpiracion);

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend Food DEI funcionando"
  });
});

app.use("/api/menu", menuRoutes);
app.use("/api/reserva", reservaRoutes);

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Servidor Food DEI en http://localhost:${PORT}`);
});
