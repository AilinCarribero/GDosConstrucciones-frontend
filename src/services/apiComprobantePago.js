import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getComprobantePago = async () => {
    const response = await axios.get(API+'comprobante-pago/', servisTokenConfig );
    return response.data;
}