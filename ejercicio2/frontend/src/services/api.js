const BASE_URL = 'http://localhost:3002'

function procesarRespuesta(res) {
  return res.json().then((data) => {
    if (!res.ok) {
      throw new Error(data.mensaje)
    }

    return data
  })
}

export function obtenerMenu() {
  return fetch(`${BASE_URL}/api/menu`)
    .then(procesarRespuesta)
    .catch((error) => Promise.reject(error))
}

export function obtenerReserva() {
  return fetch(`${BASE_URL}/api/reserva`)
    .then(procesarRespuesta)
    .catch((error) => Promise.reject(error))
}

export function agregarAlimento(alimentoId, cantidad) {
  return fetch(`${BASE_URL}/api/reserva/agregar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alimentoId, cantidad }),
  })
    .then(procesarRespuesta)
    .catch((error) => Promise.reject(error))
}

export function actualizarPorciones(id, cantidad) {
  return fetch(`${BASE_URL}/api/reserva/actualizar-porciones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad }),
  })
    .then(procesarRespuesta)
    .catch((error) => Promise.reject(error))
}

export function eliminarAlimento(id) {
  return fetch(`${BASE_URL}/api/reserva/eliminar/${id}`, {
    method: 'DELETE',
  })
    .then(procesarRespuesta)
    .catch((error) => Promise.reject(error))
}

export function confirmarReserva() {
  return fetch(`${BASE_URL}/api/reserva/confirmar`, {
    method: 'POST',
  })
    .then(procesarRespuesta)
    .catch((error) => Promise.reject(error))
}
