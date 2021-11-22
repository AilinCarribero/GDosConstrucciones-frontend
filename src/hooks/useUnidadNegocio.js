import { useEffect, useState } from "react";
import { getUnidadNegocio } from "../services/apiUnidadNegocio";

export const useGetUnidadNegocio = () => {
    const [ unidadNegocio, setUnidadNegocio ] = useState([]);

    useEffect(() => {
        (async () => {
            const resUnidadNegocio = await getUnidadNegocio();
            setUnidadNegocio(resUnidadNegocio);
        })()
        
    }, [])
    return { unidadNegocio, setUnidadNegocio }
}