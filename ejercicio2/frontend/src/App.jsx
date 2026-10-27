import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  UncontrolledAlert,
} from 'reactstrap'
import BandejaReserva from './components/BandejaReserva.jsx'
import MenuDelDia from './components/MenuDelDia.jsx'
import {
  actualizarPorciones,
  agregarAlimento,
  confirmarReserva,
  eliminarAlimento,
  obtenerDatos,
} from './services/api.js'
import './App.css'

function App() {
  const [menu, setMenu] = useState([])
  const [reserva, setReserva] = useState({
    saldo: 0,
    itemsReservados: [],
    total: 0,
    expiraEn: null,
  })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [segundosRestantes, setSegundosRestantes] = useState(null)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const datos = await obtenerDatos()
        setMenu(datos.menu)
        setReserva(datos.reserva)
      } catch (errorCarga) {
        setError(errorCarga.message)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  useEffect(() => {
    if (!reserva.expiraEn) {
      return undefined
    }

    const actualizarContador = () => {
      const restantes = Math.max(
        0,
        Math.ceil((reserva.expiraEn - Date.now()) / 1000),
      )
      setSegundosRestantes(restantes)

      if (restantes === 0) {
        clearInterval(intervalo)
        obtenerDatos()
          .then((datos) => {
            setMenu(datos.menu)
            setReserva(datos.reserva)
            setError('Tu reserva expiró, iníciala nuevamente.')
          })
          .catch((errorCarga) => setError(errorCarga.message))
      }
    }

    const intervalo = setInterval(actualizarContador, 1000)
    actualizarContador()

    return () => clearInterval(intervalo)
  }, [reserva.expiraEn])

  async function ejecutarAccion(accion, mensajeExito = '') {
    setCargando(true)
    setError('')
    setMensaje('')

    try {
      await accion()
      const datos = await obtenerDatos()
      setMenu(datos.menu)
      setReserva(datos.reserva)
      setMensaje(mensajeExito)
    } catch (errorAccion) {
      setError(errorAccion.message)
    } finally {
      setCargando(false)
    }
  }

  function manejarAgregar(id) {
    return ejecutarAccion(() => agregarAlimento(id))
  }

  function manejarCambioCantidad(id, cantidad) {
    return ejecutarAccion(() => actualizarPorciones(id, cantidad))
  }

  function manejarQuitar(id) {
    return ejecutarAccion(() => eliminarAlimento(id))
  }

  function manejarConfirmar() {
    return ejecutarAccion(
      confirmarReserva,
      'Tu reserva fue confirmada. ¡Buen provecho!',
    )
  }

  const saldoDisponible = Math.max(0, reserva.saldo - reserva.total)
  const segundosActuales = reserva.expiraEn ? segundosRestantes : null
  const minutos = Math.floor((segundosActuales || 0) / 60)
  const segundos = (segundosActuales || 0) % 60

  return (
    <Container className="food-app py-4 py-md-5">
      <header className="food-app__header mb-4">
        <p className="food-app__eyebrow mb-1">Food DEI S.A. de R.L.</p>
        <h1 className="mb-1">Menú del día</h1>
        <p className="text-muted mb-0">
          Elige tu almuerzo para el día de hoy.
        </p>
      </header>

      <Alert color="info" className="d-flex flex-wrap justify-content-between gap-2">
        <span>
          Saldo disponible: <strong>${saldoDisponible.toFixed(2)}</strong>
        </span>
        <span className="food-app__total">
          Total de tu reserva:{' '}
          <Badge color="dark" pill>
            ${reserva.total.toFixed(2)}
          </Badge>
        </span>
        {segundosActuales !== null && (
          <span>
            Tiempo restante:{' '}
            <strong>{minutos}:{String(segundos).padStart(2, '0')}</strong>
          </span>
        )}
      </Alert>

      {error && (
        <UncontrolledAlert color="warning" className="mb-4">
          {error}
        </UncontrolledAlert>
      )}

      {mensaje && <Alert color="success">{mensaje}</Alert>}

      {cargando && <p role="status">Cargando...</p>}

      <Row className="g-4">
        <Col xs="12" lg="8">
          <section aria-labelledby="menu-heading">
            <h2 id="menu-heading" className="h4 mb-3">Platos disponibles</h2>
            <MenuDelDia
              menu={menu}
              onAgregar={manejarAgregar}
              cargando={cargando}
            />
          </section>
        </Col>
        <Col xs="12" lg="4">
          <Card>
            <CardBody>
              <h2 className="h4 mb-3">Tu reserva</h2>
              <BandejaReserva
                items={reserva.itemsReservados}
                menu={menu}
                onCambiarCantidad={manejarCambioCantidad}
                onQuitar={manejarQuitar}
                cargando={cargando}
              />
              <Button
                className="w-100 mt-3"
                color="success"
                disabled={cargando || reserva.itemsReservados.length === 0}
                onClick={manejarConfirmar}
              >
                Confirmar reserva
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default App
