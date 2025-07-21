// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const statusDiv = document.getElementById('contact-form-status');
    
    if (form) {
        // Add event listener for form submission
        form.addEventListener('submit', function(event) {
            // Prevent the default form submission
            event.preventDefault();
            
            // Change button text and disable it
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            
            // Collect form data
            const formData = new FormData(form);
            
            // Send form data using fetch API
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // Show success message
                statusDiv.innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">Your message has been sent successfully! I\'ll get back to you soon.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                
                // Reset the form
                form.reset();
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            })
            .catch(error => {
                // Show error message
                statusDiv.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Oops! There was a problem sending your message. Please try again later.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                console.error('Error:', error);
            });
        });
    }
});