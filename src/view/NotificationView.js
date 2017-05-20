var d = mvdom; // external/global lib
var render = require("../js-app/render.js").render;


d.register("NotificationView",{
	create: function(data, config){
		return render("NotificationView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 



		//// Debuging
		// var types = ["info", "warning", "error"];
		// var count = 0;
		// setInterval(function(){
		// 	var type = types[count % 3];
		// 	addItem.call(view, {type: type, content: "some content"});
		// 	count++;
		// }, 2000);
	}, 

	hubEvents: {
		"notifHub; notify": function(message, evtInfo){
			var view = this;
			addItem.call(view,{type: evtInfo.label, content: message});
		}
	}
});


function addItem(message){
	var view = this;

	var frag = render("NotificationView-item", message, true);
	var itemEl = frag.firstElementChild;
	view.el.append(frag);
	itemEl.style.height = itemEl.scrollHeight + "px";

	// todo: need to add similar "animationend" and "transitionend" for cross browser
	d.on(itemEl, "webkitAnimationEnd", function(evt){
		d.on(itemEl,addEventListener("webkitTransitionEnd", function(){
			d.remove(itemEl);
		}));
		itemEl.classList.add("hide");
		itemEl.style.height = "0px";		
	});
}
