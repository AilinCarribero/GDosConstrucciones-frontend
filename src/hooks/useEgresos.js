import { useEffect, useState } from "react";
import { getEgresos } from "../services/apiEgresos";

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