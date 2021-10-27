import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getCliente = async () => {
    const response = await axios.get(API+'cliente/', servisTokenConfig );
    return response.data;
}