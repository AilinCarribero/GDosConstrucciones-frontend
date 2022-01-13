import React from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, Row, Col } from 'react-bootstrap';

//Hooks
import { useGetEgresosId } from '../../../hooks/useEgresos';
import { formatNumber } from '../../../hooks/useUtils';

//Css
import './Egresos.css';

const Egresos = () => {
    const { id } = useParams();
    const { egresos } = useGetEgresosId(id);

    return (<>
        <Row>
            <Col className="titulo-egresos-vista">{id}</Col>
        </Row>
        <Row className="acordion">
            <Accordion>
                {
                    egresos.length > 0 ?
                        egresos.map(egreso => (
                            <Col key={egreso.id_egreso}>
                                <Accordion.Item eventKey={egreso.id_egreso}>
                                    <Accordion.Header>
                                        <Col className="acordion-title" xs={3} md={3}> <b>{egreso.analisis_costo}</b> </Col>
                                        <Col className="acordion-title" xs={3} md={3}><b>{egreso.forma_pago}</b> </Col>
                                        <Col className="acordion-title" xs={3} md={3}><b>{egreso.observaciones}</b> </Col>
                                        <Col className="acordion-title-number" xs={3} md={3}><b>{ egreso.valor_pago > 0 ? '$'+formatNumber(egreso.valor_pago) : 'USD$'+formatNumber(egreso.valor_usd) }</b> </Col>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col xs={12} md={6}>Fecha del pago<b>:</b> {new Date(egreso.fecha_pago).toISOString().slice(0, 10)}</Col>
                                            {(new Date(egreso.fecha_diferido_pago) > new Date(egreso.fecha_pago)) && <>
                                                <Col xs={12} md={6}>Fecha diferida<b>:</b> {new Date(egreso.fecha_diferido_pago).toISOString().slice(0, 10)}</Col>
                                                {(egreso.cuotas > 0) && <>
                                                    <Col xs={6} md={6}>Cantidad de cuotas<b>:</b> {egreso.cuotas}</Col>
                                                    <Col xs={6} md={6}>Cuota N°<b>:</b> {egreso.cuota}</Col>
                                                </>}
                                            </>}
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={6}>Comprobante<b>:</b> {egreso.nombre_comprobante}</Col>
                                            <Col xs={4} md={2}>Tipo<b>:</b> {egreso.tipo_comprobante}</Col>
                                            <Col xs={6} md={3}>N°<b>:</b> {!egreso.numero_comprobante || egreso.numero_comprobante == 'undefined' ? '' : egreso.numero_comprobante }</Col>
                                        </Row>
                                        <Row>
                                            {egreso.observaciones && 
                                                <Col xs={12} md={12}>Observaciones<b>:</b> {egreso.observaciones}</Col>
                                            }
                                            <Col xs={12} md={12}>Nombre de quien cargo el comprobante<b>:</b> {egreso.nombre_apellido}</Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Col>
                        ))
                        : <Col>
                            <h6>No existen egresos</h6>
                            <p>Agregar icono de alerta</p>
                        </Col>
                }
            </Accordion>
        </Row>
    </>)
}

export default React.memo(Egresos);
