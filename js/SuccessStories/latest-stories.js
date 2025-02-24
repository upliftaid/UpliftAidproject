async function latestStories() {
  try {
    const response = await fetch("http://localhost:3000/story");
    const data = await response.json();
    const stories = data.data;

    // Sort stories by publish date in descending order
    const sortedStories = stories.sort(
      (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
    );

    // Get the three most recent stories
    const recentStories = sortedStories.slice(0, 3);

    const slider = document.querySelector(".slider");

    recentStories.forEach((post, index) => {
      const slideElement = document.createElement("div");
      slideElement.classList.add("slide");
      if (index === 0) {
        slideElement.classList.add("active"); // Make the first slide active
      }
      slideElement.innerHTML = `
        <div class="featured-section overlay-color-2" style="background-image: url('${post.images}')">
          <div class="container">
            <div class="row">
              <div class="col-md-6">
                <img src="${post.images}" alt="Image placeholder" class="img-fluid" />
              </div>
              <div class="col-md-6 pl-md-5">
                <span class="featured-text d-block mb-3">Success Stories</span>
                <h2>${post.title}</h2>
                <p class="mb-3">${post.descriptionHtml.substring(0, 150)}...</p>
                <p>
                  <a href="success-story-single.html?id=${post.documentId}" class="btn btn-success btn-hover-white py-3 px-5">Read The Full Story</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
      slider.appendChild(slideElement);
    });

    // Initialize the slides and event listeners after populating the slider
    initializeSlider();

  } catch (error) {
    console.error("Error fetching story:", error);
  }
}

// Initialize the slider and set up event listeners
function initializeSlider() {
  let slideIndex = 0;
  const slides = document.querySelectorAll('.slider .slide');
  const totalSlides = slides.length;

  function showSlide(index) {
    // Adjust index if out of bounds
    if (index >= totalSlides) {
      slideIndex = 0;
    } else if (index < 0) {
      slideIndex = totalSlides - 1;
    } else {
      slideIndex = index;
    }

    // Move the slider
    document.querySelector('.slider').style.transform = `translateX(${-slideIndex * 100}%)`;
  }

  // Initialize the first slide
  showSlide(slideIndex);

  // Auto-slide every 10 seconds
  let autoSlideInterval = setInterval(() => {
    showSlide(slideIndex + 1);
  }, 10000);

  // Next and Previous Button Event Listeners
  document.querySelector('.next').addEventListener('click', function() {
    clearInterval(autoSlideInterval);
    showSlide(slideIndex + 1);
    // Restart the auto-slide
    autoSlideInterval = setInterval(() => {
      showSlide(slideIndex + 1);
    }, 10000);
  });

  document.querySelector('.prev').addEventListener('click', function() {
    clearInterval(autoSlideInterval);
    showSlide(slideIndex - 1);
    // Restart the auto-slide
    autoSlideInterval = setInterval(() => {
      showSlide(slideIndex + 1);
    }, 10000);
  });
}

// Fetch stories when the page loads
document.addEventListener("DOMContentLoaded", latestStories);
