/**
 * This is the 3rd party Library which will generate the web/lib-bundle.js to be loaded separately. 
 * It will not be compiled by Typescript, just bundled by browserify (simpler is better).
 * 
 * Notes: 
 *  - It does not have to be a ts files as this won't be imported in application code (but just here to populate the global window scope with those libs).
 *  - In fact, it is even better to compile this file separately without typescript as it simplify some 3rd party modules loading.
 * 
 * IMPORTANT: 
 *  - This file should NOT be imported in the app code, it will generiate the web/js/lib-bundle.js and be loaded as its own script tag.
 * 	- App code should import the src/lib which contain the definition of these libraries in a typescript way (and use the window scope to get the module)
 * 
 */

// Put the handlebars in the global context 
window.Handlebars = require("handlebars/runtime");
Handlebars.templates = {};

window.mvdom = require("mvdom");

// Export the d3 js
window.d3 = require("d3");


