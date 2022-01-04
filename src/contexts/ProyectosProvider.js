import React, { createContext, useState } from "react";

export const ProyectoContext = createContext({ proyectosContext: [], setProyectosContext: () => {}});

const ProyectoProvider = ({ children }) => {
    const [ proyectosContext, setProyectosContext  ] = useState();

    return <ProyectoContext.Provider value={{ proyectosContext, setProyectosContext }}>
        {children}
    </ProyectoContext.Provider>
}

export default ProyectoProvider;