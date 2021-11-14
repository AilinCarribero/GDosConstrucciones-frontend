import { useEffect, useState } from "react";
import { getIngresos, getIngresosId } from "../services/apiIngresos";

export const useGetIngresos = () => {
    const [ ingresos, setIngresos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resIngresos = await getIngresos();
            setIngresos(resIngresos);
            console.log(resIngresos);
        })()
    }, [])
    return { ingresos, setIngresos }
}

export const useGetIngresosId = (id) => {
    const [ ingresos, setIngresos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resIngresos = await getIngresosId(id);
            setIngresos(resIngresos);
            console.log(resIngresos);
        })()
    }, [])
    return { ingresos, setIngresos }
}