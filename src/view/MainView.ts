import { BaseView, mvdom as d, register} from "../base";
import { HomeView } from "./HomeView";

var pathToView: { [name: string]: string | any } = {
	"": HomeView,
	"todo": "TodoMainView",
	"dash": "DashMainView",
	"postr": "PostrMainView",
	"sand": "SandboxView" // this is accessible by hand in case the developer has src/view/Sandbox/ (not checked in)
};

@register
class MainView extends BaseView {
	path0?: string;

	postDisplay() {
		d.display("NotificationView", this.el);
	}

	hubEvents = {
		"routeHub; CHANGE": (routeInfo: any) => {
			displayView.call(this, routeInfo);
		}
	}
}

// --------- Private Methods --------- //

function displayView(this: MainView, routeInfo: any) {
	var view = this;

	var path0 = routeInfo.pathAt(0);

	// if null or undefined, make it empty string.
	path0 = (!path0) ? "" : path0;

	// We change the subView only if the path0 is different
	if (view.path0 !== path0) {
		// Remove the eventual active
		for (let itemEl of d.all(view.el, ".main-nav a.active")){
			itemEl.classList.remove("active");
		}

		// activate the main-nav a link
		var activeEl = d.first(view.el, ".main-nav a[href='#" + path0 + "']");
		if (activeEl) {
			activeEl.classList.add("active");
		}

		// change the subview
		var subViewName = pathToView[path0];

		// display the view (empty first)
		var contentEl = d.first(view.el, ".main-content");
		d.empty(contentEl);
		d.display(subViewName, contentEl);

		// change the current path0
		view.path0 = path0;
	}

}

// --------- /Private Methods --------- //