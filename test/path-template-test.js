var assert = require("assert");
var MiniUnit = require("mini-unit");
var PathTemplate = require("./../lib/path-template");

var tc = new MiniUnit.TestCase("PathTemplate");

tc.testSimpleParse = function () {
	var template = PathTemplate.parse("/user/photos/default");
	
	assert.deepEqual(template, [
		["string", "/"],
		["string", "user"],
		["string", "/"],
		["string", "photos"],
		["string", "/"],
		["string", "default"]
	]);
};

tc.testParseWithVariables = function () {
	var template = PathTemplate.parse("/blog/:year/:month/posts/:id");
	
	assert.deepEqual(template, [
		["string", "/"],
		["string", "blog"],
		["string", "/"],
		["variable", "year"],
		["string", "/"],
		["variable", "month"],
		["string", "/"],
		["string", "posts"],
		["string", "/"],
		["variable", "id"]
	]);
};

tc.testParseWithSplat = function () {
	var template = PathTemplate.parse("/*parts");
	
	assert.deepEqual(template, [
		["string", "/"],
		["splat", "parts"]
	]);
};

tc.testParseWithUnamedSplat = function () {
	var template = PathTemplate.parse("/src/*/readme");
	
	assert.deepEqual(template, [
		["string", "/"],
		["string", "src"],
		["string", "/"],
		["splat", null],
		["string", "/"],
		["string", "readme"]
	]);
};

tc.testParse = function () {
	var template = PathTemplate.parse("/blog/*date/posts/:id");
	
	assert.deepEqual(template, [
		["string", "/"],
		["string", "blog"],
		["string", "/"],
		["splat", "date"],
		["string", "/"],
		["string", "posts"],
		["string", "/"],
		["variable", "id"]
	]);
};

tc.testParseWithExtensions = function () {
	var template = PathTemplate.parse("/Applications/*.app/*.:ext");
	
	assert.deepEqual(template, [
		["string", "/"],
		["string", "Applications"],
		["string", "/"],
		["splat", null],
		["string", "."],
		["string", "app"],
		["string", "/"],
		["splat", null],
		["string", "."],
		["variable", "ext"]
	]);
};

tc.testParseWithOptional = function () {
	var template = PathTemplate.parse("/foo(/bar)/baz");
	
	assert.deepEqual(template, [
		["string", "/"],
		["string", "foo"],
		["option", 2],
		["string", "/"],
		["string", "bar"],
		["string", "/"],
		["string", "baz"]
	]);
};

tc.testParseWithMultipleOptional = function () {
	var template = PathTemplate.parse("/files(/blog/:date)/:name(.:ext)");
	
	assert.deepEqual(template, [
		["string", "/"],
		["string", "files"],
		["option", 4],
		["string", "/"],
		["string", "blog"],
		["string", "/"],
		["variable", "date"],
		["string", "/"],
		["variable", "name"],
		["option", 2],
		["string", "."],
		["variable", "ext"],
	]);
};

tc.testSimpleInspect = function () {
	var template = PathTemplate.parse("/user/photos/default"),
		result = PathTemplate.inspect(template);
	
	assert.equal(result, "/user/photos/default");
};

tc.testInspectWithVariables = function () {
	var template = PathTemplate.parse("/blog/:year/:month/posts/:id"),
		result = PathTemplate.inspect(template);
	
	assert.equal(result, "/blog/:year/:month/posts/:id");
};

tc.testInspectWithSplat = function () {
	var template = PathTemplate.parse("/*parts"),
		result = PathTemplate.inspect(template);
	
	assert.equal(result, "/*parts");
};

tc.testInspectWithUnamedSplat = function () {
	var template = PathTemplate.parse("/src/*/readme"),
		result = PathTemplate.inspect(template);
	
	assert.equal(result, "/src/*/readme");
};

tc.testInspect = function () {
	var template = PathTemplate.parse("/blog/*date/posts/:id"),
		result = PathTemplate.inspect(template);
	
	assert.equal(result, "/blog/*date/posts/:id");
};

tc.testInspectWithExtensions = function () {
	var template = PathTemplate.parse("/Applications/*.app/*.:ext"),
		result = PathTemplate.inspect(template);
	
	assert.equal(result, "/Applications/*.app/*.:ext");
};

tc.testInspectWithOptional = function () {
	var template = PathTemplate.parse("/foo(/bar)/baz"),
		result = PathTemplate.inspect(template);
	
	assert.equal(result, "/foo(/bar)/baz")
};

tc.testInspectWithTrailingOptional = function () {
	var template = PathTemplate.parse("/foo(/bar)"),
		result = PathTemplate.inspect(template);
	
	assert.equal(result, "/foo(/bar)")
};

