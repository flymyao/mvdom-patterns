const router = require("cmdrouter");
const browserify = require("browserify");
const path = require("path");
const fs = require("fs-extra-plus");
const exorcist = require("exorcist");
const postcss = require("postcss");
const hbsPrecompile = require("hbsp").precompile; // promise style
const tsify = require("tsify");

const processors = [
	require("postcss-import"),
	require("postcss-mixins"),
	require("postcss-simple-vars"),
	require("postcss-nested"),
	require("postcss-cssnext")({ browsers: ["last 2 versions"] })
];

// Define the constant for this project (needs to be before the router...route())
const rootDir = "./"; // here we assume we script will be run from the package.json dir
const srcDir = path.join(rootDir, "src/");
const webDir = path.join(rootDir, "web/");

const jsDistDir = path.join(webDir, "js/");
const cssDistDir = path.join(webDir, "css/");

// function that returns the full name from the srcDir
const sourceName = name => path.join(srcDir, name);

// src dirs
const jsSrcDirs = ["js-app/", "view/", "elem/"].map(sourceName);
const pcssSrcDirs = ["pcss/", "view/", "elem/"].map(sourceName);
const tmplSrcDirs = ["view/"].map(sourceName);

//// test dirs
// Note: The test js dirs are the concatination of the js files and test js files. This is because test js files will import app js file, and 
//       having two different distribution files would create issues where some of those files will be loaded twice, and will have different context. 
const testJsSrcDirs = jsSrcDirs.concat(["test/js", "test/view"].map(sourceName));

// Note: css and templates can be complete different files as the the only imports on the css side will be for utilities and therefore won't affect the global context.
const testPcssSrcDirs = ["test/view/"].map(sourceName);
const testTmplSrcDirs = ["test/view/"].map(sourceName);

// we route the command to the appropriate function
router({ _default, js, lib, css, testCss, tmpl, testTmpl, watch }).route();


// --------- Command Functions --------- //
async function _default() {
	await js();
	await lib();
	await css();
	await tmpl();
	//await testCss();
	//await testTmpl();
}

/** Build the 3rd party libs */
async function lib(){
	var start = now();
	ensureDist();

	var dist = path.join(webDir, "js/lib-bundle.js");

	var entries = ["src/js-lib/index.ts"];

	await browserifyFiles(entries,
		dist);

	printLog("JS Lib Compilation", dist, start);	
}


/** Build the javascript application bundle */
async function js() {
	var start = now();
	ensureDist();

	var dist = path.join(webDir, "js/app-bundle.js");

	var entries = await fs.listFiles(jsSrcDirs, ".ts");

	await browserifyFiles(entries,
		dist);

	printLog("JS Compilation", dist, start);
}

async function css() {
	var start = now();
	ensureDist();

	var dist = path.join(cssDistDir, "all-bundle.css");
	await pcssFiles(await fs.listFiles(pcssSrcDirs, ".pcss"),dist);
		
	printLog("CSS Compilation", dist, start);
}

async function testCss() {
	var start = now();
	var dist = path.join(webDir, "test/test-bundle.css");
	await pcssFiles(await fs.listFiles(testPcssSrcDirs, ".pcss"), dist);
	printLog("CSS Test Compilation", dist, start);
}

async function tmpl() {
	var start = now();
	ensureDist();

	var dist = path.join(webDir, "js/templates.js");
	await tmplFiles(await fs.listFiles(tmplSrcDirs, ".tmpl"),dist);

	printLog("TMPL Compilation", dist, start);	
}

async function testTmpl() {
	var start = now();

	var dist = path.join(webDir, "test/test-templates.js");
	await tmplFiles(await fs.listFiles(testTmplSrcDirs, ".tmpl"), dist);
	
	printLog("TMPL Test Compilation", dist, start);		
}


async function watch() {
	// first we build all
	await _default();

	// NOTE: here we do not need to do await (even if we could) as it is fine to not do them sequentially. 

	fs.watchDirs(["src/"], ".ts", js);

	fs.watchDirs(pcssSrcDirs, ".pcss", () => css());

	//fs.watchDirs(testPcssSrcDirs, ".pcss", () => testCss());

	fs.watchDirs(tmplSrcDirs, ".tmpl", () => tmpl());

	//fs.watchDirs(testTmplSrcDirs, ".tmpl", () => testTmpl());
}
// --------- /Command Functions --------- //


// --------- Utils --------- //

// make sure the dist folder exists
function ensureDist() {
	fs.ensureDirSync(jsDistDir);
	fs.ensureDirSync(cssDistDir);
}


async function tmplFiles(files, distFile) {

	await fs.unlinkFiles([distFile]);

	var templateContent = [];

	for (let file of files) {

		let htmlTemplate = await fs.readFile(file, "utf8");
		let template = await hbsPrecompile(file, htmlTemplate);
		templateContent.push(template);
	}

	await fs.writeFile(distFile, templateContent.join("\n"), "utf8");
}

async function pcssFiles(entries, distFile) {

	try {
		var mapFile = distFile + ".map";
		await fs.unlinkFiles([distFile, mapFile]);

		var processor = postcss(processors);
		var pcssNodes = [];

		// we parse all of the .pcss files
		for (let srcFile of entries) {
			// read the file
			let pcss = await fs.readFile(srcFile, "utf8");

			var pcssNode = postcss.parse(pcss, {
				from: srcFile
			});
			pcssNodes.push(pcssNode);
		}

		// build build the combined rootNode and its result
		var rootNode = null;
		for (let pcssNode of pcssNodes) {
			rootNode = (rootNode) ? rootNode.append(pcssNode) : pcssNode;
		}
		var rootNodeResult = rootNode.toResult();

		// we process the rootNodeResult
		var pcssResult = await processor.process(rootNodeResult, {
			to: distFile,
			map: { inline: false }
		});
	} catch (ex) {
		console.log(`postcss ERROR - Cannot process ${distFile} because (setting css empty file) \n${ex}`);
		// we write the .css and .map files
		await fs.writeFile(distFile, "", "utf8");
		await fs.writeFile(mapFile, "", "utf8");
		return;
	}

	// we write the .css and .map files
	await fs.writeFile(distFile, pcssResult.css, "utf8");
	await fs.writeFile(mapFile, pcssResult.map, "utf8");
}

async function browserifyFiles(entries, distFile) {

	var mapFile = distFile + ".map";
	// make sure to delete both files if they exist.
	await fs.unlinkFiles([distFile, mapFile]);

	var b = browserify({
		entries,
		entry: true,
		debug: true
	});

	// wrap the async browserify bundle into a promise to make it "async" friendlier
	return new Promise(function (resolve, reject) {

		// we create the writable and register some event handler to resolve or reject his Promise
		var writableFs = fs.createWriteStream(distFile);
		// resolve promise when file is written
		writableFs.on("finish", () => resolve());
		// reject if we have a write error
		writableFs.on("error", (ex) => reject(ex));

		// star the browserify bundling
		b.plugin(tsify, { strict: true })
			.bundle()
			// reject if we have a bundle error
			.on("error", function (err) { reject(err); })
			.pipe(exorcist(mapFile))
			.pipe(writableFs);
	});
}

// return now in milliseconds using high precision
function now(){
	var hrTime = process.hrtime();
	return hrTime[0] * 1000 + hrTime[1] / 1000000;
}

function printLog(txt, dist, start){
	console.log(txt + " - " + dist + " - " + Math.round(now() - start) + "ms");
}

// --------- /Utils --------- //
