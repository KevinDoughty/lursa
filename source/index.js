const bigInt = require("big-integer");

const alphabet = "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"; // no 1,0,l,I,O // 5,S and 8,B are ok
const base = alphabet.length; // 57

const lursa = function(schema) {
	return {
		archive: settings => archive(settings,schema),
		unarchive: settings => unarchive(settings,schema),
		increment: (key, value, amount) => increment(key, value, amount, schema),
		decrement: (key, value, amount) => decrement(key, value, amount, schema)

	};
};
export default lursa;

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

function no(value) {
	return typeof value === "undefined";
}
function yes(value) {
	return !no(value);
}
function specifiedPrettyValue(item) {
	let value = item.value;
	if (no(value)) value = item.default;
	return value;
}
function specifiedUglyValue(item) {
	const value = specifiedPrettyValue(item);
	return toUglyValue(value,item);
}

function choicesForItem(item) {
	let choices = item.choices;
	if (no(choices)) choices = item.values;
	if (no(choices)) choices = [];
	return choices;
}

function sizeOfItem(item) {
	const type = item.type;
	if (type === "bool") return 1;
	if (type === "group") return 0;
	if (type === "enum" || type === "chooser") {
		const values = choicesForItem(item);
		if (no(values)) return 0;
		const span = values.length;
		let size = 0;
		while (Math.pow(2,size) < span) {
			size++;
		}
		return size;
	}
	if (yes(item.size) ) return item.size;
	const min = item.min;
	const max = item.max;
	const wrap = item.wrap;
	if (type === "int") {
		if (yes(min) && yes(max)) {
			let span = max-min;
			if (wrap) span--;
			if (span < 1) return 0;// if max and min are the same, span will be 0, or -1 with wrap
			let size = 0;
			while (Math.pow(2,size) < span) {
				size++;
			}
			return size;
		}
		return 0;
	}
	if (type === "float") {
		if (yes(min) && yes(max)) {
			return max-min;
		}
		return 0;
	}
	return 0;
}

function process(schema) {
	const result = {};
	processPreset(schema,result);
	return result;
}

function processPreset(preset,result) {
	if (Array.isArray(preset)) {
		preset.forEach( function(choice) {
			processPreset(choice,result);
		});
	} else {
		const key = preset.id;
		if (preset.type === "group" || preset.type === "chooser") {
			const choices = choicesForItem(preset);
			result[key] = Object.assign({
				value: preset.default
			}, preset);
			choices.forEach( function(choice) {
				processPreset(choice,result);
			});
		} else { // not a group
			result[key] = Object.assign({
				value: preset.default
			}, preset);
		}
	}
}

function toUglyValue(value,item) { // sanitizes via wrap and clamp
	if (no(value)) return 0;
	const type = item.type;
	if (type === "bool") return value ? 1 : 0;
	else if (type === "enum" || type === "chooser") return specifiedPrettyValue(item); // pretty needed, don't want to become re-entrant
	else {
		const min = item.min;
		const max = item.max;
		const size = sizeOfItem(item);
		if (type === "int") {
			if (no(size)) return 0;
			let length = Math.pow(2,size)-1;
			let start = min;
			let end = max;
			if (yes(min) && yes(max)) length = max-min;
			else if (yes(min)) end = min + length;
			else if (yes(max)) start = max - length;
			else {
				start = 0;
				end = length;
			}
			if (item.wrap) {
				while (value >= end) value -= length;
				while (value < start) value += length;
			} else { // clamp
				value = Math.max(start,value);
				value = Math.min(end,value);
			}
			value = value - start;
			return Math.round(value);
		} else if (type === "float") {
			if (no(size)) return 0;
			const length = Math.pow(2,size)-1;
			if (yes(min) && yes(max)) {
				const span = max-min;
				if (item.wrap) {
					while (value >= max) value -= span;
					while (value < min) value += span;
				} else { // clamp
					value = Math.max(min,value);
					value = Math.min(max,value);
				}
				value = (value-min) / span * length;
			} else if (yes(min)) value = value - min;
			else if (yes(max)) value = value - max - length;
			return Math.round(value);
		}
	}
	return value;
}

