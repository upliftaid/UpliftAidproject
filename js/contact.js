document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    try {
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        document.getElementById("contact-form").reset(); // Clear the form fields
      } else {
        alert("Failed to send the message.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending the message.");
    }
  });