/**
 * Arrow function purpose:
 * 
 * Traditional function
 * function foo(x, y) {
 * 
 * }
 * 
 * setTimeout(function(x, y) {
 * 
 * }
 * 
 * Arrow function
 * setTimeout((x, y) => {
 * }
 * 
 * JavaScript conditional statements
 */

function a() {
    console.log('a');
}

function b(x, y) {
    console.log('b');
    function c(value) {
        return '$' + value;
    }
    return c(x + y);
}

console.log(a());
console.log(b(1, 2));

let array = [1, 2, 3, 4, 5];
console.log(array.length);

// For each is easier to use but slower than a traditional for loop
array.forEach(function(value, index) {
    console.log(value);
});

// Loop with keyword "in"
// In will retrieve the index and values
for(let i in array) {
    console.log(array[i]);
}

// Loop with keyword "of"
// Of will retrieve the values only
for (let i of array) {
    console.log(i);
}

// To modify styles the for loop works and the of loop works, but the in loop does not work
// QuerySelectorAll returns a NodeList (an array)
// QuerySelector returns only a single value