async function latestFundraisers() {
  try {
    const response = await fetch("http://localhost:3000/api/fundraisers");
    const data = await response.json();
    const fundraisers = data.data;

    // Sort fundraisers by start date in descending order
    const sortedFundraisers = fundraisers.sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );

    // Get the six most recent fundraisers
    const recentFundraisers = sortedFundraisers.slice(0, 6);

    const fundraiserContainer = document.getElementById(
      "fundraisers-container"
    );

    // Clear existing fundraisers
    fundraiserContainer.innerHTML = "";

    recentFundraisers.forEach((fundraiser) => {
      const fundraiserElement = document.createElement("div");
      fundraiserElement.classList.add("card", "fundraise-item");
      const imageUrl = fundraiser.images || "images/default.jpg";

      fundraiserElement.innerHTML = `
        <a href="fundraisers-single?id=${fundraiser.documentId}">
          <img class="card-img-top" src="${imageUrl}" alt="Image placeholder" />
        </a>
        <div class="card-body">
          <h3 class="card-title">
            <a href="fundraisers-single?id=${fundraiser.documentId}">${
        fundraiser.title
      }</a>
          </h3>
          <p class="card-text">${fundraiser.descriptionHtml.substring(
            0,
            100
          )}...</p>
          <div class="progress custom-progress-success">
            <div class="progress-bar bg-primary" role="progressbar" style="width: ${Math.min(
              (fundraiser.raisedAmount / fundraiser.goalAmount) * 100,
              100
            )}%" aria-valuenow="${Math.min(
        (fundraiser.raisedAmount / fundraiser.goalAmount) * 100,
        100
      )}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <span class="fund-raised d-block">$${
            fundraiser.raisedAmount
          } raised of $${fundraiser.goalAmount}</span>
        </div>
      `;

      fundraiserContainer.appendChild(fundraiserElement);
    });

    // Reinitialize the carousel after adding new cards
    $(".nonloop-block-11").owlCarousel("destroy"); // Destroy existing carousel
    $(".nonloop-block-11").owlCarousel({
      loop: false,
      margin: 30,
      nav: true,
      items: 3,
      navText: [
        "<span class='ion-md-arrow-back'></span>",
        "<span class='ion-md-arrow-forward'></span>",
      ], // Custom nav buttons
      responsive: {
        0: {
          items: 1,
          nav: false,
        },
        600: {
          items: 2,
          nav: false,
        },
        1000: {
          items: 3,
          nav: true,
          loop: false,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
  }
}

// Fetch fundraisers when the page loads
document.addEventListener("DOMContentLoaded", latestFundraisers);
