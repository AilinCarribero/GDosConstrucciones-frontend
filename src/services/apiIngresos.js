import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const insertIngreso = async (ingreso) => {
    console.log(servisTokenConfig)
    const response = await axios.post(API+'ingresos/insert', ingreso, servisTokenConfig);
    return response;
}

export const getIngresos = async () => {
    const response = await axios.get(API+'ingresos/', servisTokenConfig);
    return response.data;
}