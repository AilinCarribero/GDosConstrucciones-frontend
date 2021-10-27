import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';

import './Ingresos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Hooks
import { useGetFormasCobro } from '../../../hooks/useFormasCobro';
import { useGetProyectos } from '../../../hooks/useProyectos';
import { useUser } from '../../../hooks/useUser';

//Servicios
import { insertIngreso } from '../../../services/apiIngresos';

const FormIngresos = () => {
    const { user } = useUser();
    const newDate = new Date();
    const año = newDate.getFullYear();
    const dia = newDate.getDate();

    //Datos extraidos desde la api para usarse en el formulario
    const { formasCobro } = useGetFormasCobro();
    const { proyectos } = useGetProyectos();

    const [ingreso, setIngreso] = useState({
        id_user: user.id,
        fecha_cobro: new Date().toISOString().slice(0, 10),
        id_proyecto: '',
        valor_cobro: '',
        fecha_diferido_cobro: '',
        observaciones: '',
    })

    //Eventos para mostrar partes del formulario
    const [showFC, setShowFC] = useState(false);
    const [showCuotas, setShowCuotas] = useState(false);
    const [showFechaDif, setShowFechaDif] = useState(false);
    const [showDetalle, setShowDetalle] = useState(false);
    /* Traer:
            -proyectos
            -formas de cobro
    */

    const handleChangeForm = (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value

        setIngreso(prevIngreso => ({
            ...prevIngreso,
            [targetName]: targetValue
        }))
        
        //Si se selecciono un proyecto mostrar el select de formasCobro
        if(targetName === 'proyecto'){
            setShowFC( showFC ? false : true);
        }

        //Si se selecciono una forma de cobro y...
        if (targetName === 'id_forma_cobro') {
            formasCobro.forEach((formaCobro) => {
                if(formaCobro.id_forma_cobro == targetValue) {
                    /* La forma de cobro mediante tarjeta de credito se maneja diferente al resto */
                    setShowCuotas(formaCobro.forma_cobro === 'Tarjeta de Credito' ? true : false) //... es tarjeta de credito se debe mostrar la seleccion de cuotas
                    setShowFechaDif(formaCobro.requiere_f_cobro === 1 && formaCobro.forma_cobro !== 'Tarjeta de Credito' ? true : false) //... requiere una fecha diferente a la actual mostrar otro campo de fecha
                    setShowDetalle(formaCobro.requiere_d_cobro === 1 && formaCobro.forma_cobro !== 'Tarjeta de Credito' ? true : false)//... requiere un detalle se debe mostrar un input text
                }
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auxIngreso = [];

        /*En caso de tener cuotas el valor del importe debe dividirse en partes iguales acorde a la cantidad de cuotas seleccionadas 
        y se debera diferir cada cuota a 30 dias despues de la siguiente */
        if (ingreso.cuota > 0) {
            const valorCuota = ingreso.valor_cobro ? ingreso.valor_cobro / ingreso.cuota : 0;
            
            if (valorCuota !== 0) {
                for (let i = 0; i < ingreso.cuota; i++) {
                    const mesD = newDate.getMonth() + i + 1
                    auxIngreso[i] = {
                        ...ingreso,
                        cuotaNumero: i,
                        valor_cobro: valorCuota,
                        fecha_diferido_pago: new Date(año, mesD, dia).toISOString().slice(0, 10)
                    }

                    try {
                        const ingresoRes = await insertIngreso(auxIngreso[i]);

                        console.log(ingresoRes);
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        } else {
            //Si no hay cuotas el proceso de guardado es normal
            try {
                const ingresoRes = await insertIngreso(ingreso);

                console.log(ingresoRes);
            } catch (error) {
                console.log(error);
            }
        }

        //En caso de tener algun elemento extra mostrandose se vuelve a ocular
        if (showCuotas === true) setShowCuotas(false);
        if (showDetalle === true) setShowDetalle(false);
        if (showFechaDif === true) setShowFechaDif(false);

        //Los campos se vacian 
        setIngreso({
            id_user: user.id,
            fecha_cobro: new Date().toISOString().slice(0, 10),
            id_proyecto: '',
            valor_cobro: '',
            fecha_diferido_cobro: '',
            observaciones: '',
        })
    }

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form-ingreso">
                    <Card.Header className="title-form" >Registre el ingreso</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Eligue el proyecto">
                                    <Form.Select onChange={handleChangeForm} name="id_proyecto" >
                                        <option value={ingreso.id_proyecto}> </option>
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
                                <FloatingLabel label="Forma en que se realizo el ingreso">
                                    <Form.Select onChange={handleChangeForm} name="id_forma_cobro">
                                        <option value={ingreso.id_forma_cobro}></option>
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
                                    <Form.Control onChange={handleChangeForm} name="fecha_cobro" type="date" value={ingreso.fecha_cobro} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Importe">
                                    <Form.Control onChange={handleChangeForm} name="valor_cobro" type="number" value={ingreso.valor_cobro} />
                                </FloatingLabel>
                            </Form.Group>
                            {showCuotas &&
                                <Form.Group className="mb-3" >
                                    <FloatingLabel label="Cantidad de cuotas">
                                        <Form.Select onChange={handleChangeForm} name="cuota">
                                            <option></option>
                                            <option value={1}>1 Cuota</option>
                                            <option value={3}>3 Cuota</option>
                                            <option value={6}>6 Cuota</option>
                                            <option value={9}>9 Cuota</option>
                                            <option value={12}>12 Cuota</option>
                                            <option value={16}>16 Cuota</option>
                                            <option value={18}>18 Cuota</option>
                                            <option value={24}>24 Cuota</option>
                                            <option value={30}>30 Cuota</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            {showFechaDif &&
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Fecha Diferido">
                                        <Form.Control onChange={handleChangeForm} name="fecha_diferido_cobro" type="date" value={ingreso.fecha_diferido_cobro} />
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            {showDetalle &&
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Detalle">
                                        <Form.Control onChange={handleChangeForm} name="observaciones" type="text"/>
                                    </FloatingLabel>
                                </Form.Group>
                            }

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

export default React.memo(FormIngresos);