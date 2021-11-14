import React from 'react';
import ReactDOM from 'react-dom';
import UserProvider from './contexts/UserProvider';
import Routers from './Routers';
import { ToastContainer } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
    <UserProvider>
        <ToastContainer />
        <Routers />
    </UserProvider>
, document.getElementById('root'));

