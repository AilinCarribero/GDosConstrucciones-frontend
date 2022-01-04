import { useEffect, useState } from "react";
import { getEgresos } from "../services/apiEgresos";
import { getIngresos } from "../services/apiIngresos";
import { getProyectos } from "../services/apiProyectos";

import { useGetEgresos } from "./useEgresos";
import { useGetIngresos } from "./useIngresos";

export const useGetProyectos = () => {
    const [ proyectos, setProyectos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resProyectos = await getProyectos();
            const resEgresos = await getEgresos();
            const resIngresos = await getIngresos();
            
            if(resEgresos && resIngresos && resProyectos){
                resProyectos.map((proyecto, i) => {
                    const filtroEgresos = resEgresos.filter(egreso => egreso.id_proyecto == proyecto.id_proyecto);
                    resProyectos[i]['egresos'] = filtroEgresos;
                    const filtroIngresos = resIngresos.filter(ingreso => ingreso.id_proyecto == proyecto.id_proyecto);
                    resProyectos[i]['ingresos'] = filtroIngresos;
                })
                setProyectos(resProyectos);
            }
        })()
    }, [])

    return { proyectos, setProyectos }
}