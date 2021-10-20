import { useEffect, useState } from "react";
import { getFormasPago } from '../services/apiFormasPago';

export const useGetFormasPagos = () => {
    const [ formasPagos, setFormasPagos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resFormaPago = await getFormasPago();
            setFormasPagos(resFormaPago);
            console.log(resFormaPago);
        })()
        
    }, [])
    return { formasPagos, setFormasPagos }
}