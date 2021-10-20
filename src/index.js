import React from 'react';
import ReactDOM from 'react-dom';
import UserProvider from './contexts/UserProvider';
import Routers from './Routers';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <UserProvider>
        <Routers />
    </UserProvider>
, document.getElementById('root'));