tc.testVariables = function () {
	var template = PathTemplate.parse("/blog/*date/posts/:id"),
		result = PathTemplate.variables(template);
	
	assert.deepEqual(result, ["date", "id"]);
};

tc.testVariablesWithUnamedSplat = function () {
	var template = PathTemplate.parse("/src/*/readme"),
		result = PathTemplate.variables(template);
	
	assert.deepEqual(result, []);
};

tc.testSimpleFormat = function () {
	var template = PathTemplate.parse("/user/photos/default"),
		result = PathTemplate.format(template, {});
	
	assert.equal(result, "/user/photos/default");
};

tc.testFormatVariable = function () {
	var template = PathTemplate.parse("/blog/:year/:month/posts/:id"),
		result = PathTemplate.format(template,
			{year: 2011, month: "dec", id: 13});
	
	assert.equal(result, "/blog/2011/dec/posts/13");
};

tc.testFormatWithSplat = function () {
	var template = PathTemplate.parse("/*parts"),
		result = PathTemplate.format(template, {parts: ["foo", 1, "bar", 2]});
	
	assert.equal(result, "/foo/1/bar/2");
};

tc.testFormatWithUnsatisfiedSplat = function () {
	var template = PathTemplate.parse("/blog/*date/posts"),
		result = PathTemplate.format(template, {});
	
	assert.equal(result, "/blog/posts");
};

tc.testFormat = function () {
	var template = PathTemplate.parse("/blog/*date/posts/:id"),
		result = PathTemplate.format(template, {date: [2012, "jan"], id: 1});
	
	assert.equal(result, "/blog/2012/jan/posts/1");
};

tc.testFormatWithExtensions = function () {
	var template = PathTemplate.parse("/*parts.:ext"),
		result = PathTemplate.format(template,
			{parts: ["foo", "bar"], ext: "txt"});
	
	assert.equal(result, "/foo/bar.txt");
};

tc.testFormatWithOptional = function () {
	var template = PathTemplate.parse("/foo(/bar)/baz"),
		result = PathTemplate.format(template, {});
	
	assert.equal(result, "/foo/bar/baz")
};

tc.testFormatWithUnsatisfiedOptional = function () {
	var template = PathTemplate.parse("/files(/blog/:date)/:name(.:ext)"),
		result = PathTemplate.format(template, {name: "photo"});
	
	assert.equal(result, "/files/photo")
};

tc.testSimpleMatch = function () {
	var template = PathTemplate.parse("/user/photos/default"),
		result = PathTemplate.match(template, "/user/photos/default");
	
	assert.deepEqual(result, {});
};

tc.testMatchWithVariables = function () {
	var template = PathTemplate.parse("/blog/:year/:month/posts/:id"),
		result = PathTemplate.match(template, "/blog/2012/jan/posts/1");
	
	assert.deepEqual(result, {year: "2012", month: "jan", id: "1"});
};

tc.testMatchWithSplat = function () {
	var template = PathTemplate.parse("/*parts"),
		result = PathTemplate.match(template, "/foo/1/bar/2");
	
	assert.deepEqual(result, {parts: ["foo", "1", "bar", "2"]});
};

tc.testMatch = function () {
	var template = PathTemplate.parse("/blog/*date/posts/:id"),
		result = PathTemplate.match(template, "/blog/2012/jan/posts/1");
	
	assert.deepEqual(result, {date: ["2012", "jan"], id: "1"});
};

tc.testMatchWithExtensions = function () {
	var template = PathTemplate.parse("/*parts.:ext"),
		result = PathTemplate.match(template, "/foo/bar.txt");
	
	assert.deepEqual(result, {parts: ["foo", "bar"], ext: "txt"});
};

tc.testMatchZeroWidthSplat = function () {
	var template = PathTemplate.parse("/foo/*bar/baz"),
		result = PathTemplate.match(template, "/foo/baz");
	assert.deepEqual(result, {bar: []});
};

tc.testMatchWithTrailingSplat = function () {
	var template = PathTemplate.parse("/foo/*bar"),
		result = PathTemplate.match(template, "/foo/");
	
	assert.deepEqual(result, {bar: []});
};

tc.testMatchWithOptional = function () {
	var template = PathTemplate.parse("/foo(/bar)/baz"),
		result1 = PathTemplate.match(template, "/foo/baz"),
		result2 = PathTemplate.match(template, "/foo/bar/baz");
	
	assert.deepEqual(result1, {});
	assert.deepEqual(result2, {});
};

tc.testMatchWithTrailingOptional = function () {
	var template = PathTemplate.parse("/foo(/bar)"),
		result1 = PathTemplate.match(template, "/foo"),
		result2 = PathTemplate.match(template, "/foo/bar");
	
	assert.deepEqual(result1, {});
	assert.deepEqual(result2, {});
};

