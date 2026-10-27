import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Row,
} from 'reactstrap'

function MenuDelDia({ menu, onAgregar, cargando }) {
  return (
    <Row>
      {menu.map((plato) => (
        <Col key={plato.id} xs="12" md="4">
          <Card className="mb-3 h-100">
            <CardBody className="d-flex flex-column">
              <CardTitle tag="h3" className="h5">
                {plato.nombre}
              </CardTitle>
              <CardText className="mb-2">{plato.categoria}</CardText>
              <p className="mb-2">
                Precio:{' '}
                <Badge color="success">
                  ${plato.precio.toFixed(2)}
                </Badge>
              </p>
              <p className="mb-3">Stock disponible: {plato.stock}</p>
              <Button
                className="mt-auto"
                color={plato.stock === 0 ? 'secondary' : 'success'}
                disabled={cargando || plato.stock === 0}
                onClick={() => onAgregar(plato.id)}
              >
                {plato.stock === 0 ? 'Agotado' : 'Añadir a la Reserva'}
              </Button>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default MenuDelDia
