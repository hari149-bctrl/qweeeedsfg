 // Initialize EmailJS with your User ID
(function(){
    emailjs.init("GuGeI9L9qH1eMTc-2"); // Replace with your actual EmailJS User ID
})();

function sendMail(event) {
    event.preventDefault(); // Prevent page refresh

    let params = {
        from_name: document.getElementById("name").value,  // Sender's name
        to_name: "Brainy Voyage Support",  // Your email recipient name
        message: document.getElementById("message").value // User's message
    };

    emailjs.send("service_bspxd1d", "template_isgle6f", params)
        .then(function(response) {
            alert("Message sent successfully! ✅");
            console.log("Success:", response);
        }, function(error) {
            alert("Message failed to send ❌");
            console.log("Error:", error);
        });
}

emailjs.send("service_bspxd1d", "template_isgle6f", params)