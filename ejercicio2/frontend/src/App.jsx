import { useEffect, useRef, useState } from 'react'
import { Alert, Badge, Button, Col, Row, UncontrolledAlert } from 'reactstrap'
import BandejaReserva from './components/BandejaReserva'
import MenuDelDia from './components/MenuDelDia'
import {
  agregarAlimento,
  actualizarPorciones,
  confirmarReserva,
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
  const [tiempoRestante, setTiempoRestante] = useState(null)
  const [reservaExpirada, setReservaExpirada] = useState(false)
  const expiracionProcesada = useRef(null)

  useEffect(() => {
    setCargando(true)
    cargarDatos(setMenu, setReserva)
      .catch((error) => setError(error.message))
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    if (!reserva.expiraEn) {
      setTiempoRestante(null)
      expiracionProcesada.current = null
      return
    }

    function actualizarContador() {
      const segundos = Math.max(
        0,
        Math.ceil((reserva.expiraEn - Date.now()) / 1000),
      )
      setTiempoRestante(segundos)

      if (segundos === 0) {
        if (expiracionProcesada.current !== reserva.expiraEn) {
          expiracionProcesada.current = reserva.expiraEn
          setReservaExpirada(true)
          setCargando(true)
          cargarDatos(setMenu, setReserva)
            .catch((error) => setError(error.message))
            .finally(() => setCargando(false))
        }

        return true
      }

      return false
    }

    if (actualizarContador()) {
      return undefined
    }

    const intervalo = setInterval(() => {
      if (actualizarContador()) {
        clearInterval(intervalo)
      }
    }, 1000)

    return () => clearInterval(intervalo)
  }, [reserva.expiraEn])

  function ejecutarAccion(peticion) {
    setCargando(true)
    setError('')

    return peticion
      .then(() => cargarDatos(setMenu, setReserva))
      .catch((error) => setError(error.message))
      .finally(() => setCargando(false))
  }

  function agregar(alimentoId, cantidad = 1) {
    setReservaExpirada(false)
    return ejecutarAccion(agregarAlimento(alimentoId, cantidad))
  }

  function cambiarCantidad(id, cantidad) {
    return ejecutarAccion(actualizarPorciones(id, cantidad))
  }

  function quitar(id) {
    return ejecutarAccion(eliminarAlimento(id))
  }

  function confirmar() {
    return ejecutarAccion(confirmarReserva())
  }

  const saldoDisponible = reserva.saldo - reserva.total
  const minutos = Math.floor((tiempoRestante || 0) / 60)
  const segundos = (tiempoRestante || 0) % 60

  return (
    <main className="container py-4">
      {error && <UncontrolledAlert color="warning">{error}</UncontrolledAlert>}
      <Alert color="info" className="d-flex justify-content-between">
        <span>Tu saldo actual: ${saldoDisponible.toFixed(2)}</span>
        <span>
          Total de tu Reserva{' '}
          <Badge color="dark" pill>${reserva.total.toFixed(2)}</Badge>
        </span>
      </Alert>

      {reservaExpirada && (
        <Alert color="warning">Tu reserva expiró, iníciala nuevamente</Alert>
      )}
      {tiempoRestante > 0 && (
        <p>
          Tiempo restante: {String(minutos).padStart(2, '0')}:
          {String(segundos).padStart(2, '0')}
        </p>
      )}
      {cargando && <p>Cargando...</p>}

      <Row>
        <Col xs="12" md="6">
          <MenuDelDia menu={menu} onAgregar={agregar} cargando={cargando} />
        </Col>
        <Col xs="12" md="6">
          <BandejaReserva
            items={reserva.itemsReservados}
            menu={menu}
            onCambiarCantidad={cambiarCantidad}
            onQuitar={quitar}
            cargando={cargando}
          />
          {reserva.itemsReservados.length > 0 && (
            <Button
              color="primary"
              className="mt-3"
              onClick={confirmar}
              disabled={cargando}
            >
              Confirmar reserva
            </Button>
          )}
        </Col>
      </Row>
    </main>
  )
}

export default App
