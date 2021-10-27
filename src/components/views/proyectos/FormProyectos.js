import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';

//Servicios
import { insertProyecto } from '../../../services/apiProyectos';

//Hooks
import { useGetCentroCosto } from '../../../hooks/useCentroCosto';
import { useGetUnidadNegocio } from '../../../hooks/useUnidadNegocio';
import { useGetCliente } from '../../../hooks/useCliente';

/* Traer cc, un, clientes*/

const FormProyectos = () => {
    const { centroCosto } = useGetCentroCosto();
    const { unidadNegocio } = useGetUnidadNegocio();
    const { cliente } = useGetCliente();

    const [ proyecto, setProyecto ] = useState({
        id_centro_costo: '',
        id_unidad_negocio: '',
        id_cliente: '',
        costo: '',
        venta: '',
        fecha_i_proyecto: new Date().toISOString().slice(0, 10),
        fecha_f_proyecto: '',
        id_estado: '1'
    })

    const handleChangeForm = (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value
        
        console.log(targetName+' - '+targetValue)
        setProyecto(prevProyecto => ({
            ...prevProyecto,
            [targetName]: targetValue
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resProyecto = await insertProyecto(proyecto);

            console.log(resProyecto);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form-ingreso">
                    <Card.Header className="title-form" >Registre el ingreso</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Nombra al proyecto">
                                    <Col sm={3} >
                                        <Form.Select onChange={handleChangeForm} name="id_centro_costo" >
                                            <option value={proyecto.id_centro_costo}> </option>
                                            {
                                                centroCosto.map((centro_costo) => (
                                                    <option key={centro_costo.id_centro_costo} value={centro_costo.id_centro_costo}>
                                                        {centro_costo.siglas_cc}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Select onChange={handleChangeForm} name="id_unidad_negocio" >
                                            <option value={proyecto.id_unidad_negocio}> </option>
                                            {
                                                unidadNegocio.map((unidad_negocio) => (
                                                    <option key={unidad_negocio.id_unidad_negocio} value={unidad_negocio.id_unidad_negocio}>
                                                        {unidad_negocio.siglas_uc}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Col>
                                    <Col sm={7}>
                                        <Form.Select onChange={handleChangeForm} name="id_cliente" >
                                            <option value={proyecto.id_cliente}> </option>
                                            {
                                                cliente.map((cliente) => (
                                                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                                        {cliente.nombre_cliente}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Col>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Costo">
                                    <Form.Control onChange={handleChangeForm} name="costo" type="number" value={proyecto.costo} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Venta">
                                    <Form.Control onChange={handleChangeForm} name="venta" type="number" value={proyecto.venta} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Fecha de Inicio del Proyecto">
                                    <Form.Control onChange={handleChangeForm} name="fecha_i_proyecto" type="date" value={proyecto.fecha_i_proyecto} />
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
    )
}

export default React.memo(FormProyectos);