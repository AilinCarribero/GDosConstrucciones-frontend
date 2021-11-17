import { toast } from 'react-toastify';

export const formatNumber = (numero) => {
    return new Intl.NumberFormat("ES-AR", {
        style: "decimal"
      }).format(numero)
}

export const ToastComponent = (estado, mensaje) => {
    const customId  =  1;

    estado == 'warn' && toast.warn(
        mensaje ? mensaje : "Completa todos los campos", 
        {theme: "dark",  autoClose: 5000, toastId: customId}
    );
    estado == 'error' && toast.error(
        mensaje ? mensaje : "No se pudo enviar", 
        {theme: "dark",  autoClose: 5000, toastId: customId}
    );
    estado == 'success' && toast.success(
        mensaje ? mensaje : "Se envio con exito!", 
        {theme: "dark",  autoClose: 5000, toastId: customId}
    );
}
