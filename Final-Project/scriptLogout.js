// Check if the user is logged in (i.e., token exists)
const token = localStorage.getItem('token'); // Or sessionStorage.getItem('token')
const logoutButton = document.getElementById('logoutButton');

if (token) {
    // Show the Logout button if the user is logged in
    logoutButton.style.display = 'inline-block';
}

// Handle Logout button click
logoutButton.addEventListener('click', () => {
    // Remove the token from storage
    localStorage.removeItem('token'); // Or sessionStorage.removeItem('token')

    // Redirect to the login page
    window.location.href = '/login';
});