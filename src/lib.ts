/**
 * This is to be used by the application code to re-bundle the 3rd party libraries that are in the lib-bundle.js
 * 
 * 
 * Important: 
 * 	- Below, we are just using the "typeof ..." of the external libraries as must not reimport them as they
 *    are already in the global scope (i.e., window)
 */


// Note: Just import them to get the "typeof ..." below, so that the app code can benefit from their types.
import _d3 = require("d3");
import _handlebars = require("handlebars/runtime");
import _mvdom = require("mvdom");

// Mvdom, allso to export those useful interface as well, and since MVDOM is a "require js module" we have to do that separately for now.
export { View, AnyView } from "mvdom";

// Now we re-export the libraries that were put in the global scope by lib-bundle.js, but with their appropriate type.
export let mvdom: typeof _mvdom = (<any>window).mvdom;
export let Handlebars: typeof _handlebars = (<any>window).Handlebars;
export let d3: typeof _d3 = (<any>window).d3;