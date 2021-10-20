import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getProyectos = async () => {
    console.log(servisTokenConfig)
    const response = await axios.get(API+'proyectos/', servisTokenConfig );
    return response.data;
}