import { BaseView, mvdom as d } from "../../base";

class BaseDialog extends BaseView {
	modal = false;

	create(data?: any) {
		var frag = super.create();
		return frag;
	}
}