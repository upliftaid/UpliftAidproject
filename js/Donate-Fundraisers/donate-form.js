const fetchFundraisers = async () => {
  try {
    const response = await fetch("http://localhost:3000/fundraisers", {
      method: "GET",
    });

    const data = await response.json();
    const fundraiserData = data.data;
    displayFetchFundraisers(fundraiserData);
    attachEventListeners(); // Attach event listeners after displaying the fundraisers
  } catch (error) {
    console.error(error.message);
  }
};

let fetchFundraiser = [];

const displayFetchFundraisers = (fundraiserData) => {
  const fundraiserContainer = document.getElementById("fundraisers-container");

  // Clear existing fundraisers
  fundraiserContainer.innerHTML = "";

  fundraiserData.forEach((fundraiser) => {
    const fundraiserElement = document.createElement("div");
    fundraiserElement.classList.add("card", "fundraise-item");
    const imageUrl = fundraiser.images || "images/default.jpg";

    fundraiserElement.innerHTML = `
      <a href="fundraisers-single.html?id=${fundraiser.documentId}">
        <img class="card-img-top" src="${imageUrl}" alt="Image placeholder" />
      </a>
      <div class="card-body">
        <h3 class="card-title">
          <a href="fundraisers-single.html?id=${fundraiser.documentId}">${
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
        <button class="btn btn-success donate-btn" data-fundraiser="${
          fundraiser.title
        }">Donate Now</button>
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
};

const attachEventListeners = () => {
  document.querySelectorAll(".donate-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const fund = button.getAttribute("data-fundraiser");
      document.getElementById("fund").value = fund;
      document
        .getElementById("donate-form")
        .scrollIntoView({ behavior: "smooth" });
    });
  });
};

// Fetch fundraisers when the page loads
document.addEventListener("DOMContentLoaded", fetchFundraisers);

// Function to set the amount in the input field
function setAmount(amount) {
  document.getElementById("amount").value = amount;
}

document
  .getElementById("payment-method")
  .addEventListener("change", function () {
    const paymentMethods = document.querySelectorAll(".payment-details");
    paymentMethods.forEach((method) => (method.style.display = "none"));
    const selectedMethod = document.getElementById(this.value + "-details");
    if (selectedMethod) {
      selectedMethod.style.display = "block";
    }
  });
