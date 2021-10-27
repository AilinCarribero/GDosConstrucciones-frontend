import { useEffect, useState } from "react";
import { getIngresos } from "../services/apiIngresos";

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