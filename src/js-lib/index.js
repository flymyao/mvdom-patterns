var Handlebars = require("handlebars/runtime")["default"];
var mvdom = require("mvdom");
var gtx = require("gtx");

if (window){
	window.Handlebars = Handlebars;
	window.mvdom = mvdom;
	window.Gtx = gtx;
}