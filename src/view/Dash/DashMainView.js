var d = window.mvdom; // external/global lib
var d3 = window.d3;

var render = require("js-app/render.js").render;
var ajax = require("js-app/ajax.js");
var scheduler = require("js-app/scheduler.js");
var utils = require("js-app/utils.js");
var UsageChart = require("./UsageChart.js");

// --------- View Controller --------- //
d.register("DashMainView",{
	create: function(data, config){
		return render("DashMainView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 

		var cpuPieCtnEl = d.first(view.el, ".cpu-card .metric .svg-ctn");
		view._cpuPie = new UsagePie(["sys", "user", "idle"],["#F44336", "#2196F3" , "#d9d9d9"])
										.init(cpuPieCtnEl)
										.update({user: 50, sys: 50, idle: 50});

		var cpuChartCtnEl = d.first(view.el, ".cpu-card .cpu-chart-ctn");		
		view._cpuChart = new UsageChart().init(cpuChartCtnEl, {xMax: 10, delay: 1900});

		var memPieCtnEl = d.first(view.el, ".mem-card .svg-ctn");
		view._memPie = new UsagePie(["used", "unused"],["#2196F3", "#4CAF50"])
										.init(memPieCtnEl)
										.update({used: 50, unused: 50});


	
	},

	destroy: function(){
		var view = this;
		
		// For the manual scheduler, we must remove the schedule manually.
		scheduler.remove(view.scheduleNs);
	},

	// RECOMMENDED: Here we add the other schedule the view.schedules way which is managed by the scheduler-hook.js. 
	//              Those schedules will be added when the view get created and removed when the view is removed.
	schedules: [
		// memUsage 
		{
			performFn: function(){
				return ajax.get("/api/memUsage");
			},

			receiveFn: function(data){
				var view = this; // the performFn and receiveFn are added to the scheduler.js with this view instance as ctx (context)
				if (data.length === 0){
					return; // do nothing, next cycle we might have the data
				}
				var lastMeasure = data[data.length - 1];
				view._memPie.update(lastMeasure);
				d.push(d.first(view.el, ".mem-card.summary"), {used: formatMb(lastMeasure.used),
					unused: formatMb(lastMeasure.unused)});					
			}
		}, 

		// topMem
		{
			performFn: function(){
				return ajax.get("/api/topMemProcs");
			},

			receiveFn: function(data){
				var view = this; // the performFn and receiveFn are added to the scheduler.js with this view instance as ctx (context)
				var items = data;
				var tbodyEl = d.first(view.el, ".mem-card .ui-tbody");

				// do nothing if empty data (still building it up on the server)
				if (items && items.length === 0){
					return;
				}

				// mark the items changed if they did
				markChanges(view.prevTopMemProcsDic, items, "pid", "mem");

				// build the topMemrocs dictionary with the latest data and store it in this view for next update
				view.prevTopMemProcsDic = utils.dic(items, "pid");

				// sort by name
				sortBy(items, "mem", "name");

				tbodyEl.innerHTML = "";
				d.append(tbodyEl,render("DashMainView-mem-trs", {items: data}));
			}
		}, 

		// cpuUsage 
		{
			performFn: function(){
				return ajax.get("/api/cpuUsage");
			}, 
			receiveFn: function(data){
				var view = this;
				if (data.length === 0){
					return; // do nothing, next cycle we might have the data
				}

				// Update the chart
				view._cpuChart.update(data);

				// update the pie
				var lastMeasure = data[data.length - 1];
				view._cpuPie.update(lastMeasure);
				d.push(d.first(view.el, ".cpu-card.summary"), lastMeasure);


			}
		},

		// topCpu
		{
			performFn: function(){
				return ajax.get("/api/topCpuProcs");
			},

			receiveFn: function(data){
				var view = this; 
				var items = data;
				var tbodyEl = d.first(view.el, ".cpu-card .ui-tbody");

				// do nothing if empty data (still building it up on the server)
				if (items && items.length === 0){
					return;
				}

				// mark the items changed if they did
				markChanges(view.prevTopCpuProcsDic, items, "pid", "cpu");

				// build the topCpuProcs dictionary with the latest data and store it in this view for next update
				view.prevTopCpuProcsDic = utils.dic(items, "pid");

				// sort by name
				sortBy(items, "cpu", "name");				

				// render and update the HTML table
				tbodyEl.innerHTML = ""; // delete
				d.append(tbodyEl,render("DashMainView-cpu-trs", {items: items}));
				

			}
		}		

	]

});
// --------- /View Controller --------- //



// --------- Statics --------- //

// format a megabyte number as optimially as possible
function formatMb(num){
	var val = "" + num.toFixed(2);
	var unit = "M";
	if (num > 900){
		val = (num / 1000).toFixed(2);
		unit = "Gb";
	}
	val = val.replace(".00","");
	val = val + unit;
	return val;	
}

// Mark the items if their value changed compared to the previous store
function markChanges(prevDic, items, keyName, valName){

	// if no prevDic, nothing to do. 
	if (prevDic){
		items.forEach(function(item){
			var keyVal = item[keyName];
			var prevItem = prevDic[keyVal];

			// if there is no prevItem, then, it is a new item.
			if (!prevItem){
				item.changed = "changed-new";
			}
			// if we have a previous item, we compare the value to mark if it went up or down
			else{
				var val = item[valName];
				var prevVal = prevItem[valName];				
				if (val != prevVal){
					item.changed = (val > prevVal)?"changed-up":"changed-down";
				}
			}
		});
	}	

	return items;
}
// --------- /Statics --------- //



// --------- Utils --------- //
// cheap num extractor pattern
var numRgx = /[0-9\.]+/g;

function asNum(str){
	if (str){
		var numStrs = str.match(numRgx);
		if (numStrs && numStrs.length > 0){
			return parseFloat(numStrs[0]);	
		}
	}

	return null;
	
}

function sortBy(arr, keyNum, keyName){
	arr.sort(function(a, b){
		var anum = a[keyNum];
		var bnum = b[keyNum];
		// if they have the name num value, then, we compare the name
		if (anum === bnum){
			return (a[keyName].toLowerCase() > b[keyName].toLowerCase())?1:-1;
		}else{
			return (anum < bnum)?1:-1;
		}		
	});		
}
// --------- /Utils --------- //

// --------- UsagePie--------- //
function UsagePie(names, colors){
	var self = this;

	self._antiClockwise = {
		startAngle: Math.PI * 2,
		endAngle: Math.PI * 2
	};

	self._arcTweenIn = function(a){
		var i  = d3.interpolate(this._current, a);
		this._current = i(0);
		return function(t) {
			return self._arc(i(t));
		};
	};

	self._arcTweenOut = function(a) {
		var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
		this._current = i(0);
		return function (t) {
			return self._arc(i(t));
		};
	};

	self._makeDataset = function(data){
		var dataset = [];
		names.forEach(function(name){
			dataset.push({name: name, value: data[name]});
		});

		return dataset;
	};

	//self._color = d3.scaleOrdinal(d3.schemeCategory20b);	
	self._color = d3.scaleOrdinal().domain(names).range(colors);
}

UsagePie.prototype.init = function(el){
	var self = this;

	var donutWidth = 20;

	var width = el.clientHeight;
	var height = width;
	var radius = Math.min(width, height) / 2;

	self._g = d3.select(el)
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g')
		.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

	self._arc = d3.arc()
		.innerRadius(radius - donutWidth)
		.outerRadius(radius);

	self._pie = d3.pie().value(function(d) {
		return d.value; 
	}).sort(null);		

	return self;
};


UsagePie.prototype.update = function(data){
	var self = this;

	var dataset = self._makeDataset(data);

	// SELECT EXISTING: This is the paths that exist already.
	var paths = self._g.selectAll('path')
								.data(this._pie(dataset));

	// ENTER: create and initialize new elements when needed
	var newPaths = paths.enter().append('path')
		.attr('d', function(d){ 
			return self._arc(self._antiClockwise);
		})
		.attr('fill', function(d, i) {
			return self._color(d.data.name);
		}).each(function(d){
			// store the data in this path element, which will be used in the tween interporlation
			this._current = {
				data: d.data,
				value: d.value,
				startAngle: self._antiClockwise.startAngle,
				endAngle: self._antiClockwise.endAngle
			};
		});


	// ENTER + UPDATE: for both exsting and new paths, we set the transition
	newPaths.merge(paths).transition().duration(750).attrTween("d", self._arcTweenIn);

	// EXIT: remove the data
	paths.exit()
			.transition()
			.duration(750)
			.attrTween('d', self._arcTweenOut)	
			.remove();

	return self;
};

// --------- /UsagePie--------- //
