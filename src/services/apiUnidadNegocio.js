import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getUnidadNegocio = async () => {
    const response = await axios.get(API+'unidad-negocio/', servisTokenConfig );
    return response.data;
}