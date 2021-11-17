import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';

//Hooks
import { useGetFormasPagos } from '../../../hooks/useFormasPagos';
import { useGetProyectos } from '../../../hooks/useProyectos';
import { useGetAnalisisCostos, useDetalleAnalisisCosto } from '../../../hooks/useAnalisisCostos';
import { useUser } from '../../../hooks/useUser';
import { useGetComprobantesPago } from '../../../hooks/useComprobantePago';
import { ToastComponent } from '../../../hooks/useUtils';

//Servicios
import { insertEgreso } from '../../../services/apiEgresos';

import './Egresos.css';

const FormEgresos = () => {
    const { user } = useUser();
    const newDate = new Date();
    const año = newDate.getFullYear();
    const dia = newDate.getDate();

    //Datos extraidos desde la api para usarse en el formulario
    const { formasPagos } = useGetFormasPagos();
    const { proyectos } = useGetProyectos();
    const { analisisCostos } = useGetAnalisisCostos();
    const { comprobantePago } = useGetComprobantesPago();
    const { detalleAC } = useDetalleAnalisisCosto();

    //Datos a enviarse a la api para ingresar/modificar egresos
    const [egreso, setEgreso] = useState({
        id_user: user.id,
        fecha_pago: new Date().toISOString().slice(0, 10),
        id_proyecto: '',
        valor_pago: '',
        id_forma_pago: '',
        fecha_diferido_pago: '',
        observaciones: '',
        id_comprobante_pago: '',
        numero_comprobante: ''
    });

    //Eventos para mostrar partes del formulario
    const [showAC, setShowAC] = useState(false);
    const [showDAC, setShowDAC] = useState(false);
    const [showCuotas, setShowCuotas] = useState(false);
    const [showFechaDif, setShowFechaDif] = useState(false);
    const [showDetalleAC, setShowDetalleAC] = useState(false);
    const [showDetalleFP, setShowDetalleFP] = useState(false);

    const [validated, setValidated] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value

        setEgreso(prevEgreso => ({
            ...prevEgreso,
            [targetName]: targetValue
        }))

        //Si se selecciono un proyecto mostrar el select de analisisCostos
        if (targetName === 'proyecto') {
            setShowAC(showAC ? false : true);
        }

        //Si se selecciono analisis costos y ...
        if (targetName === 'id_analisis_costo') {
            analisisCostos.forEach((analisisCosto) => {
                if (analisisCosto.id_analisis_costo == targetValue) {
                    setShowDetalleAC(analisisCosto.requiere_detalle === 1 ? true : false);//... requiere detalle mostrara el cambo para agregar el detalle
                    setShowDAC(analisisCosto.id_centro_costo === 1 ? true : false);//... pertence a un AC de CCC entonces mostrara para elegir el detalle del AC de CCC
                }
            })
        }

        //Si se selecciono una forma de pago y...
        if (targetName === 'id_forma_pago') {
            formasPagos.forEach((formaPago) => {
                if (formaPago.id_forma_pago == targetValue) {
                    /* La forma de pago mediante tarjeta de credito se maneja diferente al resto */
                    setShowCuotas(formaPago.forma_pago === 'Tarjeta de Credito' ? true : false) //... es tarjeta de credito se debe mostrar la seleccion de cuotas
                    setShowFechaDif(formaPago.requiere_f_pago === 1 && formaPago.forma_pago !== 'Tarjeta de Credito' ? true : false) //... requiere una fecha diferente a la actual mostrar otro campo de fecha
                    setShowDetalleFP(formaPago.requiere_d_pago === 1 && formaPago.forma_pago !== 'Tarjeta de Credito' ? true : false)//... requiere un detalle se debe mostrar un input text
                }
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auxEgreso = [];

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            /*En caso de tener cuotas el valor del importe debe dividirse en partes iguales acorde a la cantidad de cuotas seleccionadas 
            y se debera diferir cada cuota a 30 dias despues de la siguiente */
            if (egreso.cuota > 0) {
                const valorCuota = egreso.valor_pago ? egreso.valor_pago / egreso.cuota : 0;

                if (valorCuota !== 0) {
                    for (let i = 0; i < egreso.cuota; i++) {
                        const mesD = newDate.getMonth() + i + 1
                        auxEgreso[i] = {
                            ...egreso,
                            cuotaNumero: i,
                            valor_pago: valorCuota,
                            fecha_diferido_pago: new Date(año, mesD, dia).toISOString().slice(0, 10)
                        }

                        try {
                            const resEgreso = await insertEgreso(auxEgreso[i]);

                            console.log(resEgreso);
                            if (!resEgreso.data.errno && (resEgreso.status == 200 || resEgreso.statusText == 'Ok')) {
                                ToastComponent('success');

                                //En caso de tener algun elemento extra mostrandose se vuelve a ocular
                                if (showCuotas === true) setShowCuotas(false);
                                if (showDetalleAC === true) setShowDetalleAC(false);
                                if (showDetalleFP === true) setShowDetalleFP(false);
                                if (showFechaDif === true) setShowFechaDif(false);
                                if (showDAC === true) setShowDAC(false);
                                if (showAC === true) setShowDAC(false);

                                //Los campos se vacian 
                                setEgreso({
                                    id_user: user.id,
                                    fecha_pago: new Date().toISOString().slice(0, 10),
                                    id_proyecto: '',
                                    valor_pago: '',
                                    id_forma_pago: '',
                                    fecha_diferido_pago: '',
                                    observaciones: '',
                                    id_comprobante_pago: egreso.id_comprobante_pago,
                                    numero_comprobante: '',
                                })
                                setValidated(false);
                            } else {
                                ToastComponent('error');
                            }
                        } catch (error) {
                            console.log(error);
                            ToastComponent('error');
                        }
                    }
                }
            } else {
                //Si no hay cuotas el proceso de guardado es normal
                try {
                    const resEgreso = await insertEgreso(egreso);

                    console.log(resEgreso);
                    if (!resEgreso.data.errno && (resEgreso.status == 200 || resEgreso.statusText == 'Ok')) {
                        ToastComponent('success');

                        //En caso de tener algun elemento extra mostrandose se vuelve a ocular
                        if (showCuotas === true) setShowCuotas(false);
                        if (showDetalleAC === true) setShowDetalleAC(false);
                        if (showDetalleFP === true) setShowDetalleFP(false);
                        if (showFechaDif === true) setShowFechaDif(false);
                        if (showDAC === true) setShowDAC(false);
                        if (showAC === true) setShowDAC(false);

                        //Los campos se vacian 
                        setEgreso({
                            id_user: user.id,
                            fecha_pago: new Date().toISOString().slice(0, 10),
                            id_proyecto: '',
                            valor_pago: '',
                            id_forma_pago: '',
                            fecha_diferido_pago: '',
                            observaciones: '',
                            id_comprobante_pago: egreso.id_comprobante_pago,
                            numero_comprobante: '',
                        })
                        setValidated(false);
                    } else {
                        ToastComponent('error');
                    }
                } catch (error) {
                    console.log(error);
                    ToastComponent('error');
                }
            }
        }
    }

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form-egreso">
                    <Card.Header className="title-form" >Registre el gasto realizado</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Eligue el proyecto">
                                    <Form.Select onChange={handleChangeForm} name="id_proyecto" value={egreso.id_proyecto} required >
                                        <option value=""> </option>
                                        {
                                            proyectos.map((proyecto) => (
                                                <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                                                    {proyecto.id_proyecto}
                                                </option>
                                            ))
                                        }
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Analisis de Costo">
                                    <Form.Select onChange={handleChangeForm} name="id_analisis_costo" value={egreso.id_analisis_costo} required >
                                        <option value=""></option>
                                        {analisisCostos.map((analisisCosto) => (
                                            proyectos.map((proyecto) => (
                                                egreso.id_proyecto === proyecto.id_proyecto && analisisCosto.id_centro_costo === proyecto.id_centro_costo &&
                                                <option key={analisisCosto.id_analisis_costo} value={analisisCosto.id_analisis_costo}>
                                                    {analisisCosto.analisis_costo}
                                                </option>
                                            ))
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            {showDAC &&
                                <Form.Group className="mb-3" >
                                    <FloatingLabel label="Detalle del Analisis de Costo">
                                        <Form.Select onChange={handleChangeForm} name="id_detalle_ac" value={egreso.id_detalle_ac} required>
                                            <option value=""></option>
                                            {analisisCostos.map((analisisCosto) => (
                                                egreso.id_analisis_costo == analisisCosto.id_analisis_costo &&
                                                detalleAC.map((detalleac) => (
                                                    detalleac.id_analisis_costo == analisisCosto.id_analisis_costo &&
                                                    <option key={detalleac.id_detalle_ac} value={detalleac.id_detalle_ac}>
                                                        {detalleac.detalle_ac}
                                                    </option>
                                                ))
                                            ))}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Forma en que se realizo el pago">
                                    <Form.Select onChange={handleChangeForm} name="id_forma_pago" value={egreso.id_forma_pago} required>
                                        <option value=""></option>
                                        {formasPagos.map((formaPago) => (
                                            <option key={formaPago.id_forma_pago} value={formaPago.id_forma_pago}>
                                                {formaPago.forma_pago}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Fecha Del Pago">
                                    <Form.Control onChange={handleChangeForm} name="fecha_pago" type="date" value={egreso.fecha_pago} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Importe">
                                    <Form.Control onChange={handleChangeForm} name="valor_pago" type="number" value={egreso.valor_pago} required />
                                </FloatingLabel>
                            </Form.Group>
                            {showCuotas &&
                                <Form.Group className="mb-3" >
                                    <FloatingLabel label="Cantidad de cuotas">
                                        <Form.Select onChange={handleChangeForm} name="cuota">
                                            <option></option>
                                            <option value={1}>1 Cuota</option>
                                            <option value={3}>3 Cuotas</option>
                                            <option value={6}>6 Cuotas</option>
                                            <option value={9}>9 Cuotas</option>
                                            <option value={12}>12 Cuotas</option>
                                            <option value={16}>16 Cuotas</option>
                                            <option value={18}>18 Cuotas</option>
                                            <option value={24}>24 Cuotas</option>
                                            <option value={30}>30 Cuotas</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            {showFechaDif &&
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Fecha Diferido">
                                        <Form.Control onChange={handleChangeForm} name="fecha_diferido_pago" type="date" value={egreso.fecha_diferido_pago} required />
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            {showDetalleAC &&
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Detalle de Analisis de Costo">
                                        <Form.Control onChange={handleChangeForm} name="observaciones" type="text" value={egreso.observaciones} required />
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            {showDetalleFP &&
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Detalle de Forma de Pago">
                                        <Form.Control onChange={handleChangeForm} name="observaciones" type="text" value={egreso.observaciones} required />
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            <Form.Group className="mb-3">
                                <Form.Label className="label-title">Comprobante de Pago</Form.Label>
                                <Row key={`inline-radio`} className="check">
                                    <Col xs={4} sm={4} >
                                        <Form.Check inline onChange={handleChangeForm} label="Factura" name="comprobante" value="Factura" type="radio" required />
                                    </Col>
                                    <Col xs={8} sm={8} >
                                        <Form.Check inline onChange={handleChangeForm} label="Comprobante de Pago" name="comprobante" value="Comprobante de Pago" type="radio" required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={4} sm={4}>
                                        <FloatingLabel label="Tipo">
                                            <Form.Select onChange={handleChangeForm} name="id_comprobante_pago" value={egreso.id_comprobante_pago} required >
                                                <option value=""> </option>
                                                {
                                                    comprobantePago.map((comprobante) => (
                                                        egreso.comprobante === comprobante.nombre_comprobante &&
                                                        <option key={comprobante.id_comprobante_pago} value={comprobante.id_comprobante_pago}>
                                                            {comprobante.tipo_comprobante}
                                                        </option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={8} sm={8}>
                                        <FloatingLabel controlId="floatingInputGrid" label="N°">
                                            <Form.Control onChange={handleChangeForm} name="numero_comprobante" type="number" value={egreso.numero_comprobante} required />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Button className="button-submit" variant="primary" type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default React.memo(FormEgresos)
