import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';

import { useUser } from '../../../hooks/useUser';
import { login } from '../../../services/apiAuth';

import './Home.css';
import { ToastComponent } from '../../../hooks/useUtils';

const Home = () => {
    const history = useHistory();
    const { loginContext } = useUser();
    const [data, setData] = useState({
        correo: '',
        password: ''
    });

    const handleChange = async (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value

        const loginInfo = prevData => ({
            ...prevData,
            [targetName]: targetValue
        });
        
        setData(loginInfo);
    }

    const loginPost = async (e) => {
        try {
            const userResponse = await login(data);

            const segCookie = 60*60*24*6;
            
            if (userResponse.token) {
                window.localStorage.setItem('loggedAppUser', JSON.stringify(userResponse));
                document.cookie= 'loggedAppUser=existo; max-age='+segCookie+';';

                loginContext(userResponse);

                history.push("/");
            } else {
                ToastComponent('error',userResponse);
                console.log('Error');
            }
        } catch (error) {
            ToastComponent('error','Error al intentar ingresar');
            console.log(error);
        }
    }
    
    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card">
                    <Card.Header className="title-form">Ingrese su E-Mail y Contraseña</Card.Header>
                    <Card.Body>
                        <FloatingLabel controlId="floatingInput" label="E-mail" className="mb-3">
                            <Form.Control onChange={handleChange} name="correo" type="email" value={data.correo} placeholder="nombre@gmail.com" />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Contraseña">
                            <Form.Control onChange={handleChange} name="password" type="password" value={data.password} placeholder="Password" />
                        </FloatingLabel>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        <Button type="submit" onClick={loginPost}> Ingresar </Button>
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    )
}

export default React.memo(Home);
