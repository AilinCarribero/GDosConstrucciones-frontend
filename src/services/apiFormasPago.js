import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getFormasPago = async () => {
    console.log(servisTokenConfig);
    const response = await axios.get(API+'formas-pago/', servisTokenConfig );
    return response.data;
}