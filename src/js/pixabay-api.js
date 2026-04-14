import axios from "axios";

axios.defaults.baseURL = 'https://pixabay.com'

const refs = {
    loader: document.querySelector('.js-loader'),
}

export const fetchPhotosByQuery = async (query, currentPage) => {

    const axiosParams = 
        {
            key: '52947144-373b760a7dc07b63f24b6c37a',
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            page: currentPage,
            per_page: 15,
            safesearch: true,
        };

    // return axios.get( '/api/?', {params: axiosParams}).finally(() => {
    //     refs.loader.classList.remove('is-active');
    // });

    const response = await axios.get( '/api/?', {params: axiosParams});
    
    return response.data;
};