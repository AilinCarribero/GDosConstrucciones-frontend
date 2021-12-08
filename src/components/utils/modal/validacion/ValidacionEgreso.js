import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

//Icons
import * as Icons from 'react-bootstrap-icons';
import { formatNumber } from '../../../../hooks/useUtils';

//Css
import './Validacion.css';

const ValidacionEgreso = ({ mostrar, datos, pago, comprobantes, analisisCostos, detallesAC, setShow, setSubmit, usd }) => {
    const handleClose = () => setShow(false);

    const handleEnviar = () => {
        setShow(false);
        setSubmit();
    }

    return (<>
        <Modal show={mostrar} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <Icons.ExclamationTriangleFill className="icono"/>
                    <b>Confirme el envio</b> 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {datos.length > 1 ? datos.map((dato, i) => (
                    <Row key={i}>
                        {
                            i == 0 && (<>
                                <Col className="texto" xs={12} sm={12}><b>Proyecto: </b>{dato.id_proyecto} </Col>
                                <Col className="texto" xs={12} sm={12}><b>Fecha de hoy: </b>{dato.fecha_pago} </Col>
                                {pago.map(forma => (
                                    forma.id_forma_pago == dato.id_forma_pago && <Col className="texto" xs={12} sm={12} key={forma.id_forma_pago}><b>Forma de pago: </b>{forma.forma_pago}</Col>
                                ))}
                                {analisisCostos.map(analisisCosto => (
                                    analisisCosto.id_analisis_costo == dato.id_analisis_costo && <Row key={analisisCosto.id_analisis_costo}>
                                        <Col className="texto" xs={12} sm={12}><b>Analisis de Costo: </b>{analisisCosto.analisis_costo} </Col>
                                        {detallesAC.map(detalleAC => (
                                            detalleAC.id_detalle_ac == dato.id_detalle_ac &&
                                            <Col className="texto" xs={12} sm={12} key={detalleAC.id_detalle_ac}><b>Detalle: </b>{detalleAC.detalle_ac} </Col>
                                        ))}
                                    </Row>))
                                }
                                {comprobantes.map(comprobante => (
                                    comprobante.id_comprobante_pago == dato.id_comprobante_pago && <Row key={comprobante.id_comprobante_pago} >
                                        <Col className="texto" xs={12} sm={12}><b>Comprobante de Pago: </b>{comprobante.nombre_comprobante} </Col>
                                        <Col className="texto" xs={3} sm={3}><b>Tipo: </b>{comprobante.tipo_comprobante} </Col>
                                        <Col className="texto" xs={5} sm={5}><b>N°: </b>{dato.numero_comprobante} </Col>
                                    </Row>))
                                }
                                {dato.observaciones && <Col className="texto" xs={12} sm={12}><b>Observaciones: </b>{dato.observaciones}</Col>}
                            </>)
                        }
                        {dato.cuota && (<>
                            {dato.cuotaNumero == 0 && <Col className="texto" xs={12} sm={12}><b>Cantidad de cuotas: </b>{dato.cuota}</Col>}
                            <Col className="texto" xs={6} sm={6}><b>Cuota N°: </b>{dato.cuotaNumero + 1}</Col>
                            <Col className="texto" xs={6} sm={6}><b>Monto: $</b>{dato.valor_pago}</Col>
                            <Col className="texto" xs={12} sm={12}><b>Fecha a pagar: </b>{dato.fecha_diferido_pago}</Col>
                        </>)}
                    </Row>
                ))
                    :
                    <Row>
                        <Col className="texto" xs={12} sm={12}><b>Proyecto: </b>{datos.id_proyecto} </Col>
                        <Col className="texto" xs={12} sm={12}><b>Fecha de hoy: </b>{datos.fecha_pago} </Col>
                        {pago.map(forma => (
                            forma.id_forma_pago == datos.id_forma_pago && <Col className="texto" xs={12} sm={12} key={forma.id_forma_pago}><b>Forma de pago: </b>{forma.forma_pago}</Col>
                        ))}
                        {datos.fecha_diferido_pago && <Col className="texto" xs={12} sm={12}><b>Fecha a pagar: </b>{datos.fecha_diferido_pago}</Col>}
                        {analisisCostos.map(analisisCosto => (
                            analisisCosto.id_analisis_costo == datos.id_analisis_costo && <Row key={analisisCosto.id_analisis_costo}>
                                <Col className="texto" xs={12} sm={12}><b>Analisis de Costo: </b>{analisisCosto.analisis_costo} </Col>
                                {detallesAC.map(detalleAC => (
                                    detalleAC.id_detalle_ac == datos.id_detalle_ac && <>
                                        <Col className="texto" xs={12} sm={12} key={detalleAC.id_detalle_ac}><b>Detalle: </b>{detalleAC.detalle_ac} </Col>
                                    </>))}
                            </Row>))
                        }
                        <Col className="texto" xs={12} sm={12}><b>Monto: </b>{ usd == 0 ? '$' : 'USD$'}{ usd == 0 ? datos.valor_pago : datos.valor_usd }</Col>
                        {comprobantes && comprobantes.map(comprobante => (
                            comprobante.id_comprobante_pago == datos.id_comprobante_pago && <Row key={comprobante.id_comprobante_pago}>
                                <Col className="texto" xs={12} sm={12}><b>Comprobante de Pago: </b>{comprobante.nombre_comprobante} </Col>
                                <Col className="texto" xs={3} sm={3}><b>Tipo: </b>{comprobante.tipo_comprobante} </Col>
                                <Col className="texto" xs={6} sm={6}><b>N°: </b>{datos.numero_comprobante} </Col>
                            </Row>))
                        }
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

export default React.memo(ValidacionEgreso);