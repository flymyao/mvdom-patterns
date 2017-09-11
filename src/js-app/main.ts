import { mvdom } from "../lib";
import { route } from "./route";
import { MainView } from "../view/MainView";


mvdom.on(document, "APP_LOADED", function () {

	// then add this new MainView
	mvdom.display(MainView, mvdom.first("body")).then(function () {
		// initialize the route, which will trigger a "CHANGE" on the routeHub hub. 
		// Note: we do that once the MainView has been added to the DOM so that it can react accordingly
		route.init();
	});

});
