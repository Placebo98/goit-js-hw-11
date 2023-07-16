import axios from 'axios';
import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const startBtn = document.querySelector('.search-form button');
const loadMoreBtn = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
const submitEl = document.querySelector('.search-form input');

let pageCounter = 1;
const perPage = 40;

const BASE_URL = 'https://pixabay.com/api/';
const myApiKey = '38277841-eb81ae53a2f64c4ae8aa9bab6';

startBtn.disabled = true;
loadMoreBtn.style.visibility = 'hidden';

async function fetchImg(value) {
  try {
    let response = await axios(`${BASE_URL}`, {
      params: {
        key: myApiKey,
        q: value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageCounter,
        per_page: perPage,
      },
    });

    const totalHits = response.data.totalHits;
    let pagesNumber = Math.ceil(totalHits / perPage);

    if (response.data.hits.length === 0) {
      loadMoreBtn.style.visibility = 'hidden';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (pageCounter >= 1) {
      loadMoreBtn.style.visibility = 'visible';
      renderCard(response.data.hits);
    }
    if (pageCounter === pagesNumber) {
      loadMoreBtn.style.visibility = 'hidden';
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
      return;
    }
  } catch (error) {
    Notiflix.Notify.failure(`Error: ${error}`);
  }
}

submitEl.addEventListener('input', ev => {
  const inputValue = ev.currentTarget.value;
  if (inputValue.length === 0) {
    startBtn.disabled = true;
  } else {
    startBtn.disabled = false;
  }
  return;
});

searchFormEl.addEventListener('submit', requestValue);

function requestValue(e) {
  e.preventDefault();
  pageCounter = 1;
  galleryEl.innerHTML = '';
  let request = submitEl.value;
  fetchImg(request);
  return;
}

loadMoreBtn.addEventListener('click', loading);

function loading() {
  pageCounter += 1;
  fetchImg(submitEl.value);
  return;
}

function renderCard(response) {
  let markUp = response.map(response => {
    return `<a href='${response.largeImageURL}' class='gallery__link'>
      <img src="${response.webformatURL}" alt="${response.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${response.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${response.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${response.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${response.downloads}</b>
        </p>
      </div>
    </a>`;
  });

  galleryEl.insertAdjacentHTML('beforeend', markUp.join(''));
  return;
}
