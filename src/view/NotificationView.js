var d = mvdom; // external/global lib
var render = require("../js-app/render.js").render;


d.register("NotificationView",{
	create: function(data, config){
		return render("NotificationView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 
	}, 

	hubEvents: {

		// On topic notify on notifHub, we show the message. 
		"notifHub; notify": function(message, evtInfo){
			var view = this;
			// For now, the scheme is to have the message being the content and the notification label be the event type
			addItem.call(view,{type: evtInfo.label, content: message});
		}
	}
});


function addItem(message){
	var view = this;

	// create the new element 
	var frag = render("NotificationView-item", message, true);
	// Make sure to get the firstEl before fragment is appended (appending a fragment empty its children)
	var notifCtnEl = frag.firstElementChild;
	view.el.append(frag);


	// Here we need to set explicitly the height so that it can be animated later
	// Note: this allows us to be dynamic about the height of the notification items and not harcode them in css
	notifCtnEl.style.height = notifCtnEl.offsetHeight + "px";


	// when the animation end, start the remove process
	d.on(notifCtnEl, "animationend", function(evt){
		
		// once we finish shrinking the div, we can remove it from the DOM
		d.on(notifCtnEl,"transitionend", function(evt){
			d.remove(notifCtnEl);
		});

		// we set the height to 0px so that it can shrink and moving the eventual other items below
		notifCtnEl.style.height = "0px";		
	});
}
