import React, { useState } from "react";
import { Row, Spinner } from 'react-bootstrap';

const SpinnerC = (props) => {
    const [ estado, setEstado ] = useState(props.estado);

    return (<>
        {
            estado && <Spinner animation="border" variant="dark" />
        }
    </>)
}

export default React.memo(SpinnerC);