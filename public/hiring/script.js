let resultData;

async function fetchJobs() {
  try {
    const response = await fetch('/hire/data'); // Make sure this matches your backend route
    const data = await response.json();  
    console.log(data);          // Parse JSON response
    updateJobListings(data);                            // You’ll now see all job objects
  } catch (err) {
    console.error("Failed to fetch jobs", err);
  }
}
fetchJobs();

// fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRaPiN1rMzLPcz25HssuMuyrQWaA4z0U9u1ElezPTySTx7jvL23KjxjTmQrdMOami8GIxyBIJDwrn4W/pub?output=csv")
//   .then(response => response.text())
//   .then(csvText => {
//     Papa.parse(csvText, {
//       header: true,
//       skipEmptyLines: true,
//       complete: function (result) {
//         resultData = result.data;
//         console.log(resultData)
//         updateJobListings(resultData);

//       }
//     });
//   })
//   .catch(error => console.error("Error fetching CSV:", error));

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
                        onerror="this.onerror=null; this.src='../Images/hiring/brainyhiringimage.png';"                
                    <main class="main-content">
                      <h1 style="text-decoration: underline;">${job.company}</h1>
                      <p class="in-text"><img src="../Images/hiring/work.png" alt="💼"><span class="boldText">${job.data.role}</span></p>
                      <p class="in-text"><img src="../Images/hiring/salary.png" alt="💰"><span class="boldText">${job.data.salary}</span></p>
                      <p class="in-text"><img src="../Images/hiring/location.png" alt="📍"><span class="boldText">${job.data.location}</span></p>
                  </main>
            </div>
            <div>
                <div class="flex-row">
                    <div class="coin-base"></div>
                    <div class="time-left">
                        <img src="../Images/hiring/deadline.png" alt="clock" class="small-image"/>
                        <p>${daysLeft(job.data.expires)} days left</p>
                    </div>
                    </div>
                    <div class="card-attribute">
                        <p class="applyLink"><span><a href="${job.link}" target="_blank" rel="noopener noreferrer">Apply now</a></span></p>
                    </div>
            </div>
        </div>
    `;
    container.innerHTML = jobHTML + container.innerHTML; // Prepend new job at the top
  });
}


function daysLeft(targetDateStr) {
  try {
    // Parse the target date (handles both ISO format and others)
    const targetDate = new Date(targetDateStr);
    
    // Validate the date
    if (isNaN(targetDate.getTime())) {
      throw new Error("Invalid date format");
    }

    // Get current date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffInMs = targetDate - today;
    const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    // Handle expired dates
    return daysLeft >= 0 ? daysLeft : 0;
    
  } catch (error) {
    console.error("Error calculating days left:", error.message);
    return null; // or throw error depending on your use case
  }
}


function toggleMenu() {
    const dropdowns = document.getElementById("dropdownMenu");
    dropdowns.classList.toggle("show");
  }