import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getProduct = (url: string) => {
    return axios.get(`${API_URL}/api/crawl-detail/product`, { params: { url } }).then(res => res.data);
};
