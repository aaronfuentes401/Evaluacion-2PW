
const BASE = "http://localhost:3002/api";

let correctas = 0;
let fallidas = 0;

async function peticion(ruta, metodo = "GET", body) {
  const respuesta = await fetch(BASE + ruta, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined && {
      body: JSON.stringify(body)
    })
  });

  return {
    status: respuesta.status,
    datos: await respuesta.json()
  };
}

function verificar(nombre, condicion) {
  if (condicion) {
    correctas++;
    console.log("✅", nombre);
  } else {
    fallidas++;
    console.log("❌", nombre);
  }
}

function obtenerStock(menu, id) {
  return menu.find(p => p.id === id)?.stock;
}

async function ejecutar() {
  const menuInicial = (await peticion("/menu")).datos;
  const reservaInicial = (await peticion("/reserva")).datos;

  if (
    reservaInicial.itemsReservados.length !== 0 ||
    obtenerStock(menuInicial, 101) !== 12 ||
    obtenerStock(menuInicial, 102) !== 8
  ) {
    console.log("Reiniciá el servidor antes de ejecutar estas pruebas.");
    return;
  }

  // 1. Reservar dos pollos
  const pollo = await peticion(
    "/reserva/agregar", "POST",
    { alimentoId: 101, cantidad: 2 }
  );

  // 2. Reservar dos pastas
  const pasta = await peticion(
    "/reserva/agregar", "POST",
    { alimentoId: 102, cantidad: 2 }
  );

  verificar(
    "Reservar dos alimentos diferentes",
    pollo.status === 201 &&
    pasta.status === 201 &&
    pasta.datos.reserva.itemsReservados.length === 2 &&
    pasta.datos.reserva.total === 20.5
  );

  // 3. Reducir los pollos de 2 a 1
  const reducirPollo = await peticion(
    "/reserva/actualizar-porciones/101",
    "PUT",
    { cantidad: 1 }
  );

  const reservaReducida = reducirPollo.datos.reserva;

  verificar(
    "Modificar pollo sin afectar pasta",
    reducirPollo.status === 200 &&
    reservaReducida.itemsReservados.find(p => p.id === 101)?.cantidad === 1 &&
    reservaReducida.itemsReservados.find(p => p.id === 102)?.cantidad === 2 &&
    reservaReducida.total === 15
  );

  // 4. Eliminar pasta
  const eliminarPasta = await peticion(
    "/reserva/eliminar/102", "DELETE"
  );

  const menuTrasEliminar = (await peticion("/menu")).datos;

  verificar(
    "Eliminar pasta sin afectar pollo",
    eliminarPasta.status === 200 &&
    eliminarPasta.datos.reserva.itemsReservados.length === 1 &&
    eliminarPasta.datos.reserva.itemsReservados[0].id === 101 &&
    obtenerStock(menuTrasEliminar, 101) === 11 &&
    obtenerStock(menuTrasEliminar, 102) === 8
  );

  // 5. PUT negativo
  const negativo = await peticion(
    "/reserva/actualizar-porciones/101",
    "PUT",
    { cantidad: -2 }
  );

  verificar("PUT rechaza negativos", negativo.status === 400);

  // 6. PUT decimal
  const decimal = await peticion(
    "/reserva/actualizar-porciones/101",
    "PUT",
    { cantidad: 2.5 }
  );

  verificar("PUT rechaza decimales", decimal.status === 400);

  // 7. PUT alimento que no está reservado
  const inexistente = await peticion(
    "/reserva/actualizar-porciones/999",
    "PUT",
    { cantidad: 2 }
  );

  verificar("PUT devuelve 404", inexistente.status === 404);

  // 8. PUT que excede stock
  const sinStock = await peticion(
    "/reserva/actualizar-porciones/101",
    "PUT",
    { cantidad: 100 }
  );

  verificar(
    "PUT rechaza stock insuficiente",
    sinStock.status === 400 &&
    sinStock.datos.mensaje === "Stock insuficiente"
  );

  // 9. PUT que excede saldo pero no stock
  const sinSaldo = await peticion(
    "/reserva/actualizar-porciones/101",
    "PUT",
    { cantidad: 5 }
  );

  verificar(
    "PUT rechaza saldo insuficiente",
    sinSaldo.status === 400 &&
    sinSaldo.datos.mensaje ===
      "Saldo insuficiente para esta cantidad"
  );

  // 10. Estado inalterado tras errores
  const estado = (await peticion("/reserva")).datos;
  const inventario = (await peticion("/menu")).datos;

  verificar(
    "Los errores no modifican los datos",
    estado.itemsReservados.length === 1 &&
    estado.itemsReservados[0].cantidad === 1 &&
    estado.total === 5.5 &&
    obtenerStock(inventario, 101) === 11 &&
    obtenerStock(inventario, 102) === 8
  );

  // 11. DELETE final para limpiar
  const limpiar = await peticion(
    "/reserva/eliminar/101", "DELETE"
  );

  const menuFinal = (await peticion("/menu")).datos;

  verificar(
    "Inventario restaurado al terminar",
    limpiar.status === 200 &&
    obtenerStock(menuFinal, 101) === 12 &&
    obtenerStock(menuFinal, 102) === 8
  );

  const agregarParaConfirmar = await peticion(
    "/reserva/agregar", "POST",
    { alimentoId: 101, cantidad: 1 }
  );
  const confirmar = await peticion("/reserva/confirmar", "POST");
  const reservaConfirmada = (await peticion("/reserva")).datos;
  const menuConfirmado = (await peticion("/menu")).datos;

  verificar(
    "Confirmar descuenta el saldo y conserva el stock reservado",
    agregarParaConfirmar.status === 201 &&
    confirmar.status === 200 &&
    reservaConfirmada.saldo === 19.5 &&
    reservaConfirmada.itemsReservados.length === 0 &&
    reservaConfirmada.total === 0 &&
    reservaConfirmada.expiraEn === null &&
    obtenerStock(menuConfirmado, 101) === 11
  );

  console.log("\nRESULTADOS");
  console.log(`Correctas: ${correctas}`);
  console.log(`Fallidas: ${fallidas}`);

  if (fallidas > 0) process.exitCode = 1;
}

ejecutar().catch(error => {
  console.error("Error al ejecutar pruebas:", error);
  process.exitCode = 1;
});
