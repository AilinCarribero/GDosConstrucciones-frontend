import { ToastComponent } from "../hooks/useUtils";

export const API = process.env.REACT_APP_REST;//'http://localhost:5030/api/';  //url de la api 

//Configuracion global de envio del token a solicitudes a la api
export let servisTokenConfig = {};

//Seteo del token
export const configToken = async (token) => {
    if(token){
        servisTokenConfig = {
            headers: {
                Authorization: `Bearer ${token}`
            }  
        }
    } else {
        console.log('El token no existe');
        ToastComponent('error','El token no existe')
    }
}