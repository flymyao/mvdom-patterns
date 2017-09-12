/**
 * This is where the 3rd party get imported and put in the global scope. 
 * 
 * This is not a .ts file and should not be used a import in the app code. 
 * 
 * `src/lib.ts` is re-exporting and typing those modules for application use.
 * 
 */

// Put the handlebars in the global context 
window.Handlebars = require("handlebars/runtime");
Handlebars.templates = {};

window.mvdom = require("mvdom");

// Export the d3 js
window.d3 = require("d3");


