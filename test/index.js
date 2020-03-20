"use strict";

import lursa from "../source/index.js";
const bigInt = require("big-integer");
const assert = require("assert");
const beforeEach = require("mocha").beforeEach;

describe("LURSA", function() {

	describe("basics", function() {
		let isFunction;
		beforeEach( function() {
			isFunction = function isFunction(w) {
				return w && {}.toString.call(w) === "[object Function]";
			};
		});
		it("function", function() {
			assert(isFunction(function() {}));
			assert(!isFunction({}));
			assert(!isFunction("[object Function]"));
		});
		it("bigInt", function() {
			assert(isFunction(bigInt));
		}),
		it("API", function() {
			assert(isFunction(lursa));
			const { archive, unarchive } = lursa([]);
			assert(isFunction(archive));
			assert(isFunction(unarchive));
		});
	});

	describe("easy", function() {
		let schema, expected;
		beforeEach( function() {
			schema = [
				{ id: "a", type: "int", size: 3 },
				{ id: "b", type: "int", min:1, size: 3 }
			];
			expected = {
				a:0,
				b:1
			};
		});
		it("default", function() {
			const { archive, unarchive } = lursa(schema);
			const archived = archive({});
			const unarchived = unarchive(archived);
			assert.deepEqual(expected, unarchived);
		});
		it("manual", function() {
			const { archive, unarchive } = lursa(schema);
			const archived = archive(expected);
			const unarchived = unarchive(archived);
			assert.deepEqual(expected, unarchived);
		});
	});

	describe("hard", function() {
		let schema, expected;
		beforeEach( function() {
			schema = [
				{ id: "a", type: "int", size: 3 },
				{ id: "b", type: "int", min:1, size: 3 },
				{ id: "c", type: "int", max:10, size: 3 },
				{ id: "d", type: "int", min:1, max:5, size: 3 },
				{ id: "e", type: "int", default:6, min:1, max:5, size: 3 },
				{ id: "f", type: "int", default:6, min:1, max:5, size: 3, wrap:true},
				{ id: "g", type: "int", default: 5, size: 3 },
				{ id: "h", type: "int", default:10, min:6, size:3 },
				{ id: "i", type: "int", default:60, max:63, size:7 },
				{ id: "j", type: "int", default: 359, min:0, max:360, size:9 },
				{ id: "k", type: "float", size:3},
				{ id: "l", type: "float", min:1, size:3},
				{ id: "m", type: "float", max:10, size:3},
				{ id: "n", type: "float", default:5, size:3},
				{ id: "o", type: "float", default:5.5, min:2.5, size:3},
				{ id: "p", type: "float", default:0.5, min:0, max:1, fixed:2, size:7},
				{ id: "q", type: "float", default: 1.5, min:1, max:2.5, fixed:2, size:8 },
				{ id: "r", type: "float", min:1, max:5, size: 3 },
				{ id: "s", type: "float", default:6, min:1, max:5, size: 8, fixed:2 },
				{ id: "t", type: "float", default:6, min:1, max:5, size: 8, fixed:2 },
				{ id: "u", type: "float", default:6, min:1, max:5, size: 8, fixed:2, wrap: true },
				{ id: "v", type: "bool", value: true },
				{ id: "w", type: "bool", value: false },
				{ id: "x", type:"int", default:0, size:2, min:0, max:3, wrap:true },
				{ id: "y", type:"int", default:1, size:2, min:0, max:3, wrap:true },
				{ id: "z", type:"int", default:3, size:2, min:0, max:3, wrap:true },
				{ id: "aa", type:"int", default:1, size:2, wrap:true },
				{ id: "bb", type:"int", default:3, size:2, wrap:true }
			];
			expected = {
				a:0,
				b:1,
				c:3,
				d:1,
				e:5,
				f:2,
				g:5,
				h:10,
				i:60,
				j:359,
				k:0,
				l:1,
				m:3,
				n:5,
				o:5.5,
				p:0.5,
				q:1.5,
				r:1,
				s:5,
				t:5,
				u:2,
				v:true,
				w:false,
				x:0,
				y:1,
				z:0,
				aa:1,
				bb:0
			};
		});
		it("default", function() {
			const { archive, unarchive } = lursa(schema);
			const archived = archive({});
			const unarchived = unarchive(archived);
			assert.deepEqual(unarchived,expected);
		});
		it("manual", function() {
			const { archive, unarchive } = lursa(schema);
			const archived = archive(expected);
			const unarchived = unarchive(archived);
			assert.deepEqual(unarchived,expected);
		});
	});

	describe("enum", function() {
		let schema,expected;
		beforeEach( function() {
			schema = [
				{ id:"a", type:"int", size:1, default:1 },
				{ id:"b", type:"enum", values:["one","two","three"] },
				{ id:"c", type:"enum", values:["four","five","six"], default:1 }
			];
			expected = {
				a:1,
				b:"one",
				c:"five"
			};
		});
		it("works", function() {
			const { archive, unarchive } = lursa(schema);
			const archived = archive({});
			const unarchived = unarchive(archived);
			assert.deepEqual(unarchived,expected);
		});
	});

	describe("group", function() {
		let schema,expected;
		beforeEach( function() {
			schema = [
				{ id:"a", type:"bool" },
				{ id:"one", type:"group", values:[
					{ id:"b", type:"bool", default:true },
					//{ id:"two", type:"group", default:
					[
						{ id:"c", type:"bool", default:false },
						{ id:"d", type:"bool", default:true }
					]
					//}
				] },
				{ id:"e", type:"bool", default:true }
			];
			expected = {
				a:false,
				//one:["b","two"], // Removed because it's not helpful. Groups are hidden from state.
				b:true,
				//two: ["c","d"], // Removed because it's not helpful. Groups are hidden from state.
				c: false,
				d: true,
				e: true
			};
		});
		it("default", function() {
			const { archive, unarchive } = lursa(schema);
			const archived = archive({});
			const unarchived = unarchive(archived);
			assert.deepEqual(unarchived,expected);
		});
		it("manual", function() {
			const { archive, unarchive } = lursa(schema);
			const archived = archive(expected);
			const unarchived = unarchive(archived);
			assert.deepEqual(unarchived,expected);
		});
	});

	describe("chooser", function() {
		let schema,expected;
		beforeEach( function() {
			schema = [
				{ id:"a", type:"bool", default:true },
				{ id:"one", type:"chooser", default:2, values:[
					{ id:"b", type:"bool", default:true },
					[
						{ id:"c", type:"bool", default:false },
						{ id:"d", type:"bool", default:true }
					],
					{ id:"two", type:"group", default:[
						{ id:"e", type:"bool", default:false },
						{ id:"f", type:"bool", default:true }
					] }

				] },
				{ id:"g", type:"bool", default:true }
			];
			expected = { // Unselected items are hidden. It should probably parse everything even if not chosen. Maybe this way won't overwrite user settings and will preserve values when unchosen then re-chosen
				a: true,
				one: 2,
				e: false,
				f: true,
				g: true
			};
		});
		it("default", function() {
			const { archive, unarchive } = lursa(schema);
			const archived = archive({});
			const unarchived = unarchive(archived);
			assert.deepEqual(unarchived,expected);
		});
		it("setting", function() {
			const { archive, unarchive } = lursa(schema);
			const archived = archive(expected);
			const unarchived = unarchive(archived);
			assert.deepEqual(unarchived,expected);
		});
	});
});
