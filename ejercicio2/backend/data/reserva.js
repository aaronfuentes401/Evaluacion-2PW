const menu = require("./menu");

// Estado de la reserva del usuario (en memoria).
// itemsReservados solo guarda { id, cantidad }; el nombre y el precio salen del menú.
const reserva = {
  saldo: 25.0,
  itemsReservados: [],
  expiraEn: null,
};

// Suma precio * cantidad de cada plato reservado
function calcularTotal() {
  const total = reserva.itemsReservados.reduce((suma, item) => {
    const plato = menu.find((p) => p.id === item.id);
    return plato ? suma + plato.precio * item.cantidad : suma;
  }, 0);

  return Number(total.toFixed(2));
}

module.exports = { reserva, calcularTotal };
