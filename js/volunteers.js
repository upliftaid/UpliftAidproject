
document
  .getElementById("volunteer-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      message: document.getElementById("message").value,
      availability: document.getElementById("availability").value,
      preferredActivities: document.getElementById("preferred-activities")
        .value,
    };

    try {
      const response = await fetch("http://localhost:3000/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        document.getElementById("volunteer-form").reset(); // Clear the form fields
      } else {
        alert("Failed to submit the application.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting the application.");
    }
  });