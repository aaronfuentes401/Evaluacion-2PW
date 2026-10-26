import { useEffect, useState } from 'react'
import { UncontrolledAlert } from 'reactstrap'
import {
  agregarAlimento,
  actualizarPorciones,
  eliminarAlimento,
  obtenerMenu,
  obtenerReserva,
} from './services/api'

function cargarDatos(setMenu, setReserva) {
  return Promise.all([obtenerMenu(), obtenerReserva()]).then(
    ([datosMenu, datosReserva]) => {
      setMenu(datosMenu)
      setReserva(datosReserva)
    },
  )
}

function App() {
  const [menu, setMenu] = useState([])
  const [reserva, setReserva] = useState({
    saldo: 0,
    itemsReservados: [],
    total: 0,
    expiraEn: null,
  })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setCargando(true)
    cargarDatos(setMenu, setReserva)
      .catch((error) => setError(error.message))
      .finally(() => setCargando(false))
  }, [])

  function ejecutarAccion(peticion) {
    setCargando(true)
    setError('')

    return peticion
      .then(() => cargarDatos(setMenu, setReserva))
      .catch((error) => setError(error.message))
      .finally(() => setCargando(false))
  }

  function agregar(alimentoId, cantidad = 1) {
    return ejecutarAccion(agregarAlimento(alimentoId, cantidad))
  }

  function cambiarCantidad(id, cantidad) {
    return ejecutarAccion(actualizarPorciones(id, cantidad))
  }

  function quitar(id) {
    return ejecutarAccion(eliminarAlimento(id))
  }

  return (
    <main className="container py-4">
      {error && <UncontrolledAlert color="warning">{error}</UncontrolledAlert>}
      {cargando && <p>Cargando...</p>}
    </main>
  )
}

export default App
