function showContent(section, event) {
    // Hide all headers and content sections
    document.getElementById('headerMain').style.display = 'none';
    document.getElementById('headerFavorites').style.display = 'none';
    document.getElementById('headerList').style.display = 'none';
    document.getElementById('contentMainCell').style.display = 'none';
    document.getElementById('contentFavoritesCell').style.display = 'none';
    document.getElementById('contentListCell').style.display = 'none';

    // Show the selected header and content section
    if (section === 'contentMain') {
        document.getElementById('headerMain').style.display = 'block';
        document.getElementById('contentMainCell').style.display = 'block';
    } else if (section === 'contentFavorites') {
        document.getElementById('headerFavorites').style.display = 'block';
        document.getElementById('contentFavoritesCell').style.display = 'block';
    } else if (section === 'contentList') {
        document.getElementById('headerList').style.display = 'block';
        document.getElementById('contentListCell').style.display = 'block';
    }

    // Remove underline from all menu items
    const menuItems = document.querySelectorAll('#leftMenu p');
    menuItems.forEach(item => item.classList.remove('underlined'));

    // Underline the selected menu item
    if (event && event.target) {
        event.target.classList.add('underlined');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const aboutMeMenuItem = document.querySelector("#leftMenu p:first-child");
    console.log("DOMContentLoaded event fired");
    showContent('contentMain', { target: aboutMeMenuItem });
    aboutMeMenuItem.classList.add('underlined');
});