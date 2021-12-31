import React, { useState } from "react";
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';

//Hooks
import { ToastComponent } from '../../../hooks/useUtils';

//Servicios
import { insertUser } from "../../../services/apiAuth";

import './Usuarios.css';

const FormUsuarios = () => {
    const [newUser, setNewUser] = useState({
        nombre_apellido: '',
        correo: '',
        contrasegna: '',
        id_rango: ''
    })

    const [validated, setValidated] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value

        setNewUser(prevNewUser => ({
            ...prevNewUser,
            [targetName]: targetValue
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            try {
                const resNewUser = await insertUser(newUser);

                if (resNewUser.todoOk == 'Ok') {
                    ToastComponent('success');

                    setNewUser({
                        nombre_apellido: '',
                        correo: '',
                        contrasegna: '',
                        id_rango: newUser.id_rango
                    })
                    //setChequed('false');
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

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form-user mobile-form-usuario">
                    <Card.Header className="title-form" >Registre un Nuevo Usuario</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInput" label="Nombre y Apellido" className="mb-3">
                                    <Form.Control onChange={handleChangeForm} name="nombre_apellido" type="text" value={newUser.nombre_apellido} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInput" label="E-mail" className="mb-3">
                                    <Form.Control onChange={handleChangeForm} name="correo" type="email" value={newUser.correo} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingPassword" label="Contraseña">
                                    <Form.Control onChange={handleChangeForm} name="contrasegna" type="text" value={newUser.contrasegna} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Permisos de Acceso</Form.Label>
                                <Row key={`inline-radio`} className="check">
                                    <Col xs={4} sm={4} >
                                        <Form.Check inline onChange={handleChangeForm} label="Administrador" name="id_rango" value="1" type="radio" required />
                                    </Col>
                                    <Col xs={8} sm={8} >
                                        <Form.Check inline onChange={handleChangeForm} label="Usuario comun" name="id_rango" value="2" type="radio" required />
                                    </Col>
                                    <Col xs={8} sm={8} >
                                        <Form.Check inline onChange={handleChangeForm} label="Moderador" name="id_rango" value="3" type="radio" required />
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

export default React.memo(FormUsuarios);