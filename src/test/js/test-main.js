var d = mvdom; // external lib
var route = require("js-app/route.js");


d.on(document,"APP_LOADED", function(){
	
	// then add this new MainView
	d.display("TestMainView", d.first("body")).then(function(){

		// initialize the route, which will trigger a "CHANGE" on the routeHub hub. 
		// Note: we do that once the MainView has been added to the DOM so that it can react accordingly
		route.init();

	});	
});



