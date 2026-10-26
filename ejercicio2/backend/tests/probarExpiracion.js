
const BASE = "http://localhost:3002/api";

// Reloj virtual: no necesitamos esperar cinco minutos reales.
const relojReal = Date.now;
let tiempo = relojReal();

Date.now = () => tiempo;

const CINCO_MINUTOS = 5 * 60 * 1000;

let correctas = 0;
let fallidas = 0;

// Iniciamos el backend dentro del mismo proceso
// para que comparta nuestro reloj simulado.
require("../server");

async function peticion(ruta, metodo = "GET", datos) {
  const respuesta = await fetch(BASE + ruta, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    ...(datos !== undefined && {
      body: JSON.stringify(datos)
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

function avanzar(segundos) {
  tiempo += segundos * 1000;
}

async function ejecutar() {
  const inicio = await peticion("/reserva");

  verificar(
    "Reserva inicial vacía",
    inicio.datos.itemsReservados.length === 0 &&
    inicio.datos.expiraEn === null
  );

  // PRUEBA 1: primera reserva
  const primero = await peticion(
    "/reserva/agregar", "POST",
    { alimentoId: 101, cantidad: 2 }
  );

  const vencimientoOriginal = primero.datos.reserva.expiraEn;

  verificar(
    "Primera reserva inicia los 5 minutos",
    primero.status === 201 &&
    vencimientoOriginal === tiempo + CINCO_MINUTOS
  );

  // PRUEBA 2: agregar otro alimento después de 60 segundos
  avanzar(60);

  const segundo = await peticion(
    "/reserva/agregar", "POST",
    { alimentoId: 102, cantidad: 1 }
  );

  verificar(
    "Agregar otro plato no reinicia el tiempo",
    segundo.status === 201 &&
    segundo.datos.reserva.expiraEn === vencimientoOriginal
  );

  // PRUEBA 3: aumentar cantidad
  avanzar(30);

  const aumentar = await peticion(
    "/reserva/actualizar-porciones/101",
    "PUT",
    { cantidad: 3 }
  );

  verificar(
    "Aumentar porciones conserva el vencimiento",
    aumentar.status === 200 &&
    aumentar.datos.reserva.expiraEn === vencimientoOriginal
  );

  // PRUEBA 4: disminuir cantidad
  avanzar(30);

  const disminuir = await peticion(
    "/reserva/actualizar-porciones/101",
    "PUT",
    { cantidad: 2 }
  );

  verificar(
    "Disminuir porciones conserva el vencimiento",
    disminuir.status === 200 &&
    disminuir.datos.reserva.expiraEn === vencimientoOriginal
  );

  // PRUEBA 5: eliminar parcialmente
  const eliminarPasta = await peticion(
    "/reserva/eliminar/102", "DELETE"
  );

  verificar(
    "Eliminar parcialmente conserva el tiempo",
    eliminarPasta.status === 200 &&
    eliminarPasta.datos.reserva.itemsReservados.length === 1 &&
    eliminarPasta.datos.reserva.expiraEn === vencimientoOriginal
  );

  // PRUEBA 6: eliminar el último producto
  const eliminarPollo = await peticion(
    "/reserva/eliminar/101", "DELETE"
  );

  verificar(
    "Eliminar último plato reinicia vencimiento",
    eliminarPollo.status === 200 &&
    eliminarPollo.datos.reserva.itemsReservados.length === 0 &&
    eliminarPollo.datos.reserva.expiraEn === null
  );

  // PRUEBA 7: crear una reserva nueva
  avanzar(10);

  const nueva = await peticion(
    "/reserva/agregar", "POST",
    { alimentoId: 101, cantidad: 2 }
  );

  verificar(
    "Nueva reserva obtiene nuevo vencimiento",
    nueva.status === 201 &&
    nueva.datos.reserva.expiraEn === tiempo + CINCO_MINUTOS
  );

  // PRUEBA 8: todavía no debe expirar
  avanzar(299);

  const antes = await peticion("/reserva");

  verificar(
    "La reserva sigue activa antes de los 5 minutos",
    antes.datos.itemsReservados.length === 1 &&
    antes.datos.total === 11
  );

  // PRUEBA 9: vencimiento exacto
  avanzar(1);

  const menuVencido = await peticion("/menu");
  const pollo = menuVencido.datos.find(p => p.id === 101);

  verificar(
    "Al vencimiento exacto devuelve el stock",
    pollo.stock === 12
  );

  const vencida = await peticion("/reserva");

  verificar(
    "Reserva vencida queda vacía",
    vencida.datos.itemsReservados.length === 0 &&
    vencida.datos.total === 0 &&
    vencida.datos.expiraEn === null
  );

  // PRUEBA 10: no duplicar devoluciones
  const menuOtraVez = await peticion("/menu");

  verificar(
    "Consultar repetidamente no duplica stock",
    menuOtraVez.datos.find(p => p.id === 101).stock === 12
  );

  // PRUEBA 11: PUT después de vencimiento
  const putVencido = await peticion(
    "/reserva/actualizar-porciones/101",
    "PUT",
    { cantidad: 3 }
  );

  verificar(
    "PUT de reserva vencida devuelve 404",
    putVencido.status === 404
  );

  // PRUEBA 12: nuevo POST después del vencimiento
  const reiniciar = await peticion(
    "/reserva/agregar", "POST",
    { alimentoId: 101, cantidad: 1 }
  );

  verificar(
    "POST permite iniciar una reserva nueva",
    reiniciar.status === 201 &&
    reiniciar.datos.reserva.total === 5.5 &&
    reiniciar.datos.reserva.expiraEn === tiempo + CINCO_MINUTOS
  );

  // PRUEBA 13: expiración directamente con PUT
  avanzar(301);

  const putExpirado = await peticion(
    "/reserva/actualizar-porciones/101",
    "PUT",
    { cantidad: 2 }
  );

  const menuRestaurado = await peticion("/menu");

  verificar(
    "PUT vencido limpia reserva y devuelve stock",
    putExpirado.status === 404 &&
    menuRestaurado.datos.find(p => p.id === 101).stock === 12
  );

  // PRUEBA 14: POST sobre una reserva que acaba de vencer
  const tercera = await peticion(
    "/reserva/agregar", "POST",
    { alimentoId: 102, cantidad: 1 }
  );

  avanzar(301);

  const postTrasExpirar = await peticion(
    "/reserva/agregar", "POST",
    { alimentoId: 101, cantidad: 1 }
  );

  const menuFinal = await peticion("/menu");

  verificar(
    "POST limpia reserva vencida antes de agregar",
    tercera.status === 201 &&
    postTrasExpirar.status === 201 &&
    postTrasExpirar.datos.reserva.itemsReservados.length === 1 &&
    postTrasExpirar.datos.reserva.itemsReservados[0].id === 101 &&
    menuFinal.datos.find(p => p.id === 102).stock === 8 &&
    menuFinal.datos.find(p => p.id === 101).stock === 11
  );

  console.log("\n========== RESULTADOS ==========");
  console.log(`Correctas: ${correctas}`);
  console.log(`Fallidas: ${fallidas}`);

  if (fallidas > 0) process.exitCode = 1;
}

ejecutar()
  .catch(error => {
    console.error("Error en las pruebas:", error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    Date.now = relojReal;
    process.exit();
  });
