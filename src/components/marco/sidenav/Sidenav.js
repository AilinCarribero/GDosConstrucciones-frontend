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
      <Icons.List color="white" size="30px"  />
    </Button>

    <Offcanvas show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="justify-content-end flex-grow-1 pe-3">
          <Link to="/">Proyectos</Link>
          <Link to="/">Indices</Link>
          <Link to="/ingresar/proyecto">Nuevo Proyecto</Link>
          <Link to="/ingresar/egreso">Agregar Egreso</Link>
          <Link to="/ingresar/ingreso">Agregar Ingreso</Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  </>);
}

export default Sidenav;