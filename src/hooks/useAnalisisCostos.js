import { useEffect, useState } from "react";
import { getAnalisisCostos, getDetalleAnalisisCostos } from "../services/apiAnalisisCostos";

export const useGetAnalisisCostos = () => {
    const [ analisisCostos, setAnalisisCostos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resAnalisisCosto = await getAnalisisCostos();
            setAnalisisCostos(resAnalisisCosto);
            console.log(resAnalisisCosto);
        })()
    }, [])
    return { analisisCostos, setAnalisisCostos }
}

export const useDetalleAnalisisCosto = () => {
    const [ detalleAC, setDetalleAC ] = useState([]);

    useEffect(() => {
        (async () => {
            const resDetalleAnalisisCosto = await getDetalleAnalisisCostos();
            setDetalleAC(resDetalleAnalisisCosto);
            console.log(resDetalleAnalisisCosto);
        })()
    }, [])
    return { detalleAC, setDetalleAC }
}