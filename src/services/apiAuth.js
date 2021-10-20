import axios from 'axios';

import { API } from './apiServices';

export const login = async (user) => {
    const response = await axios.post(API+'auth/login', user);
    return response.data;
}