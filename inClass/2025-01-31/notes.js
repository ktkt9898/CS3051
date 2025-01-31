/**
 * Defer tells HTML to run the script after the page has loaded,
 * Async tells HTML to run the script while the page is loading/in parallel.
 * 
 * 
 */

var a = 5;
console.log(a);

// let or const are two options from var

let b = 10;
console.log(b);

const c = 20;
console.log(c);

// Var with ` allows a template
var x = 5;
console.log(`\nx=${x}, y=${y}`);
var y = 10;

/**
 * Output is x = 5, y = undefined
 * This is called hoisting, where the variable is declared at the top of the scope.
 * Var can be redeclared with the same name. This is a problem in JavaScript.
 * Let is preferred over var.
 */

let x = 5;
console.log(`\nz=${x}, z=${z}`);
let z = 10;

/** Let does not hoist, and prevents initialization of z, resulting in undefined.
 * Var was hoisted, declared, and prompted the value of y to be undefined.
 * Let must be declared before it is used.
 */

let w = 5;
console.log(`\nz=${w}`);
let w = 10;

/** w cannot be redeclared, and helps avoid conflict with names
 * Forces scope, where the variable is only available within the block it is declared.
*/

const d = 300;
d = 5;

/** Const is similar to let, but cannot be re-assigned to a different value, similar to final in Java */

let u = "Hello";
function myFunc() {
    // Every value has a scope, and the value is only available within the function/inner code blocks { }
    // The const y is only available within the function and when the function is called.
    const y = " World";
    return y;
}
console.log(u + myFunc());