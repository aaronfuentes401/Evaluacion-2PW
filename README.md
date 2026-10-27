# Aplicación Web Full Stack - Adivina el Número y Food DEI

## Evaluación II - Programación Web
**Universidad Centroamericana (UCA)**  
**Ciclo 02-2026**

---

## 📋 Equipo de Desarrollo

| Nombre | Carné | Rol |
|--------|-------|-----|
| Amy Ariadna Barraza Villacorta | 00012725 | Front 2: Ejercicio 1 frontend + componentes del Ejercicio 2 |
| Pablo Antonio Brito Elías | 00179025 | Front 1: base del frontend del Ejercicio 2 |
| Diego Gabriel Bonilla Comandari | 00147325 | Back 1: Ejercicio 1 backend + base del backend del Ejercicio 2 |
| Aarón Enmanuel Fuentes Murillo | 00075925 | Back 2: endpoints de reserva y límite de tiempo |

---

## 📌 ¿En Qué Consiste Esta Evaluación?

El proyecto integra un **backend** con **Express.js** y **Node.js** y un **frontend** con **React + Vite**, comunicados mediante una API REST con `fetch` y promesas.

Se desarrollan **dos ejercicios:**
- **Ejercicio 1 - Adivina el Número:** el servidor genera un número secreto del 1 al 100 y el usuario intenta adivinarlo; el servidor responde si el número oculto es mayor, menor o correcto.
- **Ejercicio 2 - Food DEI S.A. de R.L.:** sistema de reservas de almuerzo con inventario limitado de platos, saldo del cliente y un límite de 5 minutos para completar la reserva.

Todo sin base de datos (datos en memoria) para mantenerlo simple y enfocado en la lógica de programación.

---

## 📂 Estructura del Proyecto

```
Evaluacion-2PW/
├── ejercicio1/
│   ├── backend/
│   │   ├── package.json
│   │   └── server.js
│   └── frontend/
│       ├── package.json
│       └── src/
│           ├── App.css
│           ├── App.jsx
│           ├── index.css
│           └── main.jsx
└── ejercicio2/
    ├── backend/
    │   ├── package.json
    │   ├── server.js
    │   ├── data/
    │   │   ├── menu.js
    │   │   └── reserva.js
    │   ├── middleware/
    │   │   └── verificarExpiracion.js
    │   ├── routes/
    │   │   ├── menu.js
    │   │   └── reserva.js
    │   └── tests/
    │       ├── probarCasos2.js
    │       └── probarExpiracion.js
    └── frontend/
        ├── package.json
        └── src/
            ├── App.jsx
            ├── main.jsx
            ├── components/
            │   ├── BandejaReserva.jsx
            │   └── MenuDelDia.jsx
            └── services/
                └── api.js
```

---

## 🎯 Ejercicio 1: Adivina el Número

**Backend:** `http://localhost:3001`

### POST /guess ✅
```
Body: { "numero": 50 }
Response: 200 OK + { resultado: "mayor" | "menor" | "correcto", mensaje }
          400 Bad Request si numero no es un entero entre 1 y 100
```
`"mayor"` significa que el número oculto es mayor que el intento.

### POST /reset ✅
```
Body: (vacío)
Response: 200 OK + { mensaje: "Nuevo número generado" }
```

**Frontend:** formulario con input numérico, historial de intentos con `.map()`, mensaje del servidor, input deshabilitado al ganar y botón "Jugar de nuevo".

---

## 🍽️ Ejercicio 2: Food DEI (5 Endpoints)

**Backend:** `http://localhost:3002`

### ENDPOINT 1: Menú del día ✅
```
GET /api/menu
Response: 200 OK + [{ id, nombre, precio, stock, categoria }]
```

### ENDPOINT 2: Reserva activa ✅
```
GET /api/reserva
Response: 200 OK + { saldo, itemsReservados: [{ id, cantidad }], total, expiraEn }
```

### ENDPOINT 3: Agregar plato ✅
```
POST /api/reserva/agregar
Body: { alimentoId, cantidad }
Response: 201 Created + { mensaje, reserva }
          400 "Stock insuficiente" | "Saldo insuficiente para esta cantidad"
          404 si el plato no existe
```

### ENDPOINT 4: Actualizar porciones ✅
```
PUT /api/reserva/actualizar-porciones/:id
Body: { cantidad }
Response: 200 OK + { mensaje, reserva }
          400 "Saldo insuficiente para esta cantidad" | "Stock insuficiente"
          404 si el plato no está en la reserva
```

### ENDPOINT 5: Eliminar plato ✅
```
DELETE /api/reserva/eliminar/:id
Response: 200 OK + { mensaje, reserva }
          404 si el plato no está en la reserva
```

