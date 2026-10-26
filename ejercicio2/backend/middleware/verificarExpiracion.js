
const menu = require("../data/menu");
const { reserva } = require("../data/reserva");

function verificarExpiracion(req, res, next) {
  if (reserva.expiraEn !== null && Date.now() >= reserva.expiraEn) {

    // Devolver los platos reservados al inventario
    for (const item of reserva.itemsReservados) {
      const plato = menu.find((p) => p.id === item.id);

      if (plato) {
        plato.stock += item.cantidad;
      }
    }

    // Vaciar la reserva y reiniciar vencimiento
    reserva.itemsReservados = [];
    reserva.expiraEn = null;
  }

  next();
}

module.exports = verificarExpiracion;
