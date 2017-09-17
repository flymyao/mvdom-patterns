import { BaseView, assign } from '../../base';
import { display, first } from 'mvdom';
import { BaseDialog } from './BaseDialog';
import { SimpleDialog } from './SimpleDialog';

export class DialogDemoView extends BaseView {


	constructor() {
		super();

		assign(this.events, {
			"click; .show.basic": () => {
				display(new BaseDialog(), first('body')!);
			},

			"click; .show.simple": () => {
				display(new SimpleDialog(), first('body')!);
			}
		});

	}

}