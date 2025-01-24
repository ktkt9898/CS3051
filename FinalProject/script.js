function toggleImage(imageId) {
    var img = document.getElementById(imageId);
    if (img.style.display == "none") {
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }
}