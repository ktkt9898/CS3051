function showContent(section) {
    // Hide all headers and content sections
    document.getElementById('headerMain').style.display = 'none';
    document.getElementById('headerFavorites').style.display = 'none';
    document.getElementById('headerList').style.display = 'none';
    document.getElementById('contentMain').style.display = 'none';
    document.getElementById('contentFavorites').style.display = 'none';
    document.getElementById('contentList').style.display = 'none';

    // Show the selected header and content section
    if (section === 'main') {
        document.getElementById('headerMain').style.display = 'block';
        document.getElementById('contentMain').style.display = 'block';
    } else if (section === 'favorites') {
        document.getElementById('headerFavorites').style.display = 'block';
        document.getElementById('contentFavorites').style.display = 'block';
    } else if (section === 'list') {
        document.getElementById('headerList').style.display = 'block';
        document.getElementById('contentList').style.display = 'block';
    }
}

// Show the default content on page load
showContent('main');