import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const login = async (user) => {
    const response = await axios.post(API+'auth/login', user);
    return response.data;
}

export const insertUser = async (user) => {
    const response = await axios.post(API+'auth/registro', user , servisTokenConfig);
    return response.data;
}

export const getUser = async () => {
    const response = await axios.get(API+'auth/', servisTokenConfig);
    return response.data;
}