import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Hooks
import { useGetProyectos } from '../../../hooks/useProyectos';
import { useGetEgresos } from '../../../hooks/useEgresos';
import { useGetIngresos } from '../../../hooks/useIngresos';
import { formatNumber } from '../../../hooks/useUtils';

//Css
import './Proyectos.css';
import * as Icons from 'react-bootstrap-icons';

const Proyectos = () => {
    const fecha = toString(new Date().toISOString());
    const { proyectos } = useGetProyectos();
    const { egresos } = useGetEgresos();
    const { ingresos } = useGetIngresos();

    const [totales, setTotales] = useState({
        egresos: 0,
        ingresos: 0,
        costos: 0,
        ventas: 0
    });
    const [totalesUN, setTotalesUN] = useState({
        PPEgreso: 0,
        PPIngreso: 0,
        DEgreso: 0,
        DIngreso: 0,
        MEgreso: 0,
        MIngreso: 0
    })

    const egresosProyecto = (id_proyecto) => {
        let auxEgresosProyecto = 0;

        egresos.map(egreso => {
            if (egreso.id_proyecto == id_proyecto) {
                auxEgresosProyecto += parseFloat(egreso.valor_pago);
            }
        })

        return (auxEgresosProyecto)
    }

    const ingresosProyecto = (id_proyecto) => {
        let auxIngresosProyecto = 0;

        ingresos.map(ingreso => {
            if (ingreso.id_proyecto == id_proyecto) {
                auxIngresosProyecto += parseFloat(ingreso.valor_cobro);
            }
        })

        return (auxIngresosProyecto)
    }

    const resumenContableProyectos = () => {
        let auxTotalCosto = 0;
        let auxTotalVenta = 0;
        let auxTotalEgresos = 0;
        let auxTotalIngresos = 0;
        let auxPPE = 0;
        let auxPPI = 0;
        let auxDE = 0;
        let auxDI = 0;
        let auxME = 0;
        let auxMI = 0;

        //Reparto los ingresos y los egresos correspondientes a cada area
        if (proyectos.length > 0) {
            proyectos.map(proyecto => {
                if (proyecto.id_centro_costo == '2') {
                    auxTotalCosto += parseFloat(proyecto.costo);
                    auxTotalVenta += parseFloat(proyecto.venta);
                    if (proyecto.id_unidad_negocio == '1') {
                        egresos.map(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto) {
                                auxPPE += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                            }
                        });
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxPPI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '2') {
                        egresos.map(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto) {
                                auxDE += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                            }
                        });
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxDI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '3') {
                        egresos.map(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto) {
                                auxME += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                            }
                        });
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxMI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            }
                        });
                    }
                } else if (proyecto.id_centro_costo == '1') {
                    egresos.map(egreso => {
                        if (egreso.id_proyecto == proyecto.id_proyecto) {
                            if (egreso.analisis_costo == 'Bienes de Uso' || egreso.analisis_costo == 'Gastos de Empresa') {
                                const partesIguales = parseFloat(egreso.valor_pago) / 3;
                                auxDE += parseFloat(partesIguales);
                                auxME += parseFloat(partesIguales);
                                auxPPE += parseFloat(partesIguales);
                            } else if (egreso.analisis_costo == 'Acopio de Materiales') {
                                proyecto.id_unidad_negocio == '1' && (auxPPE += parseFloat(egreso.valor_pago));
                                proyecto.id_unidad_negocio == '2' && (auxDE += parseFloat(egreso.valor_pago));
                                proyecto.id_unidad_negocio == '3' && (auxME += parseFloat(egreso.valor_pago));
                            }
                            auxTotalEgresos += parseFloat(egreso.valor_pago);
                        }
                    });

                    if (proyecto.id_unidad_negocio == '1') {
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxPPI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '2') {
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxDI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '3') {
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxMI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            }
                        });
                    }
                }
            })
        } else {
            auxTotalCosto = proyectos.costo;
            auxTotalVenta = proyectos.venta;
        }

        setTotales({
            costos: auxTotalCosto,
            ventas: auxTotalVenta,
            egresos: auxTotalEgresos,
            ingresos: auxTotalIngresos
        })
        setTotalesUN({
            PPEgreso: auxPPE,
            PPIngreso: auxPPI,
            DEgreso: auxDE,
            DIngreso: auxDI,
            MEgreso: auxME,
            MIngreso: auxMI
        })
    }

    useEffect(() => {
        if (proyectos && egresos && ingresos) {
            resumenContableProyectos();
        }
        //eslint-disable-next-line
    }, [proyectos, egresos, ingresos])

    return (<>
        <div>
            <Row className="resumenTotales">
                <Col xs={6} md={3} className="resumenTotal">
                    <h6>Costos: {formatNumber(totales.costos)}</h6>
                </Col>
                <Col xs={6} md={3} className="resumenTotal">
                    <h6>Venta: {formatNumber(totales.ventas)}</h6>
                </Col>
                <OverlayTrigger placement="bottom" overlay={
                    <Tooltip>
                        <p>PP: {formatNumber(totalesUN.PPIngreso)}</p>
                        <p>D: {formatNumber(totalesUN.DIngreso)}</p>
                        <p>M: {formatNumber(totalesUN.MIngreso)}</p>
                    </Tooltip>
                }>
                    <Col xs={6} md={3} className="resumenTotal">
                        <h6>Ingresos: {formatNumber(totales.ingresos)}</h6>
                    </Col>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={
                    <Tooltip>
                        <p>PP: {formatNumber(totalesUN.PPEgreso)}</p>
                        <p>D: {formatNumber(totalesUN.DEgreso)}</p>
                        <p>M: {formatNumber(totalesUN.MEgreso)}</p>
                    </Tooltip>
                }>
                    <Col xs={6} md={3} className="resumenTotal">
                        <h6>Egresos: {formatNumber(totales.egresos)}</h6>
                    </Col>
                </OverlayTrigger>
            </Row>
            <Row>
                <Accordion>
                    {
                        proyectos.length > 0 ?
                            proyectos.map(proyecto => (
                                <Col key={proyecto.id_proyecto}>
                                    <Accordion.Item eventKey={proyecto.id_proyecto}>
                                        <Accordion.Header> {proyecto.id_proyecto} </Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                {proyecto.id_centro_costo == 2 && <>
                                                    <Col xs={12} md={6}>
                                                        <Row>
                                                            <Col xs={1} md={1}></Col>
                                                            <Col xs={11} md={11}><p> Venta: {formatNumber(proyecto.venta)}</p></Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Row>
                                                            <Col xs={1} md={1}></Col>
                                                            <Col xs={11} md={11}><p> Costo: {formatNumber(proyecto.costo)}</p></Col>
                                                        </Row>
                                                    </Col>
                                                </>}
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}>
                                                            <Link to={`/egresos/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                                        </Col>
                                                        <Col xs={11} md={11}><p> Egresos: {formatNumber(egresosProyecto(proyecto.id_proyecto))} </p></Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}>
                                                            <Link to={`/ingresos/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                                        </Col>
                                                        <Col xs={11} md={11}><p> Ingresos: {formatNumber(ingresosProyecto(proyecto.id_proyecto))} </p></Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Col>
                            ))
                            : <Col>
                                <h6>No existen proyectos</h6>
                                <p>Agregar icono de alerta</p>
                            </Col>
                    }
                </Accordion>
            </Row>
        </div>
    </>)
}

export default React.memo(Proyectos);