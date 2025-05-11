(function() {
    emailjs.init("GuGeI9L9qH1eMTc-2"); // Replace with your actual EmailJS User ID
})();

function sendMail(event) {
    event.preventDefault(); // Prevent default form submission
    
    let statusMessage = document.getElementById("statusMessage");
    statusMessage.innerText = "Sending... ⏳"; // Indicate message is being sent

    let params = {
        from_name: document.getElementById("name").value,  
        from_email: document.getElementById("email").value, // Capture email
        to_name: "Brainy Voyage Support",
        message: document.getElementById("message").value
    };

    emailjs.send("service_bspxd1d", "template_isgle6f", params)
        .then(function(response) {
            statusMessage.innerText = "Message sent successfully! ✅";
            console.log("Success:", response);
            document.getElementById("contact-form").reset();
        })
        .catch(function(error) {
            statusMessage.innerText = "Message failed to send ❌";
            console.log("Error:", error);
            document.getElementById("contact-form").reset();
        });
}