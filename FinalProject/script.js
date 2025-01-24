function toggleImage(imageId) {
    var img = document.getElementById(imageId);
    if (img.style.display == "none") {
        // Show the image in a new block element
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }
}