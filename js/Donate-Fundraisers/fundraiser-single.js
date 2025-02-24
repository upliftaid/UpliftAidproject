const fetchFundraiser = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fundraiserId = urlParams.get("id");
  try {
    const response = await fetch(
      `http://localhost:3000/fundraisers/${fundraiserId}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    const fundraiser = data.data;
    displayFundraiser(fundraiser);
  } catch (error) {
    console.error("Error fetching fundraiser details:", error);
  }
};

const displayFundraiser = (fundraiser) => {
  const blockContainer = document.getElementById("blockContainer");
  const fundraiserContainer = document.getElementById("fundraiser");
  const imageUrl = fundraiser.images || "images/default.jpg"; // Use a default image URL if undefined

  fundraiserContainer.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <h2 class="mb-3 mt-5">${fundraiser.title}</h2>
          <p class="mb-4">
            <img src="${imageUrl}" alt="${
    fundraiser.title
  }" class="img-fluid" />
          </p>
          <span class="date mb-4 d-block text-muted">${new Date(
            fundraiser.startDate
          ).toLocaleDateString()}</span>
          <p>${fundraiser.descriptionHtml}</p>
        </div>
         <div class="col-md-4 sidebar side-block">
          <div class="sidebar-box" id="most-viewed-posts">
                  <div class="post-entry ">
                    <p><strong>Funds to be raised:</strong> $${
                      fundraiser.goalAmount
                    }</p>
          <p><strong>Raised amount:</strong> $${fundraiser.raisedAmount}</p>
          <button class="btn btn-success" onclick="window.location.href='donate.html?id=${
            fundraiser.documentId
          }'">Donate Now</button>
      </div></div>
        </div>
      </div>
    </div>
  `;

  blockContainer.innerHTML = `
    <div class="block-30 block-30-sm item" style="background-image: url(${imageUrl})" data-stellar-background-ratio="0.5">
      <div class="container">
        <div class="row align-items-center justify-content-center text-center">
          <div class="col-md-12">
            <span class="text-white text-uppercase">${new Date(
              fundraiser.startDate
            ).toLocaleDateString()}</span>
            <h2 class="heading mb-5">${fundraiser.title}</h2>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Fetch fundraiser when the page loads
document.addEventListener("DOMContentLoaded", fetchFundraiser);
