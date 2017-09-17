import { assign } from '../../base';
import { first, append } from 'mvdom';
import { render } from '../../ts/render';
import { BaseDialog } from './BaseDialog';

export class SimpleDialog extends BaseDialog {

	// --------- Controller --------- //
	// update the component this.el before it get added to the DOM
	init() {
		this.title = "Simple Dialog";
		this.content = render("SimpleDialog-content");
	}

	constructor() {
		super();

		// --------- Events Binding --------- //
		assign(this.events, {
			'click; .base-dialog > header': () => {
				console.log('SimpleDialog click header');
			}
		});
		// --------- /Events Binding --------- //

	}
	// --------- /Controller --------- //

	doClose() {
		console.log('Simple Dialog delaying close....');
		first(this.el, 'header > .title')!.innerText = '... closing ....';
		setTimeout(() => {
			super.doClose();
		}, 2000);
	}

}


