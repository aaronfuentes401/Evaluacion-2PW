# Ejercicio 1: Adivina el número

Frontend de React para el juego del número secreto. El backend debe ejecutarse
en `http://localhost:3001` y exponer estos endpoints:

- `POST /guess`, con JSON `{ "numero": 42 }`. Debe responder con uno de estos
  valores: `{ "resultado": "mayor" }`, `{ "resultado": "menor" }` o
  `{ "resultado": "correcto" }`. `mayor` indica que el número secreto es mayor
  que el intento.
- `POST /reset`, que genera un número secreto nuevo y responde con JSON.

Los intentos válidos se guardan en el estado del juego; al ganar, el formulario
se bloquea y se puede iniciar otra partida con **Jugar de nuevo**.

## Ejecutar

En una terminal, desde esta carpeta:

```sh
npm ci
npm run dev
```
