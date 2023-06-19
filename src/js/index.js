import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { Report } from 'notiflix/build/notiflix-report-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const refs = {
  select: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  modal: document.querySelector('.js-modal'),
};

selectHide();
loadingPage();

fetchBreeds()
  .then(data => {
    let listOfCats =
      '<option disabled="disabled" selected="selected">Select cat</option>';

    listOfCats += data
      .map(({ id, name }) => `<option value="${id}">${name}</option>`)
      .join('');

    refs.select.innerHTML = listOfCats;

    selectShow();

    new SlimSelect({
      select: '.breed-select',
    });

    loadPage();
  })
  .catch(err => {
    Report.failure(
      'Oops! Something went wrong!',
      `Try reloading the page! ${err}`,
      'OK'
    );
  });

refs.select.addEventListener('change', handlerGetCat);

function handlerGetCat(evt) {
  loadingPage();

  fetchCatByBreed(evt.target.value)
    .then(renderCats)
    .catch(err => {
      Report.failure(
        'Oops! Something went wrong!',
        `Try reloading the page! ${err}`,
        'OK'
      );
    });
}

function renderCats(arrCats) {
  if (!arrCats.length) {
    Report.warning(
      'No information found about the cat',
      'Choose another cat or try reloading the page!',
      'OK'
    );
    loadPage();
    return;
  }

  const {
    url,
    breeds: [{ name, description, temperament, vetstreet_url, wikipedia_url }],
  } = arrCats[0];

  let urls = '';

  if (!!vetstreet_url || !!wikipedia_url) {
    const vetstreet = vetstreet_url
      ? `<a target="_blank" href="${vetstreet_url}">vetstreet</a>`
      : '';

    let wikipedia = wikipedia_url
      ? `<a target="_blank" href="${wikipedia_url}">wikipedia</a>`
      : '';

    if (!!vetstreet_url && !!wikipedia_url) wikipedia += ',';

    urls = `<p class="italic"><span class="bold">See more:</span> ${wikipedia} ${vetstreet}</p>`;
  }
  refs.catInfo.innerHTML = `<img class="cat-img" width="400" src="${url}" alt="cat">
          <div class="cat-descr">
          <h3>${name}</h3>
          <p>${description}</p>
          <p><span class="bold">Temperament:</span> ${temperament}</p>${urls}
          </div>`;

  loadPage();
}

function loadingPage() {
  refs.modal.classList.remove('is-hidden');
  refs.catInfo.innerHTML = '';
}

function loadPage() {
  refs.modal.classList.add('is-hidden');
}

function selectHide() {
  refs.select.classList.add('hide');
}
function selectShow() {
  refs.select.classList.remove('hide');
}
