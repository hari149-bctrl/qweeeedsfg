document.addEventListener("DOMContentLoaded", function () {
  let countdown = 5; // Countdown starts at 5 seconds
  let dataFetched = false; // Track if data has been fetched
  const warningMsg = document.getElementById("warningMessage");
  const countdownElement = document.getElementById("countdown");
  const fileContainer = document.getElementById("fileContainer");

  // Start Countdown Timer
  const countdownInterval = setInterval(() => {
      countdown--;
      countdownElement.textContent = `Closing in ${countdown} seconds`; // Update countdown text

      if (countdown <= 0) {
          clearInterval(countdownInterval); // Stop countdown
          checkHideWarning(); // Check if both conditions are met
      }
  }, 1000); // Updates every second

  // Fetch Data from CSV
  function loadFileLinks() {
      fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTy_UvSyZ0txYJGr1ffD2CV7pKvXEGOeD0SJsNgxPpX8_AeQxXVoEc44YefygkDZ4iU90_kWlZgJLQc/pub?output=csv")
          .then(response => response.text())
          .then(csvText => {
              Papa.parse(csvText, {
                  header: true,
                  skipEmptyLines: true,
                  complete: function (result) {
                      updateJobListings(result.data);
                      dataFetched = true; // Mark data as fetched
                      checkHideWarning(); // Check if both conditions are met
                  }
              });
          })
          .catch(error => console.error("Error fetching CSV:", error));
  }

  function updateJobListings(data) {
      const container = document.querySelector(".fileLinksContainer");
      container.innerHTML = ""; // Clear existing content

      data.forEach(job => {
          const jobHTML = `
                <a href="https://drive.google.com/uc?export=download&confirm=yes&id=${job['File ID']}" target="_blank" rel="noopener noreferrer" class="link-container">${job['File Name']}</a>

          `;
          container.innerHTML += jobHTML; // Append job listings correctly
      });
  }

  // Check if both conditions (5s + data fetch) are met
  function checkHideWarning() {
      if (countdown <= 0 && dataFetched) { // Both conditions should be true
          warningMsg.classList.add("hidden"); // Hide warning smoothly

          setTimeout(() => {
              warningMsg.style.display = "none"; // Fully hide warning
              fileContainer.classList.remove("hidden"); // Ensure files are visible
              fileContainer.classList.add("show"); // Apply fade-in effect
          }, 800);
      }
  }

  // Start fetching data
  loadFileLinks();
});
