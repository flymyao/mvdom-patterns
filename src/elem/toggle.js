var d = mvdom;

document.addEventListener("DOMContentLoaded", function(event) {

	d.on(document, "click", ".elem-toggle", function(evt){
		var toggleEl = evt.selectTarget;
		toggleEl.classList.toggle("on");
	});

});

// {{elem-toggle true}}
// {{elem-toggle}}
// {{elem-toggle false "disabled"}} or false
Handlebars.registerHelper("elem-toggle", function (on, disabled) {
	var strs = [];

	strs.push("<div class='elem-toggle ");

	if (on == true){
		strs.push("on");
	}

	if(arguments.length > 2 && disabled === "disabled"){
		strs.push(" disabled ");
	}

	strs.push("'>");

	strs.push("</div>");

	return strs.join("");
});
