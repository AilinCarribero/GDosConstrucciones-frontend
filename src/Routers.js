import React from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

//Views Components
import Home from './components/views/home/Home';
import FormEgresos from './components/views/egresos/FormEgresos';
import { useUser } from './hooks/useUser';
import NavbarComponent from './components/marco/navbar/Navbar';
import Proyectos from './components/views/proyectos/Proyectos';

const Routers = () => {
    const { user } = useUser();
    console.log(user);

    return (
        <BrowserRouter>
            <NavbarComponent />
            <Container>
                <Route exact path="/" render={() => {
                    return (
                        user.token
                            ? (user.rango == 'admin'
                                ? <Proyectos />
                                : <FormEgresos />)
                            :
                            <Home />
                    )
                }} />

                {
                    user.rango == 'admin' ? 
                        <>
                            <Route exact path="/ingresar/egreso" component={FormEgresos} />
                        </>
                        : 
                        <Redirect to="/" /> 
                }
            </Container>

        </BrowserRouter>
    )
}

export default Routers;