
// Somehow the Handlebars type does not export this module, but is required in imports (see base.ts)
declare module "handlebars/runtime" {
	export = Handlebars;
}