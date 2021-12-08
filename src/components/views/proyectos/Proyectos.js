import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Hooks
import { useGetProyectos } from '../../../hooks/useProyectos';
import { useGetEgresos } from '../../../hooks/useEgresos';
import { useGetIngresos } from '../../../hooks/useIngresos';
import { formatNumber } from '../../../hooks/useUtils';

//Componentes


//Css
import './Proyectos.css';
import * as Icons from 'react-bootstrap-icons';
import SpinnerC from '../../utils/spinner/SpinnerC';

const Proyectos = () => {
    const fecha = toString(new Date().toISOString());
    const { proyectos } = useGetProyectos();
    const { egresos } = useGetEgresos();
    const { ingresos } = useGetIngresos();

    const [spinner, setSpinner] = useState(true);

    const [totales, setTotales] = useState({
        egresos: 0,
        ingresos: 0,
        egresosUSD: 0,
        ingresosUSD: 0,
        costos: 0,
        ventas: 0
    });
    const [totalesUN, setTotalesUN] = useState({
        PPEgreso: 0,
        PPIngreso: 0,
        DEgreso: 0,
        DIngreso: 0,
        MEgreso: 0,
        MIngreso: 0,
        CCCIngreso: 0,
        CCCEgreso: 0,
        CCEIngreso: 0,
        CCEEgreso: 0
    })

    //Egresos totales de un proyecto determinado
    const egresosProyecto = (id_proyecto) => {
        let auxEgresosProyecto = 0;

       egresos.map(egreso => {
            if (egreso.id_proyecto == id_proyecto) {
                auxEgresosProyecto += parseFloat(egreso.valor_pago);
            }
        })

        return (auxEgresosProyecto)
    }

    //Egresos totales de un proyecto determinado en dolares
    const egresosUSDProyecto = (id_proyecto) => {
        let auxEgresosProyecto = 0;

       egresos.map(egreso => {
            if (egreso.id_proyecto == id_proyecto) {
                auxEgresosProyecto += parseFloat(egreso.valor_usd);
            }
        })

        return (auxEgresosProyecto)
    }

    //Ingresos totales de un proyecto determinado
    const ingresosProyecto = (id_proyecto) => {
        let auxIngresosProyecto = 0;

        ingresos.map(ingreso => {
            if (ingreso.id_proyecto == id_proyecto) {
                auxIngresosProyecto += parseFloat(ingreso.valor_cobro);
            }
        })

        return (auxIngresosProyecto)
    }

    //Ingresos totales de un proyecto determinado en dolares
    const ingresosUSDProyecto = (id_proyecto) => {
        let auxIngresosProyecto = 0;

        ingresos.map(ingreso => {
            if (ingreso.id_proyecto == id_proyecto) {
                auxIngresosProyecto += parseFloat(ingreso.valor_usd);
            }
        })

        return (auxIngresosProyecto)
    }

    const resumenContableProyectos = () => {
        let auxTotalCosto = 0;
        let auxTotalVenta = 0;
        let auxTotalEgresos = 0;
        let auxTotalIngresos = 0;
        let auxTotalUSDE = 0;
        let auxTotalUSDI = 0;

        let auxPPE = 0;
        let auxPPI = 0;
        let auxDE = 0;
        let auxDI = 0;
        let auxME = 0;
        let auxMI = 0;
        let auxCCCE = 0;
        let auxCCCI = 0;
        let auxCCEE = 0;
        let auxCCEI = 0;

        //Reparte los ingresos y los egresos correspondientes a cada area
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
                                auxTotalUSDE += parseFloat(egreso.valor_usd);
                            }
                        });
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxPPI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDI += parseFloat(ingreso.valor_usd);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '2') {
                       egresos.map(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto) {
                                auxDE += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                                auxTotalUSDE += parseFloat(egreso.valor_usd);
                            }
                        });
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxDI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDI += parseFloat(ingreso.valor_usd);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '3') {
                       egresos.map(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto) {
                                auxME += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                                auxTotalUSDE += parseFloat(egreso.valor_usd);
                            }
                        });
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxMI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDI += parseFloat(ingreso.valor_usd);
                            }
                        });
                    }
                } else if (proyecto.id_centro_costo == '1') {
                    egresos.map(egreso => {
                        if (egreso.id_proyecto == proyecto.id_proyecto) {
                            /*if (egreso.analisis_costo == 'Bienes de Uso' || egreso.analisis_costo == 'Gastos de Empresa') {
                                const partesIguales = parseFloat(egreso.valor_pago) / 3;
                                auxDE += parseFloat(partesIguales);
                                auxME += parseFloat(partesIguales);
                                auxPPE += parseFloat(partesIguales);
                            } else if (egreso.analisis_costo == 'Acopio de Materiales') {
                                proyecto.id_unidad_negocio == '1' && (auxPPE += parseFloat(egreso.valor_pago));
                                proyecto.id_unidad_negocio == '2' && (auxDE += parseFloat(egreso.valor_pago));
                                proyecto.id_unidad_negocio == '3' && (auxME += parseFloat(egreso.valor_pago));
                            }*/
                            auxCCCE += parseFloat(egreso.valor_pago);
                            auxTotalEgresos += parseFloat(egreso.valor_pago);
                            auxTotalUSDE += parseFloat(egreso.valor_usd);
                        }
                    });

                    ingresos.map(ingreso => {
                        if (ingreso.id_proyecto == proyecto.id_proyecto) {
                            auxCCCI += parseFloat(ingreso.valor_cobro);
                            auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            auxTotalUSDI += parseFloat(ingreso.valor_usd);
                        }
                    });

                    /*if (proyecto.id_unidad_negocio == '1') {
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxPPI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDI += parseFloat(ingreso.valor_usd);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '2') {
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxDI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDI += parseFloat(ingreso.valor_usd);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '3') {
                        ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxMI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDI += parseFloat(ingreso.valor_usd);
                            }
                        });
                    }*/
                } else if (proyecto.id_centro_costo == '3') {
                    egresos.map(egreso => {
                        if (egreso.id_proyecto == proyecto.id_proyecto) {
                            auxCCEE += parseFloat(egreso.valor_pago)
                            auxTotalEgresos += parseFloat(egreso.valor_pago);
                            auxTotalUSDE += parseFloat(egreso.valor_usd);
                        }
                    });

                    ingresos.map(ingreso => {
                        if (ingreso.id_proyecto == proyecto.id_proyecto) {
                            auxCCEI += parseFloat(ingreso.valor_cobro);
                            auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            auxTotalUSDI += parseFloat(ingreso.valor_usd);
                        }
                    });     
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
            ingresos: auxTotalIngresos,
            egresosUSD: auxTotalUSDE,
            ingresosUSD: auxTotalUSDI
        })
        setTotalesUN({
            PPEgreso: auxPPE,
            PPIngreso: auxPPI,
            DEgreso: auxDE,
            DIngreso: auxDI,
            MEgreso: auxME,
            MIngreso: auxMI,
            CCCEgreso: auxCCCE,
            CCCIngreso: auxCCCI,
            CCEEgreso: auxCCEE,
            CCEIngreso: auxCCEI
        })
        setSpinner(false);
    }

    useEffect(() => {
        if (proyectos && egresos && ingresos) {
            resumenContableProyectos();
        }
    }, [proyectos, egresos, ingresos])

    return (<>
        <div>
            <Row className="resumenTotales">
                <Col xs={6} md={3} className="resumenTotal border-right border-mobile-bot">
                    <Row>
                        <Col xs={12} md={12}>
                            <h6>Costos: </h6>
                        </Col>
                        <Col xs={12} md={12}>
                            <h6>${formatNumber(totales.costos)}</h6>
                        </Col>
                    </Row>
                </Col>
                <Col xs={6} md={3} className="resumenTotal border-right border-mobile-right border-mobile-bot">
                    <Row>
                        <Col xs={12} md={12}>
                            <h6>Venta: </h6>
                        </Col>
                        <Col xs={12} md={12}>
                            <h6>${formatNumber(totales.ventas)}</h6>
                        </Col>
                    </Row>
                </Col>
                <OverlayTrigger placement="bottom" overlay={
                    <Tooltip>
                        <p>PP: ${formatNumber(totalesUN.PPIngreso)}</p>
                        <p>D: ${formatNumber(totalesUN.DIngreso)}</p>
                        <p>M: ${formatNumber(totalesUN.MIngreso)}</p>
                        <p>CCC: ${formatNumber(totalesUN.CCCIngreso)}</p>
                        <p>CCE: ${formatNumber(totalesUN.CCEIngreso)}</p>
                    </Tooltip>
                }>
                    <Col xs={6} md={3} className="resumenTotal border-right">
                        <Row>
                            <Col xs={12} md={12}>
                                <h6>Ingresos:</h6>
                            </Col>
                            <Col xs={12} md={6}>
                                <h6> ${formatNumber(totales.ingresos)}</h6>
                            </Col>
                            <Col xs={12} md={6}>
                                <h6> USD${formatNumber(totales.ingresosUSD)}</h6>
                            </Col>
                        </Row>
                    </Col>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={
                    <Tooltip>
                        <p>PP: ${formatNumber(totalesUN.PPEgreso)}</p>
                        <p>D: ${formatNumber(totalesUN.DEgreso)}</p>
                        <p>M: ${formatNumber(totalesUN.MEgreso)}</p>
                        <p>CCC: ${formatNumber(totalesUN.CCCEgreso)}</p>
                        <p>CCE: ${formatNumber(totalesUN.CCEEgreso)}</p>
                    </Tooltip>
                }>
                    <Col xs={6} md={3} className="resumenTotal">
                        <Row>
                            <Col xs={12} md={12}>
                                <h6>Egresos: </h6>
                            </Col>
                            <Col xs={12} md={6}>
                                <h6>${formatNumber(totales.egresos)}</h6>
                            </Col>
                            <Col xs={12} md={6}>
                                <h6>USD${formatNumber(totales.egresosUSD)}</h6>
                            </Col>
                        </Row>
                    </Col>
                </OverlayTrigger>
            </Row>
            {spinner && <Spinner animation="border" variant="dark" />}
            <Row>
                <Accordion>
                    {
                        proyectos.length > 0 &&
                        proyectos.map(proyecto => (
                            <Col key={proyecto.id_proyecto}>
                                <Accordion.Item eventKey={proyecto.id_proyecto} className={proyecto.id_centro_costo == 1 || proyecto.id_centro_costo == 3 ? 'accordionCC' : ''}>
                                    <Accordion.Header> {proyecto.id_proyecto} </Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            {proyecto.id_centro_costo == 2 && <>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Venta: ${formatNumber(proyecto.venta)}</p></Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Costo: ${formatNumber(proyecto.costo)}</p></Col>
                                                    </Row>
                                                </Col>
                                            </>}
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}>
                                                        <Link to={`/egresos/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                                    </Col>
                                                    <Col xs={11} md={11}><p> Egresos:</p>
                                                        <Col xs={6} md={6}><p>${formatNumber(egresosProyecto(proyecto.id_proyecto))} </p></Col>
                                                        <Col xs={5} md={5}><p>USD${formatNumber(egresosUSDProyecto(proyecto.id_proyecto))} </p></Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}>
                                                        <Link to={`/ingresos/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                                    </Col>
                                                    <Col xs={11} md={11}><p> Ingresos:</p>
                                                        <Col xs={6} md={6}><p>${formatNumber(ingresosProyecto(proyecto.id_proyecto))} </p></Col>
                                                        <Col xs={5} md={5}><p>USD${formatNumber(ingresosUSDProyecto(proyecto.id_proyecto))} </p></Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Col>
                        ))

                    }
                </Accordion>
            </Row>
        </div>
    </>)
}

export default React.memo(Proyectos);
