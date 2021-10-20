import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getAnalisisCostos = async () => {
    console.log(servisTokenConfig)
    const response = await axios.get(API+'analisis-costos/', servisTokenConfig );
    return response.data;
}

export const getDetalleAnalisisCostos = async () => {
    console.log(servisTokenConfig)
    const response = await axios.get(API+'analisis-costos/detalles', servisTokenConfig );
    return response.data;
}