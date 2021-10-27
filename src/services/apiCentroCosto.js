import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getCentroCosto = async () => {
    const response = await axios.get(API+'centro-costo/', servisTokenConfig );
    return response.data;
}