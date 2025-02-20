function showContent(contentId) {
    // Hide all content cells
    document.getElementById('contentMainCell').style.display = 'none';
    document.getElementById('contentFavoritesCell').style.display = 'none';
    document.getElementById('contentListCell').style.display = 'none';

    // Hide all headers
    document.getElementById('headerMain').style.display = 'none';
    document.getElementById('headerFavorites').style.display = 'none';
    document.getElementById('headerList').style.display = 'none';

    // Show the selected content cell and corresponding header
    document.getElementById(contentId + 'Cell').style.display = 'block';

    // Concatenate header + the name of the camel case contentId
    document.getElementById('header' + contentId.replace('content', '')).style.display = 'block';

    // Remove underline from all menu items
    document.querySelectorAll('#leftMenu p').forEach(function(menuItem) {
        menuItem.classList.remove('underlined');
    });

    // Add underline to the selected menu item child from the leftMenu container
    if (contentId === 'contentMain') {
        document.querySelector('#leftMenu p:nth-child(1)').classList.add('underlined');
    } else if (contentId === 'contentFavorites') {
        document.querySelector('#leftMenu p:nth-child(2)').classList.add('underlined');
    } else if (contentId === 'contentList') {
        document.querySelector('#leftMenu p:nth-child(3)').classList.add('underlined');
    }
}

// Ensure About Me is shown first on page load
window.onload = function() {
    showContent('contentMain');
};