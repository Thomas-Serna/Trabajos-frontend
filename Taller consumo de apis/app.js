const API_URL = 'https://jsonplaceholder.typicode.com/photos';

async function getPhotos() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const photos = data.slice(0, 10);

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    photos.forEach(photo => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${photo.thumbnailUrl}" alt="${photo.title}">
        <p>${photo.title}</p>
      `;
      gallery.appendChild(card);
    });
  } catch (error) {
    console.error('Error al obtener las fotos:', error);
  }
}

getPhotos();
