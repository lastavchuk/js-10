function fetchBreeds() {
  return fetch('https://api.thecatapi.com/v1/breeds').then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}

function fetchCatByBreed(breedId) {
  const API_KEY =
    'live_UFIan19UFzW8Pv5t5BSTaaec4Bchz8MbisacIs1bGpG8fqT9ST2fTLlQHECoUr6N';
  return fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`,
    {
      headers: {
        'x-api-key': API_KEY,
      },
    }
  ).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    return resp.json();
  });
}

export { fetchBreeds, fetchCatByBreed };
