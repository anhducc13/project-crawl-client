import axios from 'axios';

// axios.interceptors.request.use(config => {
//     return config;
// }, error => {
//     return Promise.reject(error);
// });
//
// axios.interceptors.response.use(response => {
//     response.headers['Access-Control-Allow-Origin'] = '*';
//     response.headers['Content-Type'] = 'text/html';
//     return response;
// }, error => {
//     console.log(error);
//     return Promise.reject(error);
// });

export const getProduct = (url: string) => {
    return axios.get("https://crawl-server.herokuapp.com/api/crawl-detail/product", { params: { url } }).then(res => res.data);
};
