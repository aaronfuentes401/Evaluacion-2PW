import { useState } from 'react'
import logoAdivina from './assets/logo-adivina.svg'
import './App.css'

const API_URL = 'http://localhost:3001'

async function solicitar(path, method, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.mensaje)
  }
  return data
}

function App() {
  const [numero, setNumero] = useState('')
  const [intentos, setIntentos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [gano, setGano] = useState(false)
  const [cargando, setCargando] = useState(false)

  async function enviarIntento(event) {
    event.preventDefault()
    setMensaje('')
    setCargando(true)

    try {
      const data = await solicitar('/guess', 'POST', {
        numero: Number(numero),
      })
      const resultado = data.resultado

      if (!['mayor', 'menor', 'correcto'].includes(resultado)) {
        throw new Error('El servidor devolvió una respuesta inesperada.')
      }

      setIntentos((anteriores) => [
        ...anteriores,
        { numero: Number(numero), resultado },
      ])
      setMensaje(
        resultado === 'correcto'
          ? '¡Correcto! Adivinaste el número.'
          : `El número secreto es ${resultado}.`,
      )
      setGano(resultado === 'correcto')
      setNumero('')
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  async function jugarDeNuevo() {
    setMensaje('')
    setCargando(true)

    try {
      await solicitar('/reset', 'POST')
      setNumero('')
      setIntentos([])
      setGano(false)
      setMensaje('Se inició una nueva partida. ¡Suerte!')
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="game">
      <header className="game__header">
        <div className="game__title">
          <img className="game__logo" src={logoAdivina} alt="Logo de Adivina el número" />
          <h1>Adivina el número</h1>
        </div>
        <p>Estoy pensando en un número del 1 al 100.</p>
      </header>

      <section className="game__panel" aria-labelledby="guess-heading">
        <h2 id="guess-heading">Tu intento</h2>
        <form className="guess-form" onSubmit={enviarIntento}>
          <label className="visually-hidden" htmlFor="numero">Número</label>
          <div className="guess-form__controls">
            <input
              id="numero"
              type="number"
              min="1"
              max="100"
              step="1"
              required
              value={numero}
              onChange={(event) => setNumero(event.target.value)}
              disabled={gano || cargando}
            />
            <button type="submit" disabled={gano || cargando}>
              {cargando ? 'Cargando...' : 'Enviar intento'}
            </button>
          </div>
        </form>

        {mensaje && (
          <p className="game__message" role="status">
            {mensaje}
          </p>
        )}

        {gano && (
          <button
            className="game__reset"
            type="button"
            onClick={jugarDeNuevo}
            disabled={cargando}
          >
            Jugar de nuevo
          </button>
        )}
      </section>

      <section className="game__history" aria-labelledby="history-heading">
        <h2 id="history-heading">Historial de intentos</h2>
        {intentos.length === 0 ? (
          <p>Aún no has realizado intentos.</p>
        ) : (
          <ul>
            {intentos.map((intento, index) => (
              <li key={`${index}-${intento.numero}`}>
                <strong>Intento {index + 1}:</strong>{' '}
                <strong>{intento.numero}</strong>{' '}
                {intento.resultado === 'correcto'
                  ? '¡Correcto! Adivinaste el número.'
                  : `El número secreto es ${intento.resultado}.`}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
