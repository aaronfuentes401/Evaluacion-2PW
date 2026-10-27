const API_URL = 'http://localhost:3002/api'

async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
  })

  const data = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(data.mensaje || 'No se pudo completar la petición.')
  }

  return data
}

export function obtenerMenu() {
  return solicitar('/menu')
}

export function obtenerReserva() {
  return solicitar('/reserva')
}

export async function obtenerDatos() {
  const menu = await obtenerMenu()
  const reserva = await obtenerReserva()
  return { menu, reserva }
}

export function agregarAlimento(alimentoId, cantidad = 1) {
  return solicitar('/reserva/agregar', {
    method: 'POST',
    body: JSON.stringify({ alimentoId, cantidad }),
  })
}

export function actualizarPorciones(id, cantidad) {
  return solicitar(`/reserva/actualizar-porciones/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ cantidad }),
  })
}

export function eliminarAlimento(id) {
  return solicitar(`/reserva/eliminar/${id}`, {
    method: 'DELETE',
  })
}

export function confirmarReserva() {
  return solicitar('/reserva/confirmar', {
    method: 'POST',
  })
}
