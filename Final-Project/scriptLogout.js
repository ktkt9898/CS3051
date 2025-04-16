// Check if the user is logged in (i.e., token exists)
const token = localStorage.getItem('token'); // Or sessionStorage.getItem('token')
const buttonLogout = document.getElementById('buttonLogout');

if (token) {
    // Show the Logout button if the user is logged in
    buttonLogout.style.display = 'inline-block';
}

// Handle Logout button click
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for the logout button
    const logoutButton = document.getElementById('buttonLogout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token'); // Clear the JWT token
            alert('You have been logged out.');
            window.location.href = '/login'; // Redirect to the login page
        });
    } else {
        console.error('Logout button not found in the DOM.');
    }
});