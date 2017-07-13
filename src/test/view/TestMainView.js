var d = window.mvdom;

d.register("TestMainView",{

	hubEvents: {
		"routeHub; CHANGE": function(routeInfo){		
			displayView.call(this, routeInfo);
		}
	}
});


// --------- Private Methods --------- //

function displayView(routeInfo){
	var view = this;

	var path0 = routeInfo.pathAt(0);

	// if null or undefined, make it empty string.
	path0 = (!path0)?"":path0;


	// We change the subView only if the path0 is different
	if (view.path0 !== path0){
		// Remove the eventual active
		d.all(view.el,"nav.main a.active").forEach(function(itemEl){
			itemEl.classList.remove("active");
		});

		// activate the nav a link
		var activeEl = d.first(view.el,"nav.main a[href='#" + path0 + "']");
		if (activeEl){
			activeEl.classList.add("active");
		}		

		// change the subview
		var subViewName = path0;
	
		if (subViewName){
			// display the view (empty first)
			var contentEl = d.first(view.el, "section.main");
			d.display(subViewName, contentEl, null, "empty");

			// change the current path0
			view.path0 = path0;			
		}else{
			d.empty(d.first(view.el, "section.main"));
		}


	}
	
}

// --------- /Private Methods --------- //