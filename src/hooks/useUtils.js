import { toast } from 'react-toastify';

//Formatea el numero que se le pasa en formato moneda con no mas de 2 decimales
export const formatNumber = (numero) => {
    return new Intl.NumberFormat("ES-AR", {
        style: "decimal",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(numero)
}

export const formatInputNumber = (numero) => {
    numero = numero + ''; // Número a cadena
    let str = ""; // Acumulación de cadenas
    for (let i = numero.length - 1, j = 1; i >= 0; i--, j++) {
        if (j % 3 == 0 && i != 0) {// Se agrega una coma cada tres dígitos para filtrar el caso donde es exactamente el primer dígito
            str += numero[i] + ","; // Agrega una coma de miles
            continue;
        }
        str += numero[i]; // Para acumular números al revés
    }
    return str.split('').reverse().join("");
}

//Activa un toast acorde al estado que se le pasa. Se le puede asignar un mensaje o usar el predeterminado.
export const ToastComponent = (estado, mensaje) => {
    const customId = 1; //Esto es para que solo exista un toast a la vez

    estado == 'warn' && toast.warn(
        mensaje ? mensaje : "Completa todos los campos",
        { theme: "dark", autoClose: 5000, toastId: customId }
    );
    estado == 'error' && toast.error(
        mensaje ? mensaje : "No se pudo enviar",
        { theme: "dark", autoClose: 5000, toastId: customId }
    );
    estado == 'success' && toast.success(
        mensaje ? mensaje : "Se envio con exito!",
        { theme: "dark", autoClose: 5000, toastId: customId }
    );
}

/*export const ValidacionAlert = (tipo, datos) => {
    const [ show, setShow ] = useState(true);

    if(!datos){
        ToastComponent('warn','No existen los datos para validar')
    } else if(tipo == 'ingresos'){
        return ()
        //if(tipo == 'egresos')
    }
}*/