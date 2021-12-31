import React, { useState } from "react";
import { Row, Col, Form, FloatingLabel } from 'react-bootstrap';
import { useFiltros } from "../../../hooks/useFiltros";

//Css-img-icons
import './Filtros.css';

const FiltrosProyectos = ({ show }) => {
    const { handleFiltros } = useFiltros();

    //Falta boton para limpiar los filtros
    return (<>
        <Row hidden={show} className="cont-filtros">
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
        </Row>
    </>)
}

export default React.memo(FiltrosProyectos);