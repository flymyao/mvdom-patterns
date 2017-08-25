// This module export the basic export needes for Views (mvdom, BaseView), could export more as needed. 
// Note: This will "re-export" the module "mvdom" from "./lib", so that we keep lib.js the central packaging point for 3rd party libs.

import { View, mvdom } from "./lib"

export { mvdom };

export class BaseView implements View {
	/** Unique id of the view. Used in namespace binding and such.  */
	id: string;

	/** The view name or "class name". */
	name: string;

	/** The htmlElement created */
	el?: HTMLElement;
}

export function register<T extends BaseView>(target: {new(): T;} ){
	mvdom.register(target);
}

