import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';
//Servicios
import { insertProyecto } from '../../../services/apiProyectos';

//Hooks
import { useGetCentroCosto } from '../../../hooks/useCentroCosto';
import { useGetUnidadNegocio } from '../../../hooks/useUnidadNegocio';
import { ToastComponent } from '../../../hooks/useUtils';

//Css
import './Proyectos.css'

const FormProyectos = () => {
    const newDate = new Date();
    const año = newDate.getFullYear();
    const mes = newDate.getMonth();
    const dia = newDate.getDate();

    const { centroCosto } = useGetCentroCosto();
    const { unidadNegocio } = useGetUnidadNegocio();

    const [showCostoVenta, setShowCostoVenta] = useState(false);
    const [ validated, setValidated ] = useState(false);

    const [proyecto, setProyecto] = useState({
        id_centro_costo: '',
        id_unidad_negocio: '',
        cliente: '',
        costo: '',
        venta: '',
        fecha_i_proyecto: new Date().toISOString().slice(0, 10),
        fecha_f_proyecto: '',
        id_estado: '1'
    })

    const handleChangeForm = (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value
        
        setProyecto(prevProyecto => ({
            ...prevProyecto,
            [targetName]: targetValue
        }))

        targetName == 'id_centro_costo' && setShowCostoVenta(targetValue == 2 ? true : false);
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        let auxProyecto = {};

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        } 
        setValidated(true);

        if(form.checkValidity() === true){
            if(!proyecto.fecha_f_proyecto){
                    auxProyecto = {
                      ...proyecto,
                      fecha_f_proyecto: new Date(3000, mes, dia).toISOString().slice(0, 10)
                   }
                } else {
                    auxProyecto = {...proyecto}
                }
            
            try {
                const resProyecto = await insertProyecto(auxProyecto);
                
                if(resProyecto.data.todoOk == 'Ok'){
                    ToastComponent('success');
                    
                    setProyecto({
                        id_centro_costo: '',
                        id_unidad_negocio: '',
                        cliente: '',
                        costo: '',
                        venta: '',
                        fecha_i_proyecto: new Date().toISOString().slice(0, 10),
                        fecha_f_proyecto: '',
                        id_estado: '1'
                    });
                    setValidated(false);
                } else {
                    ToastComponent('error');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (<>
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form-proyectos mobile-form-proyecto">
                    <Card.Header className="title-form" >Ingrese un Nuevo Proyecto</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmitForm} >
                            <Form.Group className="mb-3" >
                                <Form.Label className="label-title-proyecto">Nombre del Proyecto</Form.Label>
                                <Row>
                                    <Col sm={6} >
                                        <FloatingLabel label="C.C.">
                                            <Form.Select onChange={handleChangeForm} name="id_centro_costo" value={proyecto.id_centro_costo} required >
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
                                    </Col>
                                    <Col sm={6}>
                                        <FloatingLabel label="U.N.">
                                            <Form.Select onChange={handleChangeForm} name="id_unidad_negocio" value={proyecto.id_unidad_negocio} required >
                                                <option value="" > </option>
                                                {
                                                    unidadNegocio.map((unidad_negocio) => (
                                                        <option key={unidad_negocio.id_unidad_negocio} value={unidad_negocio.id_unidad_negocio}>
                                                            {unidad_negocio.unidad_negocio}
                                                        </option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <FloatingLabel label="Cliente">
                                            <Form.Control onChange={handleChangeForm} name="cliente" type="text" value={proyecto.cliente}/>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Form.Group>
                            {showCostoVenta && <>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Costo">
                                        <Form.Control onChange={handleChangeForm} name="costo" type="number" value={proyecto.costo} required />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Venta">
                                        <Form.Control onChange={handleChangeForm} name="venta" type="number" value={proyecto.venta} required />
                                    </FloatingLabel>
                                </Form.Group>
                            </>}
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Fecha de Inicio del Proyecto">
                                    <Form.Control onChange={handleChangeForm} name="fecha_i_proyecto" type="date" value={proyecto.fecha_i_proyecto} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Fecha de Finalización del Proyecto">
                                    <Form.Control onChange={handleChangeForm} name="fecha_f_proyecto" type="date" value={proyecto.fecha_f_proyecto} />
                                </FloatingLabel>
                            </Form.Group>
                            <Button className="button-submit" variant="primary" type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>)
}

export default React.memo(FormProyectos);
