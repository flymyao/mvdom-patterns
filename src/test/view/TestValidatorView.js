var d = window.mvdom;
var validator = require("js-app/validator");


d.register("TestValidatorView",{
	
	postDisplay: function(){
		var view = this;


	}, 

	events: {
		"click; .do-save": function(){
			var view = this;
			validator.validate(view.el, ".form.form-1 .validate");
		}
	}
});


