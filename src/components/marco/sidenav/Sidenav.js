import React, { useState } from 'react';
import { Offcanvas, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Sidenav.css';
import * as Icons from 'react-bootstrap-icons'

const Sidenav = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (<>
    <Button className="button-menu" variant="outline-light" onClick={handleShow}>
      <Icons.List color="white" size="32px"  />
    </Button>

    <Offcanvas className="menu" show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="justify-content-end flex-grow-1 pe-3">
          <Link className="text-link fondo-link" to="/">Proyectos</Link>
          <Link className="text-link fondo-link" to="/">Indices</Link>
          <Link className="text-link fondo-link" to="/usuarios">Usuarios</Link>
          <Link className="text-link fondo-link" to="/ingresar/proyecto">Nuevo Proyecto</Link>
          <Link className="text-link fondo-link" to="/ingresar/egreso">Nuevo Egreso</Link>
          <Link className="text-link fondo-link" to="/ingresar/ingreso">Nuevo Ingreso</Link>
          <Link className="text-link fondo-link" to="/ingresar/usuario">Nuevo Usuario</Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  </>);
}

export default Sidenav;