import { BaseView, mvdom as d } from "../base";
import { HomeView } from "./HomeView";
import { TodoMainView } from "./Todo/TodoMainView";
import { DashMainView } from "./Dash/DashMainView";
import { PostrMainView } from "./Postr/PostrMainView";
import { NotificationView } from "./NotificationView";

type BaseViewClass = { new(): BaseView; }

var pathToView: { [name: string]: BaseViewClass } = {
	"": HomeView,
	"todo": TodoMainView,
	"dash": DashMainView,
	"postr": PostrMainView
};


export class MainView extends BaseView {
	path0?: string;

	postDisplay() {
		d.display(NotificationView, this.el);
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
		for (let itemEl of d.all(view.el, ".main-nav a.active")) {
			itemEl.classList.remove("active");
		}

		// activate the main-nav a link
		var activeEl = d.first(view.el, ".main-nav a[href='#" + path0 + "']");
		if (activeEl) {
			activeEl.classList.add("active");
		}

		// change the subview
		var subViewClass = pathToView[path0];

		// display the view (empty first)
		var contentEl = d.first(view.el, ".main-content");
		d.empty(contentEl);
		d.display(subViewClass, contentEl);

		// change the current path0
		view.path0 = path0;
	}

}
// --------- /Private Methods --------- //