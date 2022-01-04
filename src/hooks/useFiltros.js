import { useEffect, useContext, useState } from "react";
import { ProyectoContext } from "../contexts/ProyectosProvider";
import { useGetProyectos } from "./useProyectos";
import { ToastComponent } from "./useUtils";

export const useFiltros = () => {
    const { proyectos } = useGetProyectos();
    const { proyectosContext, setProyectosContext } = useContext(ProyectoContext);

    const [proyectosFiltros, setProyectosFiltros] = useState();
    const [filtros, setFiltros] = useState();

    //Si los proyectos se modifican 
    useEffect(() => {
        setProyectosFiltros(proyectosContext);
    }, [proyectosContext])
    
    const handleFiltros = (e) => {
        let targetName = e.target.name;
        let targetValue = e.target.value;

        //console.log(targetName + ' - ' + targetValue);
        
        /*En caso de que el valor de target venga vacio el name debera tambien estar vacio para que no se filtre nada */
        if(!targetValue) {
            targetName ='';
        }

/* FALTA!!! --->> Guardar filtros y siempre que se agregue un filtro buscar sobre los proyectos aplicando todos los filtros*/

        /* De a cuerdo a que se estre ingresando se filtra lo correspondiente */
        const resultadoFiltroProyecto = proyectosFiltros.filter(proyecto => {
            switch (targetName) {
                case 'fecha_diferida_cobro_hasta':
                    if (proyecto.ingresos.length > 0) {
                        for (let i = 0; i < proyecto.ingresos.length; i++) {
                            if (proyecto.ingresos[i].fecha_diferido_cobro <= targetValue  && proyecto.egresos[i].fecha_diferido_cobro != "0000-00-00") {
                                return proyecto
                            }
                        }
                    }
                    break;
                case 'fecha_diferida_cobro_desde':
                    if (proyecto.ingresos.length > 0) {
                        for (let i = 0; i < proyecto.ingresos.length; i++) {
                            if (proyecto.ingresos[i].fecha_diferido_cobro >= targetValue) {
                                return proyecto
                            }
                        }
                    }
                    break;
                case 'fecha_diferida_pago_hasta':
                    if (proyecto.egresos.length > 0) {
                        for (let i = 0; i < proyecto.egresos.length; i++) {
                            if (proyecto.egresos[i].fecha_diferido_pago <= targetValue && proyecto.egresos[i].fecha_diferido_pago != "0000-00-00") {
                                return proyecto
                            }
                        }
                    }
                    break;
                case 'fecha_diferida_pago_desde':
                    if (proyecto.egresos.length > 0) {
                        for (let i = 0; i < proyecto.egresos.length; i++) {
                            if (proyecto.egresos[i].fecha_diferido_pago >= targetValue) {
                                return proyecto
                            }
                        }
                    }
                    break;
                case 'fecha_cobro_hasta':
                    if (proyecto.ingresos.length > 0) {
                        for (let i = 0; i < proyecto.ingresos.length; i++) {
                            if (proyecto.ingresos[i].fecha_cobro <= targetValue) {
                                return proyecto
                            }
                        }
                    }
                    break;
                case 'fecha_cobro_desde':
                    if (proyecto.ingresos.length > 0) {
                        for (let i = 0; i < proyecto.ingresos.length; i++) {
                            if (proyecto.ingresos[i].fecha_cobro >= targetValue) {
                                return proyecto
                            }
                        }
                    }
                    break;
                case 'fecha_pago_hasta':
                    if (proyecto.egresos.length > 0) {
                        for (let i = 0; i < proyecto.egresos.length; i++) {
                            if (proyecto.egresos[i].fecha_pago <= targetValue) {
                                return proyecto
                            }
                        }
                    }
                    break;
                case 'fecha_pago_desde':
                    if (proyecto.egresos.length > 0) {
                        for (let i = 0; i < proyecto.egresos.length; i++) {
                            if (proyecto.egresos[i].fecha_pago >= targetValue) {
                                return proyecto
                            }
                        }
                    }
                    break;
                default: 
                    setProyectosContext(proyectos);
                    break;
            }
        })

        if(resultadoFiltroProyecto.length > 0){
            setProyectosContext(resultadoFiltroProyecto);
        } else if(resultadoFiltroProyecto.length <= 0 && targetName ){
            ToastComponent('warn','No se encontraron resultados');
            setProyectosContext(proyectos)
        }
    }

    return { handleFiltros }
}