tc.testMatchWithOptionalExtension = function () {
	var template = PathTemplate.parse("/:file(.:ext)"),
		result1 = PathTemplate.match(template, "/robot"),
		result2 = PathTemplate.match(template, "/robot.jpg");
	
	assert.deepEqual(result1, {"file": "robot"});
	assert.deepEqual(result2, {"file": "robot", "ext": "jpg"});
};

// TODO test match failure

// TODO test match on multiple templates

tc.testAddString = function () {
	var template = PathTemplate.parse("/foo"),
		result = PathTemplate.add(template, "bar");
	
	assert.deepEqual(result, [
		["string", "/"],
		["string", "foo"],
		["string", "/"],
		["string", "bar"]
	]);
};

tc.testAddSlashString = function () {
	var template = PathTemplate.parse("/foo"),
		result = PathTemplate.add(template, "/bar");
	
	assert.deepEqual(result, [
		["string", "/"],
		["string", "foo"],
		["string", "/"],
		["string", "bar"]
	]);
};

tc.testAddStringToTrailingSlash = function () {
	var template = PathTemplate.parse("/foo/"),
		result = PathTemplate.add(template, "bar");
	
	assert.deepEqual(result, [
		["string", "/"],
		["string", "foo"],
		["string", "/"],
		["string", "bar"]
	]);
};

tc.testAddVariable = function () {
	var template = PathTemplate.parse("/foo"),
		result = PathTemplate.add(template, ":bar");
	
	assert.deepEqual(result, [
		["string", "/"],
		["string", "foo"],
		["string", "/"],
		["variable", "bar"]
	]);
};

tc.testAddSplat = function () {
	var template = PathTemplate.parse("/foo"),
		result = PathTemplate.add(template, "*bar");
	
	assert.deepEqual(result, [
		["string", "/"],
		["string", "foo"],
		["string", "/"],
		["splat", "bar"]
	]);
};

tc.testAddExtension = function () {
	var template = PathTemplate.parse("/foo"),
		result = PathTemplate.add(template, ".bar");
	
	assert.deepEqual(result, [
		["string", "/"],
		["string", "foo"],
		["string", "."],
		["string", "bar"]
	]);
};

tc.testAddExtensionVariable = function () {
	var template = PathTemplate.parse("/foo"),
		result = PathTemplate.add(template, ".:bar");
	
	assert.deepEqual(result, [
		["string", "/"],
		["string", "foo"],
		["string", "."],
		["variable", "bar"]
	]);
};

tc.testAddDoesntModifyInput = function () {
	var a = PathTemplate.parse("/foo"),
		b = PathTemplate.add(a, "bar"),
		c = PathTemplate.add(b, "/baz/"),
		d = PathTemplate.add(c, "/qux");
	
	assert.deepEqual(a, [
		["string", "/"],
		["string", "foo"]
	]);
	
	assert.deepEqual(b, [
		["string", "/"],
		["string", "foo"],
		["string", "/"],
		["string", "bar"]
	]);
	
	assert.deepEqual(c, [
		["string", "/"],
		["string", "foo"],
		["string", "/"],
		["string", "bar"],
		["string", "/"],
		["string", "baz"],
		["string", "/"]
	]);
	
	assert.deepEqual(d, [
		["string", "/"],
		["string", "foo"],
		["string", "/"],
		["string", "bar"],
		["string", "/"],
		["string", "baz"],
		["string", "/"],
		["string", "qux"]
	]);
};

tc.testWithout = function () {
	var template = PathTemplate.parse("/users/:id"),
		result = PathTemplate.without(template, "users");
	
	assert.deepEqual(result, [
		["string", "/"],
		["variable", "id"]
	]);
};

tc.testWithoutLeadingSlash = function () {
	var template = PathTemplate.parse("/users/:id"),
		result = PathTemplate.without(template, "/users");
	
	assert.deepEqual(result, [
		["string", "/"],
		["variable", "id"]
	]);
};

tc.testWithoutVariable = function () {
	var template = PathTemplate.parse("/users/:id"),
		result = PathTemplate.without(template, "/:id");
	
	assert.deepEqual(result, [
		["string", "/"],
		["string", "users"]
	]);
};

tc.testWithoutMultiple = function () {
	var template = PathTemplate.parse("/foo/foo/bar/bar/baz"),
		result = PathTemplate.without(template, "/foo/bar");
	
	assert.deepEqual(result, [
		["string", "/"],
		["string", "foo"],
		["string", "/"],
		["string", "bar"],
		["string", "/"],
		["string", "baz"]
	]);
};

if (require.main === module) {
	MiniUnit.run(tc);
} else {
	module.exports = tc;
}
