var d = mvdom;

document.addEventListener("DOMContentLoaded", function(event) {

	d.on(document, "click", ".elem-toggle", function(evt){
		var toggleEl = d.closest(evt.target, ".elem-toggle");
		toggleEl.classList.toggle("on");
	});

});


Handlebars.registerHelper("elem-toggle", function (on) {
	var strs = [];
	strs.push("<div class='elem-toggle ");

	if (on){
		strs.push("on");
	}

	strs.push("'>");

	strs.push("<div class='circle'></div></div>");

	return strs.join("");
});
