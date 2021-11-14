import { useEffect, useState } from "react";
import { getEgresos, getEgresosId } from "../services/apiEgresos";

export const useGetEgresos = () => {
    const [ egresos, setEgresos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resEgresos = await getEgresos();
            setEgresos(resEgresos);
            console.log(resEgresos);
        })()
    }, [])
    return { egresos, setEgresos }
}

export const useGetEgresosId = (id) => {
    const [ egresos, setEgresos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resEgresos = await getEgresosId(id);
            setEgresos(resEgresos);
            console.log(resEgresos);
        })()
    }, [])
    return { egresos, setEgresos }
}