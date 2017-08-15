import {mvdom} from "../lib";


document.addEventListener("DOMContentLoaded", function(event) {
	
	mvdom.on(document, "click", ".switch", function(evt){
		var switchEl = evt.selectTarget;
		toggle(switchEl);
	});

	mvdom.on(document, "keyup", ".switch", function(evt){
		if (evt.code === "Space"){
			toggle(evt.selectTarget);
		}
	});

});


function toggle(switchEl: HTMLElement){
	switchEl.classList.toggle("on");
}

