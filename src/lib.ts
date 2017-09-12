/**
 * This is to be used by the application code to re-bundle the 3rd party libraries that are in the lib-bundle.js
 * 
 * 
 * Important: 
 * 	- Below, we are just using the "typeof ..." of the external libraries as must not reimport them as they
 *    are already in the global scope (i.e., window)
 */



// Note: here we "require" the d3, handlebars, and mvdom just for the Type. 
//       As we just export the variable from the global/window variable and use the module just for types
//       none of those libraries will be re-imported (as it will be already package in the lib-bundle.js from the js-lib/index.ts)
import _d3 = require("d3");
import _handlebars = require("handlebars/runtime");
import _mvdom = require("mvdom");

// We also export the Mvdom Type View so that we can create a base view.
export { View, AnyView } from "mvdom";

// Again, this is just to allow to have consistent imports from application, and we can assume that the 
// window.__libname__ will be loaded from the js-lib/index.js

export let mvdom: typeof _mvdom = (<any>window).mvdom;

export let Handlebars: typeof _handlebars = (<any>window).Handlebars;

export let d3: typeof _d3 = (<any>window).d3;