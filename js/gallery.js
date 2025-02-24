
  async function fetchImages() {
    const response = await fetch('http://locahost:3000/gallery');
    const data = await response.json();
    return data.data;
  }

  async function loadImages() {
    const images = await fetchImages();
    const container = document.getElementById('site-section, container, row');
    container.innerHTML = ''; // Clear existing content

    images.forEach(image => {
      const imgSrc = image.images[0].url; // Adjust the path according to your Strapi response
      const imgHtml = `
        <div class="col-md-4">
          <a href="${imgSrc}" class="img-hover" data-fancybox="gallery">
            <span class="icon icon-search"></span>
            <img src="${imgSrc}" alt="Image placeholder" class="img-fluid" />
          </a>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', imgHtml);
    });
  }

  loadImages();

