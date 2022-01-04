import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

//Views Components
import Home from './components/views/home/Home';
import FormEgresos from './components/views/egresos/FormEgresos';
import FormIngresos from './components/views/ingresos/FormIngresos';
import NavbarComponent from './components/marco/navbar/Navbar';
import Proyectos from './components/views/proyectos/Proyectos';
import FormProyectos from './components/views/proyectos/FormProyectos';
import FormUsuarios from './components/views/usuarios/FormUsuarios';
import Usuarios from './components/views/usuarios/Usuarios';
import Egresos from './components/views/egresos/Egresos';
import Ingresos from './components/views/ingresos/Ingresos';

//Hooks
import { useUser } from './hooks/useUser';

//Contexts
//import ProyectoProvider from './contexts/ProyectosProvider';

const Routers = () => {
    const { user } = useUser();

    return (
        <BrowserRouter>
                <NavbarComponent />
                <Container fluid>
                    <Route exact path="/" render={() => {
                        return (user.token
                            ? (user.rango == 'admin' || user.rango == 'moderador'
                                ? <> <Proyectos /> </>
                                : <FormEgresos />)
                            :
                            <Home />
                        )
                    }} />

                    {
                        user.rango == 'admin' &&
                        <>
                            <Route exact path="/ingresar/egreso" component={FormEgresos} />
                            <Route exact path="/ingresar/ingreso" component={FormIngresos} />
                            <Route exact path="/ingresar/proyecto" component={FormProyectos} />
                            <Route exact path="/ingresar/usuario" component={FormUsuarios} />
                            <Route exact path="/usuarios" component={Usuarios} />
                            <Route exact path="/egresos/:id" component={Egresos} />
                            <Route exact path="/ingresos/:id" component={Ingresos} />
                        </>
                    }
                    {
                        user.rango == 'moderador' &&
                        <>
                            <Route exact path="/ingresar/egreso" component={FormEgresos} />
                            <Route exact path="/ingresar/ingreso" component={FormIngresos} />
                            <Route exact path="/egresos/:id" component={Egresos} />
                            <Route exact path="/ingresos/:id" component={Ingresos} />
                        </>
                    }
                </Container>
        </BrowserRouter>
    )
}

export default Routers;