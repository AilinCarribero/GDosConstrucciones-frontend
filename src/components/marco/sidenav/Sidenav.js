import React, { useState } from 'react';
import { Offcanvas, Nav, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Hooks
import { useUser } from '../../../hooks/useUser';

//Css
import './Sidenav.css';

//Img
import * as Icons from 'react-bootstrap-icons';
import logo from '../../../img/logowhitev2.png';

const Sidenav = () => {
  const { user } = useUser()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (<>
    <Button className="button-menu" variant="outline-light" onClick={handleShow}>
      <Icons.List color="white" size="32px" />
    </Button>

    <Offcanvas className="menu" show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <Link to="/">
            <Image src={logo} className="align-top img-side" alt="GDos Construcciones" />
          </Link>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="justify-content-end flex-grow-1 pe-3">
          <Link className="text-link fondo-link" to="/" onClick={handleClose} >Inicio</Link>
          {/*<Link className="text-link fondo-link" to="/" onClick={handleClose} >Indices</Link>*/}
          {user.rango == 'admin' && <Link className="text-link fondo-link" to="/usuarios" onClick={handleClose} >Usuarios</Link>}
          {user.rango == 'admin' && <Link className="text-link fondo-link" to="/ingresar/proyecto" onClick={handleClose} >Nuevo Proyecto</Link>}
          <Link className="text-link fondo-link" to="/ingresar/egreso" onClick={handleClose} >Nuevo Egreso</Link>
          <Link className="text-link fondo-link" to="/ingresar/ingreso" onClick={handleClose} >Nuevo Ingreso</Link>
          {user.rango == 'admin' && <Link className="text-link fondo-link" to="/ingresar/usuario" onClick={handleClose} >Nuevo Usuario</Link>}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  </>);
}

export default Sidenav;