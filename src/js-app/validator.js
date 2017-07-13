var d = window.mvdom;

// IMPORTANT: Just the scaffolding for now. Not Implemented. 

var _validators = {};

var _failers = [];
var _successes = [];

module.exports = {
	validate: validate,
	add: add,
	fail: fail,
	success: success
};



// --------- Public Methods --------- //
function validate(el, selector, opts){

	var inputs = d.all(el, selector);
	var validationErrors = [];
	var validationSuccesses = [];	

	if (inputs){
		inputs.forEach(function(input){
			var value = input.value;
			var name = input.getAttribute("name");
			var rules = extraRules(input);

			var ruleErrors = [];

			rules.forEach(function(rule){
				var validationFn = _validators[rule.name];

				try{				
					if (!validationFn){
						throw "no validation rule for " + rule.name;
					}

					validationFn(name, value, rule);
				}catch(error){
					ruleErrors.push({
						error: error,
						ruleOptions: rule
					});
				}
			}); // forEach rule

			// if we have rule errors, we  
			if (ruleErrors.length > 0){
				validationErrors.push({
					el: input,
					name: name,
					value: value,
					ruleErrors: ruleErrors,
				});
			}else{
				validationSuccesses.push({
					el: input,
					name: name,
					value: value
				});
			}
		}); // forEach input


		if (validationErrors.length > 0){
			// if we have a opts.fail, add it to the list of failers (.concat will make a new array, so, safe)
			var failers = (opts && opts.fail)?_failers.concat([opts.fail]):_failers;		

			failers.forEach(function(failer){
				failer(validationErrors);
			});		
		}

		if (validationSuccesses.length > 0){
			// if we have a opts.successe, add it to the list of successes (.concat will make a new array, so, safe)
			var successes = (opts && opts.success)?_failers.concat([opts.success]):_successes;
			successes.forEach(function(success){
				success(validationSuccesses);
			});				
		}
	} // if inputs	

	return {
		validationErrors: validationErrors,
		validationSuccesses: validationSuccesses
	};
}


function add(name, validationFn){
	_validators[name] = validationFn;
}


function fail(catcher){
	_failers.push(catcher);
}

function success(success){
	_successes.push(success);
}
// --------- /Public Methods --------- //


// --------- Utils --------- //
// extract and parse the rules for this dom element (in data-valid attribute)
var regxNameArgs = /(\w*)\s*\((.*)\)/;

function extraRules(el){
	var rules = [];
	// e.g., "required ; email;min( 4);max(20)"
	var rulesString = el.getAttribute("data-valid");
	if (rulesString){
		// first we extract each raw rules in an array 
		// e.g. ["required "," email","min( 4)","max(20)"]
		var rawRules = rulesString.split(";");

		// second, for each rules, 
		rules = rawRules.map(function(rawRule){
			var rule = {};
			// if we have a named function and args
			if (rawRule.indexOf("(") !== -1){
				var nameAndArgs = regxNameArgs.exec(rawRule);
				rule.name = nameAndArgs[1].trim();
				rule.args = nameAndArgs[2].split(",").map(function(arg){
					return arg.trim();
				});
			}
			// if itis a simple rule
			else{
				rule.name = rawRule.trim();
			}
			// e.g., "min( 4)"
			return rule;
		});
	}
	return rules;
}
// --------- /Utils --------- //