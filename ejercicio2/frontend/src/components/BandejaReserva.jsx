import {
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'

function BandejaReserva({
  items,
  menu,
  onCambiarCantidad,
  onQuitar,
  cargando,
}) {
  if (items.length === 0) {
    return <p className="text-muted">Todavía no agregas platos a tu reserva.</p>
  }

  return (
    <ListGroup>
      {items.map((item) => {
        const plato = menu.find((producto) => producto.id === item.id)

        return (
          <ListGroupItem
            key={item.id}
            className="d-flex flex-wrap align-items-center justify-content-between gap-2"
          >
            <span className="me-auto">
              {plato ? plato.nombre : `Platillo #${item.id}`}
              <span className="d-block text-muted small">
                {plato ? `$${(plato.precio * item.cantidad).toFixed(2)}` : ''}
              </span>
            </span>
            <ButtonGroup size="sm" aria-label={`Porciones de ${plato?.nombre || 'platillo'}`}>
              <Button
                color="secondary"
                outline
                aria-label="Quitar una porción"
                disabled={cargando || item.cantidad <= 1}
                onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
              >
                −
              </Button>
              <Button color="light" disabled aria-label="Cantidad de porciones">
                {item.cantidad}
              </Button>
              <Button
                color="secondary"
                outline
                aria-label="Agregar una porción"
                disabled={cargando}
                onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
              >
                +
              </Button>
            </ButtonGroup>
            <Button
              color="danger"
              outline
              size="sm"
              disabled={cargando}
              onClick={() => onQuitar(item.id)}
            >
              Quitar
            </Button>
          </ListGroupItem>
        )
      })}
    </ListGroup>
  )
}

export default BandejaReserva
