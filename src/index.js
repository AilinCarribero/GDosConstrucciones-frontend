import React from 'react';
import ReactDOM from 'react-dom';
import UserProvider from './contexts/UserProvider';
import ProyectoProvider from './contexts/ProyectosProvider';
import Routers from './Routers';
import { ToastContainer } from 'react-toastify';

//Css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
    <UserProvider>
        <ProyectoProvider>
            <ToastContainer />
            <Routers />
        </ProyectoProvider>
    </UserProvider>
, document.getElementById('root'));

