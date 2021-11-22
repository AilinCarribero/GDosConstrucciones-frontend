import { useEffect, useState } from "react";
import { getComprobantePago } from '../services/apiComprobantePago';

export const useGetComprobantesPago = () => {
    const [ comprobantePago, setComprobantePago ] = useState([]);

    useEffect(() => {
        (async () => {
            const resComprobantePago = await getComprobantePago();
            setComprobantePago(resComprobantePago);
        })()
        
    }, [])
    return { comprobantePago, setComprobantePago }
}