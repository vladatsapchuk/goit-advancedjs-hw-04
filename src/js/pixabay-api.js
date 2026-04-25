import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '42823339-1ca31e44a0bb15197c26bd0aa';

export async function getImagesByQuery(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      page,
      per_page: 15,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });

  return response.data;
}