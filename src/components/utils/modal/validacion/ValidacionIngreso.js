import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

//Icons
import * as Icons from 'react-bootstrap-icons';
import { formatNumber } from '../../../../hooks/useUtils';

//Css
import './Validacion.css';

const ValidacionIngreso = ({ mostrar, datos, cobro, setShow, setSubmit, usd }) => {
  const handleClose = () => setShow(false);

  const handleEnviar = () => {
    setShow(false);
    setSubmit();
  }

  return (<>
    <Modal show={mostrar} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icons.ExclamationTriangleFill className="icono" />
          <b>Confirme el envio</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {datos.length > 1 ? datos.map((dato, i) => (
          <Row key={i}>
            {
              i == 0 && (<>
                <Col className="texto" xs={12} sm={12}><b>Proyecto: </b>{dato.id_proyecto} </Col>
                <Col className="texto" xs={12} sm={12}><b>Fecha de hoy: </b>{dato.fecha_cobro} </Col>
                {cobro.map(forma => (
                  forma.id_forma_cobro == dato.id_forma_cobro && <Col className="texto" xs={12} sm={12} key={forma.id_forma_cobro}><b>Forma de cobro: </b>{forma.forma_cobro}</Col>
                ))}
                {dato.observaciones && <Col className="texto" xs={12} sm={12}><b>Observaciones: </b>{dato.observaciones}</Col>}
              </>)
            }
            {
              dato.cuota && (<>
                {dato.cuotaNumero == 0 && <Col className="texto" xs={12} sm={12}><b>Cantidad de cuotas: </b>{dato.cuota}</Col>}
                <Col className="texto" xs={6} sm={6}><b>Cuota N°: </b>{dato.cuotaNumero + 1}</Col>
                <Col className="texto" xs={6} sm={6}><b>Monto: $</b> {formatNumber(dato.valor_cobro)}</Col>
                <Col className="texto" xs={12} sm={12}><b>Fecha a pagar: </b>{dato.fecha_diferido_cobro}</Col>
              </>)
            }
            {
              dato.cheque >= 0 && (<>
                <Col className="texto" xs={3} sm={3}><b>Cheque: </b>{dato.cheque + 1}</Col>
                <Col className="texto" xs={6} sm={6}><b>Monto: $</b> {dato.valor_cobro}</Col>
                <Col className="texto" xs={12} sm={12}><b>Fecha a pagar: </b>{dato.fecha_diferido_cobro}</Col>
              </>)
            }
          </Row>
        ))
          :
          <Row>
            <Col className="texto" xs={12} sm={12}><b>Proyecto: </b>{datos.id_proyecto} </Col>
            <Col className="texto" xs={12} sm={12}><b>Fecha de hoy: </b>{datos.fecha_cobro} </Col>
            {cobro.map(forma => (
              forma.id_forma_cobro == datos.id_forma_cobro && <Col className="texto" xs={12} sm={12} key={forma.id_forma_cobro}><b>Forma de cobro: </b>{forma.forma_cobro}</Col>
            ))}
            {datos.fecha_diferido_cobro && <Col className="texto" xs={12} sm={12}><b>Fecha a pagar: </b>{datos.fecha_diferido_cobro}</Col>}
            <Col className="texto" xs={12} sm={12}><b>Monto: </b> { usd == 0 ? '$' : 'USD$'} {usd == 0 ? datos.valor_cobro : datos.valor_usd}</Col>
            {datos.observaciones && <Col className="texto" xs={12} sm={12}><b>Observaciones: </b>{datos.observaciones}</Col>}
          </Row>
        }
        <Row className="button-contenedor">
          <Col sm={6} xs={6}>
            <Button className="button-validacion" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
          </Col>
          <Col sm={6} xs={6}>
            <Button className="button-validacion" variant="dark" onClick={handleEnviar}>
              Enviar
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  </>)
}

export default React.memo(ValidacionIngreso);