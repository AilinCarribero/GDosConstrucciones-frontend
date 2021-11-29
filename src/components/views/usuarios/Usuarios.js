import React from "react";
import { Row, Table, Col, Button } from 'react-bootstrap';

//Hooks
import { useGetUser } from "../../../hooks/useUser";

//Css
import './Usuarios.css';
import * as Icons from 'react-bootstrap-icons';

const Usuarios = () => {
    const { user } = useGetUser();
    
    return (<>
        <Row>
            <Table striped bordered hover size="sm" className="table-user">
                <thead>
                    <tr>
                        <th>Nombre y Apellido</th>
                        <th>E-mail</th>
                        <th>Rango</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {user.length > 0 ?
                        user.map(usuario => (
                            <tr key={usuario.id_user} >
                                <td>{usuario.nombre_apellido}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.rango}</td>
                                <td>
                                    <Row>
                                        <Col xs={6} md={6}>
                                            <Button className="button-accion">
                                                <Icons.Pen color="black"/>
                                            </Button>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <Button className="button-accion">
                                                <Icons.Trash color="black"/>
                                            </Button>
                                        </Col>
                                    </Row>
                                </td>
                            </tr>
                        ))
                        : <tr>
                            <td colSpan="2">No existen usuarios</td>
                            <td colSpan="2">Agregar icono de alerta</td>
                        </tr>
                    }
                </tbody>
            </Table>
        </Row>
    </>)
}

export default React.memo(Usuarios);