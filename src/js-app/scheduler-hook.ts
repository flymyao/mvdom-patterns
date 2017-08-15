import { mvdom as d, View } from "../lib";
import { scheduler } from "./scheduler"


function schNs(view: View) {
	return "view_sch_ns_" + view.id;
}

d.hook("didCreate", function (view: View) {
	var ns = schNs(view);

	if (view.schedules) {
		for (let schedule of view.schedules) {
			// Note: This is just a best practice, better to work on a copy. 
			//       Technically not really needed, since scheduler.add
			//       makes it own copy, and this is a view instance copy as well. 
			schedule = Object.assign({}, schedule);
			schedule.ns = ns;
			schedule.ctx = view;
			scheduler.add(schedule);
		}

	}
});

d.hook("willRemove", (view: View) => {
	var ns = schNs(view);

	if (view.schedules) {
		scheduler.remove(ns);
	}
});