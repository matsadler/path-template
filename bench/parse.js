var PathTemplate = require("./../lib/path-template");
var bench = require("./bench");

var repetitions = 100000;

bench("simple", repetitions, function () {
	PathTemplate.parse("/user/photos/default");
});

bench("variables", repetitions, function () {
	PathTemplate.parse("/users/:id/photos/:photo");
});

bench("splat", repetitions, function () {
	PathTemplate.parse("/users/*rest");
});

bench("optional", repetitions, function () {
	PathTemplate.parse("/user(/photo)(.:ext)");
});

bench("long", repetitions, function () {
	PathTemplate.parse("/users/:id/photos/:photo/info/:type/full/:page(.:ext)");
});
