document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const res = await fetch("/send", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, message })
    });

    const result = await res.json();
    const statusEl = document.getElementById("statusMessage");
    statusEl.textContent = result.message;
    statusEl.style.color = result.success ? "green" : "red";
});