import iziToast from "izitoast";
// Additional style import for iziToast. This ensures the necessary CSS is loaded for the notifications.
import "izitoast/dist/css/iziToast.min.css";
import { createGalleryCardTemplate } from './js/render-functions'; // Function to create the HTML markup for a single gallery item.
import {fetchPhotosByQuery} from "./js/pixabay-api" // API call function to fetch images from Pixabay based on a search query.

// SimpleLightbox library import (as described in documentation). Used for creating a modal/slideshow view of the images.
import SimpleLightbox from "simplelightbox";
// Additional style import for SimpleLightbox. This ensures the necessary CSS is loaded for the lightbox component.
import "simplelightbox/dist/simple-lightbox.min.css";

// Variable to hold the SimpleLightbox instance. Initialized to null.
let lightboxInstance = null;

// LIGHTBOX INITIALIZATION/UPDATE FUNCTION
// This function initializes the SimpleLightbox or refreshes it after new images are added to the DOM.
const initLightbox = () => {
    // If the instance hasn't been created yet (first time loading gallery), create it.
    if (!lightboxInstance) {
        lightboxInstance = new SimpleLightbox('.js-gallery a', {
            // Target all <a> tags within the gallery container (.js-gallery) for the lightbox functionality.
            captionDelay: 250, // Delay in milliseconds before the caption appears.
            captionsData: 'alt', // Specify to use the 'alt' attribute of the image for the caption text.
        });
    } else {
        // If the instance already exists, refresh it to include any newly added images in the gallery.
        lightboxInstance.refresh();
    }
}


// Form elements references. Grouping DOM elements here makes them easy to access and manage.
const refs = {
    searchForm: document.querySelector('.js-search-form'), // Reference to the main search form element.
    gallery: document.querySelector('.js-gallery'), // Reference to the container where gallery cards are rendered.
    loader: document.querySelector('.js-loader'),
    loadMoreBtn: document.querySelector('.js-load-more-btn'),
}


let page = 1;
let searchedQuery;

const onLoadMoreBtnClick = async event => {
    try{
        page++;
        refs.loader.classList.add('is-active')
        const response = await fetchPhotosByQuery(searchedQuery, page);
        const galleryCardTemplate = response.hits.map(pictureInfo => createGalleryCardTemplate(pictureInfo)).join('')
        
        // Insert the generated HTML string of gallery cards into the gallery container.
        refs.gallery.insertAdjacentHTML('beforeend', galleryCardTemplate);

       
        
        // Initialize or refresh the SimpleLightbox to include the newly rendered images.
        initLightbox();
        refs.loader.classList.remove('is-active')

        const firstGalleryCard = document.querySelector('.gallery-card');

        const cardHeight = firstGalleryCard.getBoundingClientRect().height;
        
        const scrollDistance = cardHeight * 2;

        window.scrollBy({
            top: scrollDistance, 
            behavior: "smooth"   
        });

        if (page * 15 >= response.totalHits) {
            refs.loadMoreBtn.classList.add('is-hidden')
            refs.loadMoreBtn.removeEventListener('click', onLoadMoreBtnClick)
            iziToast.show({
    message: "We're sorry, but you've reached the end of search results.",
    color: 'blue', // Set notification color to red.
    position: 'topCenter', // Position the notification.

});

        }
        

    }catch (err) {
        console.log(err);
    }

}


// Handler function executed when the search form is submitted.
const onSearchFormSubmit = async event => {
    event.preventDefault(); // Prevent the default form submission and page reload.

    // Destructure the target element from the event object for easier access.
    const {target : searchForm} = event;

    // Get the value from the input field named 'user_query' and remove leading/trailing whitespace.
    searchedQuery = searchForm.elements.user_query.value.trim()
    

    // Validation: Check if the search query is empty.
    if (searchedQuery.length === 0) {
        
            // Display an error notification using iziToast if the query is empty.
            iziToast.show({
            title: "WARNING",
            message: `Search query cannot be empty!`,
            color: 'red', // Set notification color to red for warnings/errors.
            position: 'topCenter', // Position the notification at the top center of the screen.

        });

        return; // Stop the function execution if the query is empty.
    }
    // Clear the existing gallery content before fetching and displaying new results.
    refs.gallery.innerHTML = '';

    refs.loader.classList.add('is-active')
    refs.loadMoreBtn.classList.add('is-hidden')
    page = 1
    

    try{
        const response = await fetchPhotosByQuery(searchedQuery, page);

        // Check if the API returned no results (hits array is empty).
        if (response.hits.length === 0){
            // Display a notification if no images were found for the query.
            iziToast.show({
    message: 'Sorry, there are no images matching your search query. Please try again!',
    color: 'red', // Set notification color to red.
    position: 'topCenter', // Position the notification.

});
    return // Stop execution if no hits are found.
        }

    if(response.totalHits > response.hits.length){
        refs.loadMoreBtn.classList.remove('is-hidden');
        refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
    } else {
            // Сховати кнопку, якщо всі результати помістилися на першу сторінку
        refs.loadMoreBtn.classList.add('is-hidden');
     }

        


        // Map over the array of picture data (data.hits) and create an HTML card template for each.
        // Then, join the array of HTML strings into a single string.
        const galleryCardTemplate = response.hits.map(pictureInfo => createGalleryCardTemplate(pictureInfo)).join('')
        
        // Insert the generated HTML string of gallery cards into the gallery container.
        refs.gallery.innerHTML = galleryCardTemplate
        
        
        // Initialize or refresh the SimpleLightbox to include the newly rendered images.
        initLightbox();
        
        // refs.loadMoreBtn.classList.remove('is-hidden')
    } catch (err) {
        console.log(err);
    } finally {
    
        refs.loader.classList.remove('is-active')
    }
}

// Attach the event listener to the search form to trigger the submission handler.
refs.searchForm.addEventListener('submit', onSearchFormSubmit)