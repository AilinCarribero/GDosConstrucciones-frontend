export const API = 'http://localhost:5030/api/';  //url de la api https://tests-pruebas.herokuapp.com/

//Configuracion global de envio del token a solicitudes a la api
export let servisTokenConfig = {};

//Seteo del token
export const configToken = async (token) => {
    console.log(token);
    if(token){
        servisTokenConfig = {
            headers: {
                token: token
            }  
        }
    } else {
        console.log('El token no existe');
    }
    /*headers: {
            Authorization: `Bearer ${token}`
        } */
}