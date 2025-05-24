// Global variables
let allJobs = [];
let filteredJobs = [];

// DOM elements
const hiringContainer = document.querySelector(".hiringContainer");
const loadingElement = document.querySelector(".loading");
const searchInput = document.querySelector(".search-bar input");
const searchButton = document.querySelector(".search-bar button");
const dropdownMenu = document.getElementById("dropdownMenu");
const menuToggle = document.querySelector(".menu-toggle");

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await fetchJobs();
    setupUI();
    setupEventListeners();
});

// Fetch jobs from server
async function fetchJobs() {
    try {
        showLoading();
        const response = await fetch('/hire/data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allJobs = await response.json();
        filteredJobs = [...allJobs];
    } catch (err) {
        console.error("Failed to fetch jobs", err);
        showError("Failed to load jobs. Please try again later.");
    } finally {
        hideLoading();
        updateJobListings(filteredJobs);
    }
}

// Setup UI components dynamically
function setupUI() {
    // Clear existing dropdowns
    dropdownMenu.innerHTML = '';
    
    // Create company dropdown
    const companyDropdown = document.createElement('select');
    companyDropdown.id = 'companyFilter';
    companyDropdown.innerHTML = '<option value="">All Companies</option>';
    
    // Get unique companies and sort them
    const uniqueCompanies = [...new Set(allJobs.map(job => job.company))].sort();
    uniqueCompanies.forEach(company => {
        companyDropdown.innerHTML += `<option value="${company}">${company}</option>`;
    });
    
    // Create experience dropdown
    const experienceDropdown = document.createElement('select');
    experienceDropdown.id = 'experienceFilter';
    experienceDropdown.innerHTML = `
        <option value="">All Experience Levels</option>
        <option value="fresher">Fresher</option>
        <option value="internship">Internship</option>
        <option value="student">Student</option>
        <option value="ug">Under Graduate</option>
        <option value="pg">Post Graduate</option>
        <option value="experienced">Experienced</option>
    `;
    
    // Add dropdowns to menu
    dropdownMenu.appendChild(companyDropdown);
    dropdownMenu.appendChild(experienceDropdown);
}

// Update job listings in the UI
function updateJobListings(jobs) {
    hiringContainer.innerHTML = "";

    if (!jobs || jobs.length === 0) {
        hiringContainer.innerHTML = `
            <div class="no-jobs">
                <img src="../Images/hiring/nojob.png" alt="No jobs found">
                <p>No jobs found matching your criteria</p>
            </div>
        `;
        return;
    }

    // Sort jobs by expiration date (soonest first)
    jobs.sort((a, b) => new Date(a.data.expires) - new Date(b.data.expires));

    jobs.forEach(job => {
        const companyLogo = job['Company logo url']?.trim() || '../Images/hiring/brainyhiringimage.png';
        const daysLeftValue = daysLeft(job.data.expires);
        const isExpiringSoon = daysLeftValue <= 3;
        const isExpired = daysLeftValue <= 0;
        console.log(job)
        const jobHTML = `
            <div class="card-container ${isExpired ? 'expired' : ''}">
                <div class="subContainer">
                    <img class="hero-image" 
                        src="${companyLogo}" 
                        alt="${job.company} Logo"
                        loading="lazy">
                    <main class="main-content">
                        <h1>${job.company}</h1>
                        <p class="in-text"><img src="../Images/hiring/work.png" alt="Role"><span class="boldText">${job.data.role}</span></p>
                        <p class="in-text"><img src="../Images/hiring/salary.png" alt="Salary"><span class="boldText">${job.data.salary}</span></p>
                        <p class="in-text"><img src="../Images/hiring/location.png" alt="Location"><span class="boldText">${job.data.location}</span></p>
                    </main>
                </div>
                <div class="job-footer">
                    <div class="time-left ${isExpiringSoon ? 'expiring-soon' : ''} ${isExpired ? 'expired' : ''}">
                        <img src="../Images/hiring/deadline.png" alt="Deadline">
                        <p>${isExpired ? 'Expired' : `${daysLeftValue} days left`}</p>
                    </div>
                    <div class="card-attribute">
                        <a href="/hiring/${job.id}" class="applyLink" target="_blank" rel="noopener noreferrer">
                            Apply Now
                        </a>
                    </div>
                </div>
            </div>
        `;
        hiringContainer.innerHTML += jobHTML;
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchButton.addEventListener('click', applyFilters);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyFilters();
    });

    // Dropdown filters
    document.getElementById('companyFilter')?.addEventListener('change', applyFilters);
    document.getElementById('experienceFilter')?.addEventListener('change', applyFilters);

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!dropdownMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
}

// Apply all filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCompany = document.getElementById('companyFilter')?.value || '';
    const selectedExperience = document.getElementById('experienceFilter')?.value || '';

    filteredJobs = allJobs.filter(job => {
        // Search term filter
        const matchesSearch = 
            job.company.toLowerCase().includes(searchTerm) ||
            job.data.role.toLowerCase().includes(searchTerm) ||
            (job.data.location && job.data.location.toLowerCase().includes(searchTerm)) ||
            (job.data.salary && job.data.salary.toLowerCase().includes(searchTerm));

        // Company filter
        const matchesCompany = !selectedCompany || job.company === selectedCompany;

        // Experience level filter
        let matchesExperience = true;
        if (selectedExperience) {
            matchesExperience = job.category[selectedExperience] === true;
        }

        return matchesSearch && matchesCompany && matchesExperience;
    });

    updateJobListings(filteredJobs);
}

// Calculate days left until job expires
function daysLeft(targetDateStr) {
    try {
        const targetDate = new Date(targetDateStr);
        if (isNaN(targetDate.getTime())) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffInMs = targetDate - today;
        return Math.max(0, Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));
    } catch (error) {
        console.error("Error calculating days left:", error);
        return 0;
    }
}

// Toggle dropdown menu on mobile
function toggleMenu() {
    dropdownMenu.classList.toggle('show');
}

// Loading state functions
function showLoading() {
    loadingElement.classList.remove("hidden");
    hiringContainer.innerHTML = "";
}

function hideLoading() {
    loadingElement.classList.add("hidden");
}

function showError(message) {
    loadingElement.textContent = `⚠️ ${message}`;
    loadingElement.classList.remove("hidden");
}