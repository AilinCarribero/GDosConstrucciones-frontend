import React, { useEffect } from 'react';
import { Navbar, Container, Nav, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Hooks
import { useUser } from '../../../hooks/useUser';

//Componentes
import Sidenav from '../sidenav/Sidenav';

//Css
import './Navbar.css';
import * as Icons from 'react-bootstrap-icons';
import logo from '../../../img/logowhitev2.png';

const NavbarComponent = () => {
    const { logout, user } = useUser();

    const renderLogaut = () => {
        if(user.token) {
            console.log(user);
            return (<>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text> <b className="text-nombre">{user.nombre_apellido}</b> </Navbar.Text>
                </Navbar.Collapse>
                <Nav.Link className="botton-sesion" onClick={logout} to="/"><Icons.DoorOpenFill className="icon-salida" size="25px" /></Nav.Link> 
            </>)
        } 
    }

    useEffect(() => {
        renderLogaut();
        //eslint-disable-next-line
    }, [user])

    return (<>
        <Navbar className="navbar">
            { user.rango == 'admin' && <Sidenav />}
            { user.rango == 'moderador'  && <Sidenav />}
            <Container>
                <Link to="/">
                    <Image src={logo} className="align-top img" alt="GDos Construcciones"/>
                </Link>
                {renderLogaut()}
            </Container>
        </Navbar>
    </>)
}
export default NavbarComponent;