### EXTRA: Confirmar reserva ✅
```
POST /api/reserva/confirmar
Response: 200 OK + { mensaje, reserva }
          400 si la reserva está vacía
```

**Frontend:** panel superior con saldo y total (`Alert` + `Badge`), menú del día en tarjetas (`Card`), bandeja de reserva (`ListGroup` + `ButtonGroup`), mensaje "Cargando...", errores del backend con `UncontrolledAlert` y contador regresivo de la reserva.

---

## 💾 Modelo de Datos (Ejercicio 2)

```javascript
// Plato del menú
{ "id": 101, "nombre": "Menú Ejecutivo (Pollo)", "precio": 5.50, "stock": 12, "categoria": "Fuerte" }

// Reserva
{ "saldo": 25.00, "itemsReservados": [{ "id": 101, "cantidad": 2 }], "total": 11.00, "expiraEn": null }
```

**Reglas de negocio:**
- Agregar descuenta stock; eliminar lo devuelve; actualizar ajusta el stock según la diferencia.
- El saldo no baja mientras se arma la reserva. La validación es `total <= saldo`.
- `itemsReservados` solo guarda `{ id, cantidad }`; el nombre y el precio salen del menú.
- Al agregar el primer plato la reserva expira en 5 minutos; si expira, se vacía y el stock vuelve al menú.
- Confirmar descuenta el total del saldo, vacía la reserva y deja el stock bloqueado.

---

## 🔧 Instalación y Ejecución

Cada carpeta es un proyecto independiente. Se necesitan **4 terminales**, una por carpeta, desde la raíz del repositorio:

### Terminal 1 - Backend Ejercicio 1
```bash
cd ejercicio1/backend
npm install
npm run dev
```
Disponible en: `http://localhost:3001`

### Terminal 2 - Frontend Ejercicio 1
```bash
cd ejercicio1/frontend
npm install
npm run dev
```
Abrir la URL que muestra Vite (por ejemplo `http://localhost:5173`).

### Terminal 3 - Backend Ejercicio 2
```bash
cd ejercicio2/backend
npm install
npm run dev
```
Disponible en: `http://localhost:3002`

### Terminal 4 - Frontend Ejercicio 2
```bash
cd ejercicio2/frontend
npm install
npm run dev
```
Abrir la URL que muestra Vite (por ejemplo `http://localhost:5174`).

> Cada frontend necesita su backend corriendo. Los datos están en memoria: al reiniciar el backend vuelven al estado inicial (saldo $25.00 y stock original).

---

## 🧪 Pruebas en Postman

Con el backend del Ejercicio 2 corriendo, se recomienda probar en orden:

1. GET /api/menu (Ver los platos y su stock)
2. POST /api/reserva/agregar con `{ "alimentoId": 101, "cantidad": 2 }` (201)
3. POST /api/reserva/agregar con `{ "alimentoId": 105, "cantidad": 1 }` (400 Stock insuficiente)
4. PUT /api/reserva/actualizar-porciones/101 con `{ "cantidad": 5 }` (400 Saldo insuficiente)
5. PUT /api/reserva/actualizar-porciones/101 con `{ "cantidad": 3 }` (200)
6. GET /api/reserva (Ver total y expiraEn)
7. DELETE /api/reserva/eliminar/101 (200, el stock vuelve al menú)
8. DELETE /api/reserva/eliminar/101 (404, ya no está en la reserva)

Para el Ejercicio 1: POST /guess con `{ "numero": 50 }` y POST /reset.

### Pruebas automáticas (Ejercicio 2)
```bash
cd ejercicio2/backend
node tests/probarCasos2.js      # con el backend corriendo
node tests/probarExpiracion.js  # con el backend detenido (levanta su propio servidor)
```

---

## 📋 Requisitos Previos

- Node.js v18.11 o superior (por `node --watch`)
- npm (Node Package Manager)
- Postman (para pruebas de endpoints)

---

## 🔍 Validaciones Implementadas

- Ejercicio 1: `numero` debe ser un entero entre 1 y 100 (400)
- Cantidad entera mayor que 0 al agregar y mínimo 1 al actualizar (400)
- Stock suficiente al agregar y al subir porciones (400 "Stock insuficiente")
- Total de la reserva menor o igual al saldo (400 "Saldo insuficiente para esta cantidad")
- Plato inexistente o fuera de la reserva (404)
- Expiración de la reserva a los 5 minutos, revisada en cada petición con un middleware
- Formato de error en todos los endpoints: `{ "mensaje": "..." }`

---

## 🛠️ Tecnologías

- **Backend:** Node.js, Express, cors
- **Frontend:** React, Vite, Reactstrap, Bootstrap
- **Control de versiones:** Git y GitHub con Gitflow (`feature/*` → `develop` → `main`)
