import { RouteConfiguration, Request, ReplyNoContinue } from 'hapi';

// TODO: need to use the fake-top module soon and deprecreate the os-top (focus on demo, and not the hard problem of doing a top crossplatform)
import * as top from "os-top";
// import { fetch } from './fake-top';


const baseURI = "/api";


async function wait(ms: number) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}

// --------- Usage APIs --------- //
export const routes: RouteConfiguration[] = [];

routes.push({
	method: 'GET',
	path: baseURI + "/cpuUsage",
	handler: async function (request: Request, reply: ReplyNoContinue) {
		touchLastRequested();
		reply(cpuStats);
	}
});

routes.push({
	method: 'GET',
	path: baseURI + "/topCpuProcs",
	handler: function (request: Request, reply: ReplyNoContinue) {
		touchLastRequested();
		reply(procs);
	}
});

routes.push({
	method: 'GET',
	path: baseURI + "/memUsage",
	handler: function (request: Request, reply: ReplyNoContinue) {
		touchLastRequested();
		reply(memStats);
	}
});

routes.push({
	method: 'GET',
	path: baseURI + "/topMemProcs",
	handler: function (request: Request, reply: ReplyNoContinue) {
		touchLastRequested();
		reply(procs);
	}
});
// --------- /Usage APIs --------- //


// --------- Data Capture --------- //
var lastRequestedMs: number | null = null;
var maxIdle = 3000; // time to stop the fetch if nobody is requesting the data

var arrayLimit = 10;
var delay = 1000; // delay in beteween top.fetch

var cpuStats: any[] = [];
var memStats: any[] = [];
var procs: any[] = [];

var on = false;


// the lastRequestedMs scheme allow to run the expensive Top command every delay only if it is being requested.
function touchLastRequested() {
	lastRequestedMs = new Date().getTime();

	// if it was not running, we run it
	if (!on) {
		on = true;
		console.log("os-usage.js - starting top.fetch every " + (delay / 1000) + "s");
		topFetch();
	}

}

function topFetch() {
	var nowMs = new Date().getTime();

	// if the lastRequested was > than maxIdel, then, we pause the loop
	if (lastRequestedMs == null || (nowMs - lastRequestedMs) > maxIdle) {
		on = false;
		console.log("os-usage.js - stopping topFetch");
		return;
	}

	top.fetch().then(function (data: any) {
		_addData(cpuStats, data.stats.cpu);
		_addData(memStats, data.stats.mem);
		procs = data.procs;
		// TODO: need to have the topCpuProcs and the topMemProcs

		setTimeout(topFetch, delay);
	}).catch(function (ex: any) {
		console.log("FAIL - top.fetch - " + ex);
	});
}


// private function that add an new data item to its list, add time, max the list at usageLimit 
function _addData(list: any, data: any) {
	const nowMs = new Date().getTime();

	data.time = nowMs;
	list.push(data);

	if (list.length > arrayLimit) {
		list.splice(0, 1);
	}
}

// --------- /Data Capture --------- //