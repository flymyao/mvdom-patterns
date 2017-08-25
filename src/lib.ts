// This module is mostly a re-export packaging for 3rd party libraries. 
// It is very important that all other .ts file import those libraries from this module and not directly. 
// "re-packaging" allows application code to not have to worry about the intricacies of 3rd party libs, and simply import what needs in a standard ES/TS way. 

// Somehow "handlebars/handlebars.runtime" is found by VSCode and tsc, but not by tsify/browserify. 
//		So, we extended the global scope at "global.d.ts"
export import Handlebars = require("handlebars/runtime");

// we export the MVDOM types
export { Mvdom, ViewController, View } from "mvdom/types/Mvdom";

// import and re-export the mvdom lib to match the ES7/Typescript export scheme
export import mvdom = require("mvdom");
// this is equivalent to: 
// import * as d from "mvdom";
// export let mvdom = d;


// export the d3 js
export import d3 = require("d3");

// Put the handlebars in the global context and set the .templates for the compiled .tmpl
// Note: we could do this in the init.ts, but here we are sure it is done as soon as someone import Handlebars
(<any>window).Handlebars = Handlebars;
Handlebars.templates = {};