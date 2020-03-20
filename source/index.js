const bigInt = require("big-integer");

const alphabet = "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"; // no 1,0,l,I,O // 5,S and 8,B are ok
const base = alphabet.length; // 57

const lursa = function(schema) {
	return {
		archive: settings => archive(settings,schema),
		unarchive: settings => unarchive(settings,schema)
	};
};
export default lursa;

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

function choicesForItem(item,isEnum) {
	let choices = item.choices;
	if (!isEnum && no(choices)) choices = item.default;
	if (no(choices)) choices = item.values;
	if (no(choices)) choices = [];
	return choices;
}

function sizeOfItem(item) {
	const type = item.type;
	if (type === "bool") return 1;
	if (type === "group") return 0;
	if (type === "enum" || type === "chooser") {
		const values = choicesForItem(item, true);
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
			const choices = choicesForItem(preset, preset.type === "chooser");
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
	else if (type === "enum") return specifiedPrettyValue(item); // pretty needed, don't want to become re-entrant
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
	if (type === "bool") return value ? true : false;
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

function convert(settings, schema, processed) {
	const result = {};
	Object.keys(settings).forEach( function(key) {
		let value = settings[key];
		const item = processed[key];
		if (yes(item)) {
			value = toUglyValue(value,item);
		}
		result[key] = value;
	});
	return result;
}

function unconvert(settings, schema, processed) {
	const result = {};
	Object.keys(settings).forEach( function(key) {
		let value = settings[key];
		const item = processed[key];
		if (yes(item)) {
			value = toPrettyValue(value,item);
		}
		result[key] = value;
	});
	return result;
}

function archive(settings, schema) {
	if (no(schema)) throw new Error("no schema to use for archiving");
	const processed = process(schema);
	settings = convert(settings,schema,processed);
	if (no(settings) || settings === null) settings = {};
	Object.keys(settings).forEach( function(key) {
		if (processed[key]) processed[key].value = settings[key];
	});
	const archived = archiveItems(schema, processed, 0, bigInt());
	let number = archived.number;
	let string = "";
	while (number.greater(0)) {
		const int = bigInt(number);
		string = alphabet.charAt(int.mod(base)) + string;
		number = bigInt(number.divide(base));
	}
	return string;
}

function archiveItems(item,processed,current,number) {
	let choices;
	if (Array.isArray(item)) {
		choices = item;
	} else {
		choices = choicesForItem(item);
		let value = specifiedPrettyValue(item);
		if (item.type === "chooser") {
			value = choices.indexOf(value);
			if (value < 0) value = 0;
		}
		let size = sizeOfItem(item);
		if (size) {
			const length = Math.pow(2,size)-1;
			if (item.type === "bool") {
				while (value < 0) value += 2;
				while (value > 1) value -= 2;
			} else if (item.type === "int") {
				if (item.wrap) {
					while (value < 0) value += length;
					while (value >= length) value -= length; // if wrap, max is exclusive!
				} else {
					if (value < 0) value = 0;
					if (value > length) value = length; // if not wrap, max is inclusive!
				}
			} else if (item.type === "float") {
				if (item.wrap) {
					while (value < 0) value += length;
					while (value >= length) value -= length; // if wrap, max is exclusive!
				} else {
					if (value < 0) value = 0;
					if (value > length) value = length; // if not wrap, max is inclusive!
				}
			}
			const int = bigInt(value);
			const shifted = int.shiftLeft(current);
			number = bigInt(number.or(shifted));
			current += size;
		}
	}
	choices.forEach( item => {
		const archived = archiveItems(item.id,processed,current,number);
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
	unarchiveItems(processed, schema, ugly, 0, length ? number : undefined); // last argument optional for special handling of zero length string
	const pretty = unconvert(ugly,schema,processed);
	return pretty;
}

function unarchiveItems(processed, item, result, current, number) {  // last argument optional for special handling of zero length string
	let children = [];
	if (Array.isArray(item)) children = item;
	else if (item.type === "group") children = choicesForItem(item);
	else {
		let size = sizeOfItem(item);
		if (size) {
			const value = (no(number)) ?
				specifiedUglyValue(item)
				: bigInt(number).shiftRight(current).and(Math.pow(2,size)-1).toJSNumber();
			current += size;
			if (item.type === "chooser") {
				result[item.id] = value;
				const choices = choicesForItem(item,true);
				if (value >= 0 && value < choices.length) {
					const child = choices[value]; // object in array at index
					children.push(child); // othe items are hidden
				}
			} else {
				result[item.id] = value;
			}
		}
	}
	children.forEach( child => {
		current = unarchiveItems(processed, child, result, current, number);
	});
	return current;
}
