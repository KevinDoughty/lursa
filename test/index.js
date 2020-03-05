import * as lursa from "../source/index.js";
const bigInt = require("big-integer");
const assert = require("assert");

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

describe("LURSA", function() {
	describe("basics", function() {
		it("function", function() {
			assert(isFunction(function() {}));
			assert(!isFunction({}));
			assert(!isFunction("[object Function]"));
		});
		it("bitInt", function() {
			assert(isFunction(bigInt));
		}),
		it("API", function() {
			assert(isFunction(lursa.archive));
			assert(isFunction(lursa.unarchive));
		});
	});
});
