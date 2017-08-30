// Somehow "handlebars/handlebars.runtime" is found by VSCode and tsc, but not by tsify/browserify. 
//		So, we extended the global scope at "global.d.ts"
import Handlebars = require("handlebars/runtime");

// Put the handlebars in the global context 
(<any>window).Handlebars = Handlebars;
// Set the .templates for the compiled .tmpl
// Note: We could do this in the app js layer, but this way, it allows us to load the template before the app-bundle.js
Handlebars.templates = {};

// Import the mvdom lib and put it in the global scope.
// Note: If we do not use the mvdom, it won't add
import mvdom = require("mvdom");
(<any>window).mvdom = mvdom;

// Export the d3 js
import d3 = require("d3");
(<any>window).d3 = d3;


