function showContent(section, event) {
    // Hide all headers and content sections
    document.getElementById('headerMain').style.display = 'none';
    document.getElementById('headerFavorites').style.display = 'none';
    document.getElementById('headerList').style.display = 'none';
    document.getElementById('contentMain').style.display = 'none';
    document.getElementById('contentFavorites').style.display = 'none';
    document.getElementById('contentList').style.display = 'none';

    // Show the selected header and content section
    if (section === 'contentMainCell') {
        document.getElementById('headerMain').style.display = 'block';
        document.getElementById('contentMain').style.display = 'block';
    } else if (section === 'contentFavoritesCell') {
        document.getElementById('headerFavorites').style.display = 'block';
        document.getElementById('contentFavorites').style.display = 'block';
    } else if (section === 'contentListCell') {
        document.getElementById('headerList').style.display = 'block';
        document.getElementById('contentList').style.display = 'block';
    }

    // Remove underline from all menu items
    const menuItems = document.querySelectorAll('#leftMenu p');
    menuItems.forEach(item => item.classList.remove('underlined'));

    // Underline the selected menu item
    if (event && event.target) {
        event.target.classList.add('underlined');
    }
}

// Ensure the default content is shown and "About Me" is underlined on page load
document.addEventListener("DOMContentLoaded", function() {
    const aboutMeMenuItem = document.querySelector("#leftMenu p:first-child");
    showContent('contentMainCell', { target: aboutMeMenuItem });
});