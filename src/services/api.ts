import axios from 'axios';

let baseURL = ''
if(process.env.NODE_ENV === "development"){
    baseURL = 'http://localhost:3333'
}else{
    baseURL = 'https://api.eduy.com.br'
}


const api = axios.create({baseURL})

api.interceptors.response.use((response) => {

    return response;

}, async function (error) {
    if (error.response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default api