function toPrettyValue(value,item) {
	const type = item.type;
	const min = item.min;
	const max = item.max;
	const size = item.size;
	if (type === "bool") return (value % 2) ? true : false;
	else if (type === "int") {
		if (no(size)) return 0;
		const length = Math.pow(2,size) - 1;
		if (yes(min)) {
			value = min + value;
		} else if (yes(max)) {
			const start = max-length;
			value = start + value;
		}
	} else if (type === "float") {
		if (no(size)) return 0;
		const length = Math.pow(2,size) - 1;
		if (yes(min) && yes(max)) {
			const span = max-min;
			value = (value/length) * span;
			value = min + value;
		} else if (yes(min)) {
			value = min + value;
		} else if (yes(max)) {
			const start = max-length;
			value = start + value;
		}
		if (yes(item.fixed)) value = value.toFixed(item.fixed) * 1;
	} else if (type === "enum") {
		const values = item.values;
		if (no(values) || !values.length) return null;
		if (no(value)) value = 0;
		if (value < 0) value = 0;
		if (value >= values.length) value = values.length-1;
		return values[value];
	}
	if (no(value)) value = 0;
	return value;
}

function convert(value, item) {
	if (no(value)) value = specifiedPrettyValue(item);
	if (isFunction(item.archive)) value = item.archive.call(item, value);
	value = toUglyValue(value, item);
	return value;
}

function unconvert(value, item) {
	value = toPrettyValue(value,item);
	if (isFunction(item.unarchive)) value = item.unarchive.call(item, value);
	return value;
}

function archive(settings, schema) {
	if (no(schema)) throw new Error("no schema to use for archiving");
	if (no(settings) || settings === null) settings = {};
	const archived = archiveItem(schema, settings, 0, bigInt());
	let number = archived.number;
	let string = "";
	while (number.greater(0)) {
		const int = bigInt(number);
		string = alphabet.charAt(int.mod(base)) + string;
		number = bigInt(number.divide(base));
	}
	return string;
}

function archiveItem(item,converted,current,number) {
	let choices = [];
	if (Array.isArray(item)) {
		choices = item;
	} else {
		const type = item.type;
		let value = converted[item.id];
		if (type === "group") choices = choicesForItem(item);
		if (type === "chooser") {
			if (no(value)) value = specifiedPrettyValue(item); // converted can be {}, giving no value.
			choices = [choicesForItem(item)[value]];
		}
		let size = sizeOfItem(item);
		if (size) {
			value = convert(value, item);
			const int = bigInt(value);
			const shifted = int.shiftLeft(current);
			number = bigInt(number.or(shifted));
			current += size;
		}
	}
	choices.forEach( item => {
		const archived = archiveItem(item,converted,current,number);
		number = archived.number;
		current = archived.current;
	});
	return { current, number };
}

function unarchive(string, schema) { // unconvert url query string to object literal
	if (no(schema)) throw new Error("no schema to use for unarchiving");
	const processed = process(schema);
	if (no(string) || string === null) string = "";
	const length = string.length;
	let number = bigInt();
	for (let i=0; i<length; i++) {
		number = bigInt(number.times(base).plus(alphabet.indexOf(string.charAt(i))));
	}
	const ugly = {};
	unarchiveItem(schema, ugly, 0, length ? number : undefined); // last argument optional for special handling of zero length string
	const pretty = unconvert(ugly,processed);
	return pretty;
}

function unarchiveItem(item, result, current, number) {  // last argument optional for special handling of zero length string
	let children = [];
	if (Array.isArray(item)) children = item;
	else if (item.type === "group") children = choicesForItem(item);
	else {
		let size = sizeOfItem(item);
		if (size) {
			let value = (no(number)) ?
				specifiedUglyValue(item)
				: bigInt(number).shiftRight(current).and(Math.pow(2,size)-1).toJSNumber();
			current += size;

			value = unconvert(value, item);

			if (item.type === "chooser") {
				const choices = choicesForItem(item);
				if (value >= 0 && value < choices.length) {
					const child = choices[value]; // object in array at index
					children.push(child); // othe items are hidden
				}
			}
			result[item.id] = value;

		}
	}
	children.forEach( child => {
		current = unarchiveItem(child, result, current, number);
	});
	return current;
}

function increment(key, value, amount, schema) {
	if (no(schema)) throw new Error("no schema for increment");
	if (typeof amount === "undefined" || amount === null) amount = 1;
	const processed = process(schema);
	const item = processed[key];
	const ugly = convert(value, item);
	const pretty = unconvert(ugly+amount, item);
	return pretty;
}
function decrement(key, value, amount, schema) {
	if (no(schema)) throw new Error("no schema for decrement");
	if (typeof amount === "undefined" || amount === null) amount = 1;
	return increment(key, value, amount*-1, schema);
}
