import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getFormasCobro = async () => {
    const response = await axios.get(API+'formas-cobro/', servisTokenConfig );
    return response.data;
}