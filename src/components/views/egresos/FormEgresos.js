import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

//Hooks
import { useGetFormasPagos } from '../../../hooks/useFormasPagos';
import { useGetProyectos } from '../../../hooks/useProyectos';
import { useGetAnalisisCostos, useDetalleAnalisisCosto } from '../../../hooks/useAnalisisCostos';
import { useUser } from '../../../hooks/useUser';
import { useGetComprobantesPago } from '../../../hooks/useComprobantePago';
import { ToastComponent } from '../../../hooks/useUtils';
import { useGetCentroCosto } from '../../../hooks/useCentroCosto';

//Servicios
import { insertEgreso } from '../../../services/apiEgresos';

//Componentes
import ValidacionEgreso from '../../utils/modal/validacion/ValidacionEgreso';

//Css
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
    const { centroCosto } = useGetCentroCosto();

    //Datos a enviarse a la api para ingresar/modificar egresos
    const [egreso, setEgreso] = useState({
        id_user: user.id,
        fecha_pago: new Date().toISOString().slice(0, 10),
        id_proyecto: '',
        valor_pago: 0,
        valor_usd: 0,
        id_forma_pago: '',
        fecha_diferido_pago: '',
        observaciones: '',
        id_comprobante_pago: '',
        numero_comprobante: '',
        centro_costo: ''
    });

    //Envio para modal de validacion
    const [datosValidacion, setDatosValidacion] = useState([]);
    const [auxEgresos, setAuxEgresos] = useState([]);

    //Checks
    const [checkUSD, setCheckUSD] = useState(0);
    const [checkComprobante, setCheckComprobante] = useState();

    //Eventos para mostrar partes del formulario
    const [showProyecto, setShowProyecto] = useState(false);
    const [showAC, setShowAC] = useState(false);
    const [showDAC, setShowDAC] = useState(false);
    const [showCuotas, setShowCuotas] = useState(false);
    const [showFechaDif, setShowFechaDif] = useState(false);
    const [showModal, setShowModal] = useState(false);

    //Variables para validacion
    const [validated, setValidated] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value
        //const targetType = e.target.type;
        const targetCheck = e.target.checked;

        //console.log(targetName + ' - ' + targetValue + ' - ' + targetType + ' - ' + targetCheck)

        if (targetCheck) {
            if (targetName == 'moneda') {
                setCheckUSD(targetValue);
                setEgreso(prevEgreso => ({
                    ...prevEgreso,
                    valor_pago: 0,
                    valor_usd: 0
                }))
            } else {
                setCheckComprobante(targetValue);
                setEgreso(prevEgreso => ({
                    ...prevEgreso,
                    [targetName]: targetValue
                }))
            }
        } else {
            setEgreso(prevEgreso => ({
                ...prevEgreso,
                [targetName]: targetValue
            }))
        }

        //Si se selecciono un centro de costo mostrar el select de proyectos
        if (targetName === 'centro_costo') {
            setShowProyecto(true);
        }

        //Si se selecciono un proyecto mostrar el select de analisisCostos
        if (targetName === 'id_proyecto') {
            setShowAC(true);
        }

        //Si se selecciono analisis costos y ...
        if (targetName === 'id_analisis_costo') {
            analisisCostos.forEach((analisisCosto) => {
                if (analisisCosto.id_analisis_costo == targetValue) {
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
                }
            })
        }
    }

    const handleValidacion = (e) => {
        e.preventDefault();
        const auxEgreso = [];

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            /*En caso de tener cuotas el valor del importe debe dividirse en partes iguales acorde a la cantidad de cuotas 
            seleccionadas y se debera diferir cada cuota a 30 dias despues de la siguiente */
            if (egreso.cuota > 0) {
                let auxCuotaValor = egreso.valor_pago.toString();
                auxCuotaValor = auxCuotaValor.replace(/\./g, '');
                auxCuotaValor = auxCuotaValor.replace(/\,/g, '.');
                auxCuotaValor = parseFloat(auxCuotaValor);

                const valorCuota = egreso.valor_pago ? auxCuotaValor / egreso.cuota : 0;

                if (valorCuota !== 0) {
                    for (let i = 0; i < egreso.cuota; i++) {
                        const mesD = newDate.getMonth() + i + 1;

                        auxEgreso[i] = {
                            ...egreso,
                            cuotaNumero: i,
                            valor_pago: valorCuota,
                            fecha_diferido_pago: new Date(año, mesD, dia).toISOString().slice(0, 10)
                        }
                    }
                }
                setAuxEgresos(auxEgreso);
                setDatosValidacion(auxEgreso);
                setShowModal(true);
            } else {
                //Si no hay cuotas el proceso de guardado es normal
                setDatosValidacion(egreso);
                setShowModal(true);
            }
        }
    }

    const handleSubmit = async () => {
        let resEgreso = [];

        if (auxEgresos.length > 0) {
            try {
                resEgreso = await insertEgreso(auxEgresos);
            } catch (error) {
                console.log(error);
                ToastComponent('error');
            }
        } else {
            try {
                if (!egreso.id_comprobante_pago) {
                    egreso.id_comprobante_pago = 6;
                }

                if (egreso.fecha_diferido_pago) {
                    resEgreso = await insertEgreso(egreso);
                } else {
                    egreso.fecha_diferido_pago = '0000-00-00';

                    resEgreso = await insertEgreso(egreso);
                }
            } catch (error) {
                console.log(error);
                ToastComponent('error');
            }
        }

        if (resEgreso.data.todoOk == 'Ok') {
            ToastComponent('success');

            //En caso de tener algun elemento extra mostrandose se vuelve a ocular
            showCuotas && setShowCuotas(false);
            showFechaDif && setShowFechaDif(false);
            showDAC && setShowDAC(false);
            showAC && setShowDAC(false);
            showProyecto && setShowProyecto(false);

            //Los campos se vacian 
            setEgreso({
                id_user: user.id,
                fecha_pago: new Date().toISOString().slice(0, 10),
                id_proyecto: '',
                valor_pago: 0,
                valor_usd: 0,
                id_forma_pago: '',
                fecha_diferido_pago: '',
                observaciones: '',
                id_comprobante_pago: egreso.id_comprobante_pago,
                numero_comprobante: '',
                centro_costo: ''
            })
            setValidated(false);
            setDatosValidacion([]);
            setAuxEgresos([]);
            setCheckUSD(0);
            setCheckComprobante();
        } else {
            ToastComponent('error');
        }
    }

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form-egreso mobile-form-egreso">
                    <Card.Header className="title-form" >Registre el gasto realizado</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleValidacion} >
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Eligue el tipo de Centro de Costo">
                                    <Form.Select onChange={handleChangeForm} name="centro_costo" value={egreso.centro_costo} required >
                                        <option value=""> </option>
                                        {
                                            centroCosto.map((centro_costo) => (
                                                <option key={centro_costo.id_centro_costo} value={centro_costo.id_centro_costo}>
                                                    {centro_costo.tipo_centro_costo}
                                                </option>
                                            ))
                                        }
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            {showProyecto &&
                                <Form.Group className="mb-3" >
                                    <FloatingLabel label="Eligue el proyecto">
                                        <Form.Select onChange={handleChangeForm} name="id_proyecto" value={egreso.id_proyecto} required >
                                            <option value=""> </option>
                                            {
                                                proyectos.filter(filterProyecto => filterProyecto.id_centro_costo == egreso.centro_costo)
                                                    .map((proyecto) => (
                                                        <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                                                            {proyecto.id_proyecto}
                                                        </option>
                                                    ))
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            {showAC &&
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
                            }
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
                                <Row key={`inline-radio`} className="check">
                                    <Col xs={4} sm={4} >
                                        <Form.Check inline onChange={handleChangeForm} label="ARG$" name="moneda" value="0" type="radio" checked={checkUSD == '0'} />
                                    </Col>
                                    <Col xs={8} sm={8} >
                                        <Form.Check inline onChange={handleChangeForm} label="USD$" name="moneda" value="1" type="radio" checked={checkUSD == '1'} />
                                    </Col>
                                </Row>
                                <FloatingLabel label="Importe">
                                    <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                        onChange={handleChangeForm} name={checkUSD == 0 ? "valor_pago" : "valor_usd"} value={checkUSD == 0 ? egreso.valor_pago : egreso.valor_usd} required />
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
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Detalle">
                                    <Form.Control onChange={handleChangeForm} name="observaciones" type="text" value={egreso.observaciones} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="label-title">Comprobante de Pago</Form.Label>
                                <Row key={`inline-radio`} className="check">
                                    <Col xs={4} sm={4} >
                                        <Form.Check inline onChange={handleChangeForm} label="Factura" name="comprobante" value="Factura" type="radio" checked={checkComprobante == 'Factura'} />
                                    </Col>
                                    <Col xs={8} sm={8} >
                                        <Form.Check inline onChange={handleChangeForm} label="Comprobante de Pago" name="comprobante" value="Comprobante de Pago" type="radio" checked={checkComprobante == 'Comprobante de Pago'} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={4} sm={4}>
                                        <FloatingLabel label="Tipo">
                                            <Form.Select onChange={handleChangeForm} name="id_comprobante_pago" value={egreso.id_comprobante_pago} >
                                                <option value=""> </option>
                                                {
                                                    comprobantePago.map((comprobante) => (
                                                        egreso.comprobante == comprobante.nombre_comprobante &&
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
                                            <Form.Control onChange={handleChangeForm} name="numero_comprobante" type="number" value={egreso.numero_comprobante} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Form.Group>

                            {showModal == true &&
                                <ValidacionEgreso mostrar={showModal} datos={datosValidacion} pago={formasPagos} comprobantes={comprobantePago} analisisCostos={analisisCostos} detallesAC={detalleAC} setShow={setShowModal} setSubmit={handleSubmit} usd={checkUSD} />
                            }

                            <Button className="button-submit" variant="dark" type="submit">
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
