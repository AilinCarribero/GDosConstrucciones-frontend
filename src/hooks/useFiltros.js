import { useEffect, useContext, useState } from "react";
import { ProyectoContext } from "../contexts/ProyectosProvider";
import { useGetProyectos } from "./useProyectos";
import { ToastComponent } from "./useUtils";

export const useFiltros = () => {
    const { proyectos } = useGetProyectos();
    const { proyectosContext, setProyectosContext } = useContext(ProyectoContext);

    const [proyectosFiltros, setProyectosFiltros] = useState();
    let [filtros, setFiltros] = useState({
        fecha_cobro_hasta: new Date('3000-12-30').toISOString(),
        fecha_cobro_desde: '0000-00-00',
        fecha_pago_hasta: new Date('3000-12-30').toISOString(),
        fecha_pago_desde: '0000-00-00',
        fecha_diferida_cobro_hasta: new Date('3000-12-30').toISOString(),
        fecha_diferida_cobro_desde: '0000-00-00',
        fecha_diferida_pago_hasta: new Date('3000-12-30').toISOString(),
        fecha_diferida_pago_desde: '0000-00-00'
    });

    //Valores de los filtros por default
    const valueFiltrosdefault = {
        fecha_cobro_hasta: new Date('3000-12-30').toISOString(),
        fecha_cobro_desde: '0000-00-00',
        fecha_pago_hasta: new Date('3000-12-30').toISOString(),
        fecha_pago_desde: '0000-00-00',
        fecha_diferida_cobro_hasta: new Date('3000-12-30').toISOString(),
        fecha_diferida_cobro_desde: '0000-00-00',
        fecha_diferida_pago_hasta: new Date('3000-12-30').toISOString(),
        fecha_diferida_pago_desde: '0000-00-00'
    }

    //Si los proyectos se modifican 
    useEffect(() => {
        setProyectosFiltros(proyectosContext);
    }, [proyectosContext])

    const handleFiltros = (e) => {
        let targetName = e.target.name;
        let targetValue = e.target.value;
        let resultadoFiltroProyecto = [];

        //console.log(targetName + ' - ' + targetValue);
        /*En caso de que el valor de target venga vacio se resetea el filtro al valor por defecto*/
        if (!targetValue) {
            if (targetName.includes('cobro')) {
                if (targetName.includes('hasta')) {
                    filtros[targetName] = new Date('3000-12-30').toISOString();
                } else {
                    filtros[targetName] = '0000-00-00';
                }
            } else {
                if (targetName.includes('hasta')) {
                    filtros[targetName] = new Date('3000-12-30').toISOString();
                } else {
                    filtros[targetName] = '0000-00-00';
                }
            }
        } else {
            filtros[targetName] = new Date(targetValue).toISOString()
        }

        //Si los filtros son diferentes a los default significa que hay algun filtro para aplicar
        if (valueFiltrosdefault != filtros) {
            resultadoFiltroProyecto = proyectos.filter(proyecto => {
                if (filtros.fecha_cobro_hasta != valueFiltrosdefault.fecha_cobro_hasta 
                    || filtros.fecha_cobro_desde != valueFiltrosdefault.fecha_cobro_desde) {
                    for (let i = 0; i < proyecto.ingresos.length; i++) {
                        if (proyecto.ingresos[i].fecha_cobro >= filtros.fecha_cobro_desde
                            && proyecto.ingresos[i].fecha_cobro <= filtros.fecha_cobro_hasta) {
                            return proyecto //cobro 
                        }
                    }
                } else {
                    return proyecto
                }
            }).filter(proyecto => {
                if (filtros.fecha_diferida_cobro_hasta != valueFiltrosdefault.fecha_diferida_cobro_hasta 
                    || filtros.fecha_diferida_cobro_desde != valueFiltrosdefault.fecha_diferida_cobro_desde) {
                    for (let i = 0; i < proyecto.ingresos.length; i++) {
                        if (proyecto.ingresos[i].fecha_diferido_cobro >= filtros.fecha_diferida_cobro_desde
                            && proyecto.ingresos[i].fecha_diferido_cobro <= filtros.fecha_diferida_cobro_hasta) {
                            return proyecto //cobro diferido 
                        }
                    }
                } else {
                    return proyecto
                }
            }).filter(proyecto => {
                if (filtros.fecha_pago_hasta != valueFiltrosdefault.fecha_pago_hasta 
                    || filtros.fecha_pago_desde != valueFiltrosdefault.fecha_pago_desde) {
                    for (let i = 0; i < proyecto.egresos.length; i++) {
                        if (proyecto.egresos[i].fecha_pago >= filtros.fecha_pago_desde
                            && proyecto.egresos[i].fecha_pago <= filtros.fecha_pago_hasta) {
                            return proyecto //pago 
                        }
                    }
                } else {
                    return proyecto
                }
            }).filter(proyecto => {
                if (filtros.fecha_diferida_pago_hasta != valueFiltrosdefault.fecha_diferida_pago_hasta 
                    || filtros.fecha_diferida_pago_desde != valueFiltrosdefault.fecha_diferida_pago_desde) {
                    for (let i = 0; i < proyecto.egresos.length; i++) {
                        if (proyecto.egresos[i].fecha_diferido_pago >= filtros.fecha_diferida_pago_desde
                            && proyecto.egresos[i].fecha_diferido_pago <= filtros.fecha_diferida_pago_hasta) {
                            return proyecto //pago diferido 
                        }
                    }
                } else {
                    return proyecto
                }
            })
        } else {
            /*Si los filtros son iguales a los defautl debera reiniciar los proyectos que se muestran */
            setProyectosContext(proyectos);
        }

        if (resultadoFiltroProyecto.length > 0) { /*Nos aseguramos de tener resultados */
            setProyectosContext(resultadoFiltroProyecto);
        } else if (resultadoFiltroProyecto.length <= 0 && filtros != valueFiltrosdefault) {
            /*Si no se obtenieron resultados y exisen filtros muestra una alerta de que no se encontraron los resultados 
            y se resetean los proyectos que se muestran */
            ToastComponent('warn', 'No se encontraron resultados');
            setProyectosContext(proyectos)
        }
    }

    return { handleFiltros, filtros }
}
