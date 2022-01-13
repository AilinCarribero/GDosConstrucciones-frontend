import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

//Hooks
import { useGetFormasCobro } from '../../../hooks/useFormasCobro';
import { useGetProyectos } from '../../../hooks/useProyectos';
import { useUser } from '../../../hooks/useUser';
import { ToastComponent } from '../../../hooks/useUtils';
import { useGetCentroCosto } from '../../../hooks/useCentroCosto';

//Servicios
import { insertIngreso } from '../../../services/apiIngresos';

//Componentes
import ValidacionIngreso from '../../utils/modal/validacion/ValidacionIngreso';

//Cass
import './Ingresos.css';

const FormIngresos = () => {
    const { user } = useUser();
    const newDate = new Date();
    const año = newDate.getFullYear();
    const dia = newDate.getDate();

    //Datos extraidos desde la api para usarse en el formulario
    const { formasCobro } = useGetFormasCobro();
    const { proyectos } = useGetProyectos();
    const { centroCosto } = useGetCentroCosto();

    //Datos a enviarse a la api para ingresar/modificar ingresos
    const [ingreso, setIngreso] = useState({
        id_user: user.id,
        fecha_cobro: new Date().toISOString().slice(0, 10),
        id_proyecto: '',
        valor_cobro: 0,
        valor_usd: 0,
        fecha_diferido_cobro: '',
        observaciones: '',
        centro_costo: ''
    })

    //Variables con infomacion
    const [cantCheque, setCantCheque] = useState(0);
    const [cheques, setCheques] = useState();
    const [datosValidacion, setDatosValidacion] = useState([]);
    const [auxIngresos, setAuxIngresos] = useState([]);

    //Checks
    const [checkUSD, setCheckUSD] = useState(0);

    //Eventos para mostrar partes del formulario
    const [showProyecto, setShowProyecto] = useState(false);
    const [showFC, setShowFC] = useState(false);
    const [showCuotas, setShowCuotas] = useState(false);
    const [showFechaDif, setShowFechaDif] = useState(false);
    //const [showDetalle, setShowDetalle] = useState(false);
    const [showCheque, setShowCheque] = useState(false);
    const [showDataCheques, setShowDataCheques] = useState(false);
    const [showModal, setShowModal] = useState(false);

    //Variables para la validacion
    const [validated, setValidated] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetType = e.target.type;
        const targetCheck = e.target.checked;

        if (targetName == 'cantCheque') {
            setCantCheque(targetValue);
            setShowDataCheques(true);
        } else if (targetName.indexOf('fechaD') > -1 || targetName.indexOf('monto') > -1) {
            setCheques(prevCheques => ({
                ...prevCheques,
                [targetName]: targetValue
            }))
        } else if (targetCheck) {
            setCheckUSD(targetValue);
            setIngreso(prevIngreso => ({
                ...prevIngreso,
                valor_cobro: 0,
                valor_usd: 0
            }))
        } else {
            setIngreso(prevIngreso => ({
                ...prevIngreso,
                [targetName]: targetValue
            }))
        }

        //Si se selecciono un centro de costo mostrar el select de proyectos
        if (targetName === 'centro_costo') {
            setShowProyecto(true);
        }

        //Si se selecciono un proyecto mostrar el select de formasCobro
        if (targetName === 'proyecto') {
            setShowFC(true);
        }

        //Si se selecciono una forma de cobro y...
        if (targetName === 'id_forma_cobro') {
            formasCobro.forEach((formaCobro) => {
                if (formaCobro.id_forma_cobro == targetValue) {
                    /* La forma de cobro mediante tarjeta de credito o cheques se maneja diferente al resto */
                    setShowCuotas(formaCobro.forma_cobro === 'Tarjeta de Credito' ? true : false) //... es tarjeta de credito se debe mostrar la seleccion de cuotas
                    setShowCheque(formaCobro.forma_cobro === 'E-Cheq' || formaCobro.forma_cobro === 'C.P.D.' ? true : false);//... si es un cheque debe mostrar un campo para ingresar la cantidad de cheques
                    setShowDataCheques(false);
                    setShowFechaDif(formaCobro.requiere_f_cobro === 1
                        && formaCobro.forma_cobro !== 'Tarjeta de Credito'
                        && formaCobro.forma_cobro !== 'E-Cheq'
                        && formaCobro.forma_cobro !== 'C.P.D.'
                        ? true : false) //... requiere una fecha diferente a la actual mostrar otro campo de fecha
                    /*setShowDetalle(formaCobro.requiere_d_cobro === 1
                        && formaCobro.forma_cobro !== 'Tarjeta de Credito'
                        && formaCobro.forma_cobro !== 'E-Cheq'
                        && formaCobro.forma_cobro !== 'C.P.D.'
                        ? true : false)//... requiere un detalle se debe mostrar un input text*/
                }
            })
        }
    }

    const handleValidacion = (e) => {
        e.preventDefault();
        const auxIngreso = [];

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            /*En caso de tener cuotas el valor del importe debe dividirse en partes iguales acorde a la cantidad 
            de cuotas seleccionadas y se debera diferir cada cuota a 30 dias despues de la siguiente */
            if (ingreso.cuota > 0) {
                let auxCuotaValor = ingreso.valor_cobro.toString();
                auxCuotaValor = auxCuotaValor.replace(/\./g, '');
                auxCuotaValor = auxCuotaValor.replace(/\,/g, '.');
                auxCuotaValor = parseFloat(auxCuotaValor);

                const valorCuota = ingreso.valor_cobro ? auxCuotaValor / ingreso.cuota : 0;

                if (valorCuota !== 0) {
                    for (let i = 0; i < ingreso.cuota; i++) {
                        const mesD = newDate.getMonth() + i + 1;

                        auxIngreso[i] = {
                            ...ingreso,
                            cuotaNumero: i,
                            valor_cobro: valorCuota,
                            fecha_diferido_cobro: new Date(año, mesD, dia).toISOString().slice(0, 10)
                        }
                    }
                    setAuxIngresos(auxIngreso);
                    setDatosValidacion(auxIngreso);
                    setShowModal(true);
                }
            } else if (cheques && cantCheque > 0) {
                /*Si existen cheques entonces guardar en una variable aux los datos de ingreso + los datos del cheque*/
                for (let i = 0; i < cantCheque; i++) {
                    const auxChequeFD = cheques['fechaD' + i];
                    const auxChequeM = cheques['monto' + i];

                    auxIngreso[i] = {
                        ...ingreso,
                        valor_cobro: auxChequeM,
                        fecha_diferido_cobro: auxChequeFD,
                        cheque: i
                    }
                }
                setAuxIngresos(auxIngreso);
                setDatosValidacion(auxIngreso);
                setShowModal(true);
            } else {
                //Si no hay cuotas ni cheques el proceso de guardado es normal
                setDatosValidacion(ingreso);
                setShowModal(true);
            }
        }
    }

    const handleSubmit = async () => {
        let resIngreso = [];

        if (auxIngresos.length > 0) {
            try {
                resIngreso = await insertIngreso(auxIngresos);
            } catch (error) {
                console.log(error);
                ToastComponent('error');
            }
        } else {
            try {
                if (ingreso.fecha_diferido_cobro) {
                    resIngreso = await insertIngreso(ingreso);
                } else {
                    ingreso.fecha_diferido_cobro = '0000-00-00';
                    resIngreso = await insertIngreso(ingreso);
                }
            } catch (error) {
                console.log(error);
                ToastComponent('error');
            }
        }

        if (resIngreso.data.todoOk == 'Ok') {
            ToastComponent('success');

            //En caso de tener algun elemento extra mostrandose se vuelve a ocular
            showCuotas && setShowCuotas(false);
            //showDetalle && setShowDetalle(false);
            showFechaDif && setShowFechaDif(false);
            showDataCheques && setShowDataCheques(false);
            showFC && setShowFC(false);
            showCheque && setShowCheque(false);
            showProyecto && setShowProyecto(false);

            //Los campos se vacian 
            setIngreso({
                id_user: user.id,
                fecha_cobro: new Date().toISOString().slice(0, 10),
                id_proyecto: '',
                valor_cobro: 0,
                valor_usd: 0,
                fecha_diferido_cobro: '',
                observaciones: '',
                centro_costo: ''
            })
            setAuxIngresos([]);
            setCantCheque(0);
            setCheques('');
            setDatosValidacion([]);
            setValidated(false);
            setCheckUSD(0);
        } else {
            ToastComponent('error');
        }
    }

    const dataChequeForm = () => {
        if (showDataCheques == true) {
            let rows = [];
            for (let i = 0; i < cantCheque; i++) {
                rows.push(
                    <Row key={i}>
                        <Col xs={6} sm={6}>
                            <FloatingLabel controlId="floatingInputGrid" label="Fecha Del Cheque">
                                <Form.Control onChange={handleChangeForm} name={"fechaD" + i} type="date" required />
                            </FloatingLabel>
                        </Col>
                        <Col xs={6} sm={6}>
                            <FloatingLabel controlId="floatingInputGrid" label="Monto del Cheque">
                                <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                    onChange={handleChangeForm} name={"monto" + i} required />
                            </FloatingLabel>
                        </Col>
                    </Row>
                )
            }
            return rows
        }
    }

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form-ingreso mobile-form-ingreso">
                    <Card.Header className="title-form" >Registre el ingreso</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleValidacion} >
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Eligue el tipo de Centro de Costo">
                                    <Form.Select onChange={handleChangeForm} name="centro_costo" value={ingreso.centro_costo} required >
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
                                        <Form.Select onChange={handleChangeForm} name="id_proyecto" value={ingreso.id_proyecto} required >
                                            <option value=""> </option>
                                            {
                                                proyectos.filter(filterProyecto => filterProyecto.id_centro_costo == ingreso.centro_costo)
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
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Forma en que se realizo el ingreso">
                                    <Form.Select onChange={handleChangeForm} name="id_forma_cobro" value={ingreso.id_forma_cobro} required >
                                        <option value=""></option>
                                        {formasCobro.map((formaCobro) => (
                                            proyectos.map((proyecto) => (
                                                ingreso.id_proyecto === proyecto.id_proyecto && formaCobro.id_centro_costo === proyecto.id_centro_costo
                                                &&
                                                <option key={formaCobro.id_forma_cobro} value={formaCobro.id_forma_cobro}>
                                                    {formaCobro.forma_cobro}
                                                </option>
                                            ))
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Fecha Del Ingreso">
                                    <Form.Control onChange={handleChangeForm} name="fecha_cobro" type="date" value={ingreso.fecha_cobro} required />
                                </FloatingLabel>
                            </Form.Group>
                            {!showCheque &&
                                <Form.Group className="mb-3">
                                    <Row key={`inline-radio`} className="check">
                                        <Col xs={4} sm={4} >
                                            <Form.Check inline onChange={handleChangeForm} label="ARG$" name="pesos" value="0" type="radio" checked={checkUSD == '0'} />
                                        </Col>
                                        <Col xs={8} sm={8} >
                                            <Form.Check inline onChange={handleChangeForm} label="USD$" name="dolares" value="1" type="radio" checked={checkUSD == '1'} />
                                        </Col>
                                    </Row>
                                    <FloatingLabel label="Importe">
                                        <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                            onChange={handleChangeForm} name={checkUSD == 0 ? "valor_cobro" : "valor_usd"} value={checkUSD == 0 ? ingreso.valor_cobro : ingreso.valor_usd} required />
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            {showCuotas &&
                                <Form.Group className="mb-3" >
                                    <FloatingLabel label="Cantidad de cuotas">
                                        <Form.Select onChange={handleChangeForm} name="cuota" required>
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
                            {showCheque &&
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Cantidad de Cheques">
                                        <Form.Control onChange={handleChangeForm} name="cantCheque" type="number" value={cantCheque} required />
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            {showDataCheques &&
                                <Form.Group className="mb-3">
                                    {dataChequeForm()}
                                </Form.Group>
                            }
                            {showFechaDif &&
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Fecha Diferido">
                                        <Form.Control onChange={handleChangeForm} name="fecha_diferido_cobro" type="date" value={ingreso.fecha_diferido_cobro} />
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Detalle">
                                    <Form.Control onChange={handleChangeForm} name="observaciones" type="text" />
                                </FloatingLabel>
                            </Form.Group>

                            {showModal == true &&
                                <ValidacionIngreso mostrar={showModal} datos={datosValidacion} cobro={formasCobro} setShow={setShowModal} setSubmit={handleSubmit} usd={checkUSD} />
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

export default React.memo(FormIngresos);
