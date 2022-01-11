import React, { useState } from "react";
import { Row, Col, Form, FloatingLabel } from 'react-bootstrap';
import { useFiltros } from "../../../hooks/useFiltros";

//Css-img-icons
import './Filtros.css';

const FiltrosProyectos = ({ show }) => {
    const { handleFiltros } = useFiltros();

    const [showCobro, setShowCobro] = useState(false);
    const [showPago, setShowPago] = useState(false);

    const handleChangeShowFiltros = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        /*Si se selecciona el check de cobros se debe mostrar/ocultar los filtros de fechas correspondientes a cobros*/
        if (targetName == 'cobro') {
            if (targetCheck == true) {
                setShowCobro(true);
            } else {
                setShowCobro(false);
            }
        }

        /*Si se selecciona el check de pagos se debe mostrar/ocultar los filtros de fechas correspondientes a pagos*/
        if (targetName == 'pago') {
            if (targetCheck == true) {
                setShowPago(true);
            } else {
                setShowPago(false);
            }
        }
    }

    /***FALTA --->>> boton para limpiar los filtros***/
    return (<>
        <Row hidden={show} className="cont-filtros">
            <Row className="check-box-row">
                <Col xs={6} sm={3} >
                    <Form.Check inline onChange={handleChangeShowFiltros} label="Fechas para Cobros" name="cobro" value="cobro" type="checkbox" />
                </Col>
                <Col xs={6} sm={3} >
                    <Form.Check inline onChange={handleChangeShowFiltros} label="Fechas para Pagos" name="pago" value="pago" type="checkbox" />
                </Col>
            </Row>
            {
                showCobro && <>
                    <Form.Label className="title-fechas-filtros">Fecha para Cobros/Ingresos Realizados</Form.Label>
                    <Col xs={12} sm={3} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Desde fecha de Cobro">
                            <Form.Control onChange={handleFiltros} name="fecha_cobro_desde" type="date" />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} sm={3} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Hasta fecha de Cobro">
                            <Form.Control onChange={handleFiltros} name="fecha_cobro_hasta" type="date" />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} sm={3} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Desde Fecha Diferida de Cobro">
                            <Form.Control onChange={handleFiltros} name="fecha_diferida_cobro_desde" type="date" />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} sm={3} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Hasta Fecha Diferida de Cobro">
                            <Form.Control onChange={handleFiltros} name="fecha_diferida_cobro_hasta" type="date" />
                        </FloatingLabel>
                    </Col>
                </>
            }
            {
                showPago && <>
                    <Form.Label className="title-fechas-filtros">Fechas para Pagos/Egresos Realizados</Form.Label>
                    <Col xs={12} sm={3} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Desde fecha de Pago">
                            <Form.Control onChange={handleFiltros} name="fecha_pago_desde" type="date" />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} sm={3} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Hasta fecha de Pago">
                            <Form.Control onChange={handleFiltros} name="fecha_pago_hasta" type="date" />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} sm={3} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Desde Fecha Diferida de Pago">
                            <Form.Control onChange={handleFiltros} name="fecha_diferida_pago_desde" type="date" />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} sm={3} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Hasta Fecha Diferida de Pago">
                            <Form.Control onChange={handleFiltros} name="fecha_diferida_pago_hasta" type="date" />
                        </FloatingLabel>
                    </Col>
                </>
            }

        </Row>
    </>)
}

export default React.memo(FiltrosProyectos);