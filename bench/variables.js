var PathTemplate = require("./../lib/path-template");
var bench = require("./bench");

var repetitions = 1000000;
var none = PathTemplate.parse("/user/photos/default");
var regular = PathTemplate.parse("/users/:id/photos/:photo");
var long = PathTemplate.parse("/users/:id/photos/:photo/info/*types(.:ext)");

bench("none", repetitions, function () {
	PathTemplate.variables(none);
});

bench("regular", repetitions, function () {
	PathTemplate.variables(regular);
});

bench("long", repetitions, function () {
	PathTemplate.variables(long);
});
