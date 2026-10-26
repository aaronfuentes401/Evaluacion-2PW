const express = require("express");
const { reserva, calcularTotal } = require("../data/reserva");
const menu = require("../data/menu");

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


router.post("/agregar", (req, res) => {
  const { alimentoId, cantidad } = req.body || {};

  // 1. Buscar el alimento
  const plato = menu.find((p) => p.id === alimentoId);

  if (!plato) {
    return res.status(404).json({
      mensaje: "Alimento no encontrado"
    });
  }

  // 2. Validar cantidad
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({
      mensaje: "La cantidad debe ser un entero positivo"
    });
  }

  // 3. Comprobar stock
  if (plato.stock < cantidad) {
    return res.status(400).json({
      mensaje: "Stock insuficiente"
    });
  }

  // 4. Comprobar saldo
  const nuevoTotal = calcularTotal() + plato.precio * cantidad;

  if (nuevoTotal > reserva.saldo + 0.000001) {
    return res.status(400).json({
      mensaje: "Saldo insuficiente para esta cantidad"
    });
  }

  // 5. Comprobar si ya está reservado
  const item = reserva.itemsReservados.find(
    (item) => item.id === alimentoId
  );

  if (item) {
    item.cantidad += cantidad;
  } else {
    reserva.itemsReservados.push({
      id: alimentoId,
      cantidad
    });
  }

  // 6. Descontar inventario
  plato.stock -= cantidad;

  // 7. Iniciar tiempo de reserva
  if (reserva.expiraEn === null) {
    reserva.expiraEn = Date.now() + 5 * 60 * 1000;
  }

  // 8. Responder al frontend
  return res.status(201).json({
    mensaje: "Alimento agregado correctamente",
    reserva: {
      saldo: reserva.saldo,
      itemsReservados: reserva.itemsReservados,
      total: calcularTotal(),
      expiraEn: reserva.expiraEn
    }
  });
});




router.put("/actualizar-porciones/:id", (req, res) => {
  const id = Number(req.params.id);
  const { cantidad } = req.body || {};

  // 1. Validar la nueva cantidad
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return res.status(400).json({
      mensaje: "La cantidad debe ser un entero positivo"
    });
  }

  // 2. Buscar el alimento dentro de la reserva
  const item = reserva.itemsReservados.find(
    (item) => item.id === id
  );

  if (!item) {
    return res.status(404).json({
      mensaje: "El alimento no está en la reserva"
    });
  }

  // 3. Buscar el alimento en el inventario
  const plato = menu.find((p) => p.id === id);

  if (!plato) {
    return res.status(404).json({
      mensaje: "Alimento no encontrado"
    });
  }

  // 4. Calcular cuántas porciones cambian
  const diferencia = cantidad - item.cantidad;

  // 5. Comprobar disponibilidad
  if (diferencia > plato.stock) {
    return res.status(400).json({
      mensaje: "Stock insuficiente"
    });
  }

  // 6. Validar el nuevo total
  const nuevoTotal = calcularTotal() + diferencia * plato.precio;

  if (nuevoTotal > reserva.saldo + 0.000001) {
    return res.status(400).json({
      mensaje: "Saldo insuficiente para esta cantidad"
    });
  }

  // 7. Actualizar inventario y cantidad reservada
  plato.stock -= diferencia;
  item.cantidad = cantidad;

  // 8. Responder al frontend
  return res.status(200).json({
    mensaje: "Porciones actualizadas correctamente",
    reserva: {
      saldo: reserva.saldo,
      itemsReservados: reserva.itemsReservados,
      total: calcularTotal(),
      expiraEn: reserva.expiraEn
    }
  });
});




router.delete("/eliminar/:id", (req, res) => {
  const id = Number(req.params.id);

  // 1. Validar el ID
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensaje: "ID de alimento inválido"
    });
  }

  // 2. Buscar el alimento reservado
  const item = reserva.itemsReservados.find(
    (item) => item.id === id
  );

  if (!item) {
    return res.status(404).json({
      mensaje: "El alimento no está en la reserva"
    });
  }

  // 3. Buscar el alimento en el inventario
  const plato = menu.find((p) => p.id === id);

  if (!plato) {
    return res.status(404).json({
      mensaje: "Alimento no encontrado"
    });
  }

  // 4. Devolver las porciones al inventario
  plato.stock += item.cantidad;

  // 5. Quitar el alimento de la reserva
  reserva.itemsReservados = reserva.itemsReservados.filter(
    (item) => item.id !== id
  );

  // 6. Limpiar el vencimiento si la reserva quedó vacía
  if (reserva.itemsReservados.length === 0) {
    reserva.expiraEn = null;
  }

  // 7. Responder al frontend
  return res.status(200).json({
    mensaje: "Alimento eliminado correctamente",
    reserva: {
      saldo: reserva.saldo,
      itemsReservados: reserva.itemsReservados,
      total: calcularTotal(),
      expiraEn: reserva.expiraEn
    }
  });
});






module.exports = router;
