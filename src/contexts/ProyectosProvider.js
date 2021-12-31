import React, { createContext, useState } from "react";
import { useFiltros } from "../hooks/useFiltros";

export const ProyectoContext = createContext({ filtrosProyectosContext: [], setFiltrosProyectosContext: () => {}});

const ProyectoProvider = ({ children }) => {
    const [ filtrosProyectosContext, setFiltrosProyectosContext  ] = useState();

    return <ProyectoContext.Provider value={{ filtrosProyectosContext, setFiltrosProyectosContext }}>
        {children}
    </ProyectoContext.Provider>
}

export default ProyectoProvider;