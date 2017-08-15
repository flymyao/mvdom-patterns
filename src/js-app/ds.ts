import { ajax } from "./ajax";

// The 'ds' module is the DataService module which is the layer to access data. The pattern here is that, 
// the first param is the object type, which allows to have a single access points to data and start with dynamic/generic
// CRUD behavior and customize as needed behind the scene.

// filter: {offset:0, limit: 300, cond, orderBy, }
// cond: {"title": "exactmatch", "firstName;ilike":"%jen%", "age;>": 30}
// orderBy: "lastName" or "!age" (age descending) or ["!age", "lastName"]
// ds("Task").create()
// ds.register("_fallback_",{create, update, remove, ...})
// ds.register("Task",)

// dso by name
var dsoDic: { [name: string]: any } = {};

type DsoFallbackFn = (type: string) => any;

// optional dso fallback factory
var _dsoFallbackFn: DsoFallbackFn;

export module ds {
	export function register(type: string, dso: any) {
		dsoDic[type] = dso;
	}

	export function fallback(dsoFallbackFn: DsoFallbackFn) {
		_dsoFallbackFn = dsoFallbackFn;
	}
}

export function dso(type: string): any {
	var dso = dsoDic[type];

	// if no dso found, but we have a dsoFallback factory, then, we create it.
	if (!dso && _dsoFallbackFn) {
		dsoDic[type] = dso = _dsoFallbackFn(type);
	}

	// throw exception if still no dso
	if (!dso) {
		throw new Error("No dso for type " + type);
	}

	return dso;
}

