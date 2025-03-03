const fetchLeadership = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/leaderships", {
        method: "GET",
      });
  
      const data = await response.json();
      const leadershipData = data.data;
      displayLeadership(leadershipData);
    } catch (error) {
      console.error("Error fetching leadership data:", error.message);
    }
  };
  
  const displayLeadership = (leadershipData) => {
    const leadershipContainer = document.getElementById("leadership-container");
  
    // Clear existing leadership data
    leadershipContainer.innerHTML = `
      <div class="col-md-12 mb-5 text-center mt-5">
        <h2>Leadership</h2>
      </div>
    `;
  
    leadershipData.forEach((leader) => {
      const leaderElement = document.createElement("div");
      leaderElement.classList.add("col-md-6", "col-lg-3");
  
      const imageUrl = leader.images || "images/default.jpg";
  
      leaderElement.innerHTML = `
        <div class="block-38 text-center">
          <div class="block-38-img">
            <div class="block-38-header">
              <img src="${imageUrl}" alt="Image placeholder" class="leader-img">
              <h3 class="block-38-heading">${leader.name}</h3>
              <p class="block-38-subheading">${leader.role}</p>
            </div>
            <div class="block-38-body">
              <p>${leader.about}</p>
            </div>
          </div>
        </div>
      `;
  
      leadershipContainer.appendChild(leaderElement);
    });
  };
  
  // Fetch leadership data when the page loads
  document.addEventListener("DOMContentLoaded", fetchLeadership);
  