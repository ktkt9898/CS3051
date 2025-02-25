/**
 * document.querySelector("html") in quotes will reveal the entire page
 * 
 * Can assign a variable to change a style
 * In the console remove the dash to convert from CSS to console
 * Instead of background-color, use backgroundColor
 * Instead of margin-left, use marginLeft
 * 
 * All CSS values are strings
 * 
 * Attributes can be retrieved with getAttribute.("attributeName")
 * 
 * window is similar to document, but one level down
 * window.getComputedStyle(h2).color will return the variable/element h2's color
 * 
 * let new E = document.createElement("div") will create a div element
 * document.body.appendChild(newE) will append the div to the body
 * 
 * newE.id="newElement" will assign an id to the new element
 * newE.innerText="Hello World" will assign text to the new element
 * newE.classList.add("red") will add a class to the new element, no need to include the period
 * 
 * The relationships are parents and children
 * The body is the parents of the elements, such as div, h1, etc.
 * document.body.children will return all the children of the body
 */