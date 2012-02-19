var MiniUnit = require("mini-unit");
var testCases = [
	"./path-template-test"
].map(function (path) {
	return require(path);
});

MiniUnit.runSuit(testCases);
