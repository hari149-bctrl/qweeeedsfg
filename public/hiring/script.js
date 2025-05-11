let resultData;

fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRaPiN1rMzLPcz25HssuMuyrQWaA4z0U9u1ElezPTySTx7jvL23KjxjTmQrdMOami8GIxyBIJDwrn4W/pub?output=csv")
  .then(response => response.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function (result) {
        resultData = result.data;
        console.log(resultData)
        updateJobListings(resultData);

      }
    });
  })
  .catch(error => console.error("Error fetching CSV:", error));

function updateJobListings(data) {
  const container = document.querySelector(".hiringContainer");
  document.querySelector(".loading").classList.add("hidden");

  container.innerHTML = ""; // Clear existing HTML

  data.forEach(job => {
    const companyLogo = job['Company logo url'] ? job['Company logo url'].trim() : '';
    const jobHTML = `
        <div class="card-container">
            <div class="subContainer">
                    <img class="hero-image" 
                        src="${companyLogo}" 
                        alt="Company Logo" 
                        onerror="this.onerror=null; this.src='../Images/hiring/brainyhiringimage.png';"                <main class="main-content">
                    <h1 style="text-decoration: underline;">${job['Company Name']}</h1>
                    <p>${job['Job description']}</p>
                </main>
            </div>
            <div>
                <div class="flex-row">
                    <div class="coin-base"></div>
                    <div class="time-left">
                        <img src="../Images/hiring/deadline.png" alt="clock" class="small-image"/>
                        <p>${daysLeft(job['Deadline'])} days left</p>
                    </div>
                </div>
                <div class="card-attribute">
                    <p class="applyLink"><span><a href="${job['Apply Link']}" target="_blank" rel="noopener noreferrer">Apply now</a></span></p>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = jobHTML + container.innerHTML; // Prepend new job at the top
  });
}


function daysLeft(targetDateStr) {
    // Convert the target date (MM/DD/YYYY) to a Date object
    let targetDate = new Date(targetDateStr);

    // Get today's date (without time)
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

    // Calculate difference in milliseconds and convert to days
    let diffInMs = targetDate - today;
    let daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert ms to days

    return daysLeft;
}