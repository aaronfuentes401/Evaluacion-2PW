// Inventario de platos del día (en memoria). El stock cambia al reservar.
const menu = [
  { id: 101, nombre: "Menú Ejecutivo (Pollo)", precio: 5.5, stock: 12, categoria: "Fuerte" },
  { id: 102, nombre: "Pasta Alfredo", precio: 4.75, stock: 8, categoria: "Fuerte" },
  { id: 103, nombre: "Lomo en Salsa", precio: 6.25, stock: 5, categoria: "Fuerte" },
  { id: 104, nombre: "Ensalada César", precio: 3.5, stock: 10, categoria: "Entrada" },
  { id: 105, nombre: "Sopa de Res", precio: 4.0, stock: 0, categoria: "Entrada" },
  { id: 106, nombre: "Pastel de Chocolate", precio: 2.25, stock: 6, categoria: "Postre" },
  { id: 107, nombre: "Refresco Natural", precio: 1.0, stock: 20, categoria: "Bebida" },
];

module.exports = menu;
