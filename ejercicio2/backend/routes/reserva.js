const express = require("express");
const { reserva, calcularTotal } = require("../data/reserva");

const router = express.Router();

// GET /api/reserva: reserva activa del usuario, su saldo y el total
router.get("/", (req, res) => {
  res.json({
    saldo: reserva.saldo,
    itemsReservados: reserva.itemsReservados,
    total: calcularTotal(),
    expiraEn: reserva.expiraEn,
  });
});

module.exports = router;
