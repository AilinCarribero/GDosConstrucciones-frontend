import { useEffect, useState } from "react";
import { getCliente } from "../services/apiCliente";

export const useGetCliente = () => {
    const [ cliente, setCliente ] = useState([]);

    useEffect(() => {
        (async () => {
            const resCliente = await getCliente();
            setCliente(resCliente);
            console.log(resCliente);
        })()
        
    }, [])
    return { cliente, setCliente }
}