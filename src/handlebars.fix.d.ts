// Somehow the Handlebars type does not export this module, but is required in imports (see base.ts)
// so, this is a work around, declaring it for this application.
// See issue: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/19441
declare module "handlebars/runtime" {
	export = Handlebars;
}