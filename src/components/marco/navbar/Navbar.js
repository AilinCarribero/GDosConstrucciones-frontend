import React, { useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useUser } from '../../../hooks/useUser';
import Sidenav from '../sidenav/Sidenav';

import './Navbar.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const NavbarComponent = () => {
    const { logout, user } = useUser();

    const renderLogaut = () => {
        console.log(user)
        if(user.token ) {
            return (
                <Nav.Link className="botton-sesion" onClick={logout} to="/">Cerrar sesión</Nav.Link> 
            )
        } 
    }

    useEffect(() => {
        renderLogaut();
        //eslint-disable-next-line
    }, [user])

    return (<>
        <Navbar className="navbar" bg="dark">
            { user.rango === 'admin' ? <Sidenav /> : '' }
            <Container>
                <Navbar.Brand href="/">
                    <img src="/" width="30" height="30" className="d-inline-block align-top text-color" alt="GDos Construcciones"/>
                </Navbar.Brand>
                {renderLogaut()}
            </Container>
        </Navbar>
    </>)
}
export default NavbarComponent;