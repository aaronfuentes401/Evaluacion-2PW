# Ejercicio 2: Frontend Food DEI

Este frontend usa React, Reactstrap y Bootstrap. El backend debe ejecutarse en
`http://localhost:3002`. Los componentes del catálogo y la bandeja están en
`src/components/`:

- `MenuDelDia` recibe `menu`, `onAgregar` y `cargando`. Al pulsar **Añadir a la
  Reserva**, invoca `onAgregar(idDelPlato)`. Si el stock es cero, muestra
  **Agotado** y deshabilita el botón.
- `BandejaReserva` recibe `items`, `menu`, `onCambiarCantidad`, `onQuitar` y
  `cargando`. Invoca `onCambiarCantidad(idDelPlato, nuevaCantidad)` al usar
  `−`/`+`, y `onQuitar(idDelPlato)` al quitarlo. `items` contiene elementos
  `{ id, cantidad }`.

Los handlers pertenecen a `App.jsx`: deben llamar a los endpoints de reserva y,
cuando la petición finalice correctamente, actualizar/cargar nuevamente el
menú y la reserva. El componente recibe `cargando` para bloquear acciones
mientras esas peticiones están en curso.

La reserva puede confirmarse con el botón **Confirmar reserva**. Al confirmarla,
el backend descuenta su total del saldo, vacía la bandeja y conserva el stock
reservado. La reserva sin confirmar vence a los cinco minutos; el backend libera
el stock y la interfaz avisa que se debe iniciar otra vez.

## Ejecutar

En una terminal, desde esta carpeta:

```sh
npm ci
npm run dev
```
