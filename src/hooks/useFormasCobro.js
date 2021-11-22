import { useEffect, useState } from "react";
import { getFormasCobro } from '../services/apiFormasCobro';

export const useGetFormasCobro = () => {
    const [ formasCobro, setFormasCobro ] = useState([]);

    useEffect(() => {
        (async () => {
            const resFormaCobro = await getFormasCobro();
            setFormasCobro(resFormaCobro);
        })()
        
    }, [])
    return { formasCobro, setFormasCobro }
}