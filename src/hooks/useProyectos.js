import { useEffect, useState, useContext } from "react";
import { getEgresos } from "../services/apiEgresos";
import { getIngresos } from "../services/apiIngresos";
import { getProyectos } from "../services/apiProyectos";

export const useGetProyectos = () => {
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        (async () => {
            const resProyectos = await getProyectos();
            const egresos = await getEgresos();
            const ingresos = await getIngresos();
            
            if(egresos && ingresos && resProyectos){
                resProyectos.map((proyecto, i) => {
                    const filtroEgresos = egresos.filter(egreso => egreso.id_proyecto == proyecto.id_proyecto);
                    resProyectos[i]['egresos'] = filtroEgresos;
                    const filtroIngresos = ingresos.filter(ingreso => ingreso.id_proyecto == proyecto.id_proyecto);
                    resProyectos[i]['ingresos'] = filtroIngresos;
                })
                setProyectos(resProyectos);
            }
        })()
    }, [])

    return { proyectos, setProyectos }
}