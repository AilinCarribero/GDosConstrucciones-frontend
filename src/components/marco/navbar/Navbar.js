import React, { useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

//Hooks
import { useUser } from '../../../hooks/useUser';

//Componentes
import Sidenav from '../sidenav/Sidenav';

//Css
import './Navbar.css';
import * as Icons from 'react-bootstrap-icons';
import logo from '../../../img/logo.png'

const NavbarComponent = () => {
    const { logout, user } = useUser();

    const renderLogaut = () => {
        if(user.token) {
            return (
                <Nav.Link className="botton-sesion" onClick={logout} to="/"><Icons.DoorOpenFill className="icon-salida" size="25px" /></Nav.Link> 
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
                <Navbar.Brand to="/">
                    <img to="/" src={logo} width="30" height="30" className="d-inline-block align-top text-color img" alt="GDos Construcciones"/>
                </Navbar.Brand>
                {renderLogaut()}
            </Container>
        </Navbar>
    </>)
}
export default NavbarComponent;