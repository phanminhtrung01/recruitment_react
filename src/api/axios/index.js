import axios from 'axios';
import { API_ROUTES } from '../routes';

// login  withCredentials: false, refreshToken: withCredentials: true
const request = axios.create({
    baseURL: API_ROUTES.getBase,
    // withCredentials: true,
});

export const requestAuth = axios.create({
    baseURL: API_ROUTES.getBase,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

export const get = async ({ path, base, options = {} }) => {
    if (base) {
        path = base;
    }
    const response = await request.get(path, options);

    return response.data;
};

export const post = async (path, source, options = {}) => {
    const response = await request.post(path, source, options);

    return response.data;
};

export default request;
