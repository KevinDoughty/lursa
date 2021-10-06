var bigInt = require("big-integer");

var alphabet = "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"; // no 1,0,l,I,O // 5,S and 8,B are ok

var base = alphabet.length; // 57

var lursa = function lursa(schema) {
  return {
    archive: function archive(settings) {
      return _archive(settings, schema);
    },
    unarchive: function unarchive(settings) {
      return _unarchive(settings, schema);
    },
    increment: function increment(key, value, amount) {
      return _increment(key, value, amount, schema);
    },
    decrement: function decrement(key, value, amount) {
      return _decrement(key, value, amount, schema);
    }
  };
};

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
  var value = item.value;
  if (no(value)) value = item["default"];
  return value;
}

function specifiedUglyValue(item) {
  var value = specifiedPrettyValue(item);
  return toUglyValue(value, item);
}

function choicesForItem(item) {
  var choices = item.choices;
  if (no(choices)) choices = item.values;
  if (no(choices)) choices = [];
  return choices;
}

function sizeOfItem(item) {
  var type = item.type;
  if (type === "bool") return 1;
  if (type === "group") return 0;

  if (type === "enum" || type === "chooser") {
    var values = choicesForItem(item);
    if (no(values)) return 0;
    var span = values.length;
    var size = 0;

    while (Math.pow(2, size) < span) {
      size++;
    }

    return size;
  }

  if (yes(item.size)) return item.size;
  var min = item.min;
  var max = item.max;
  var wrap = item.wrap;

  if (type === "int") {
    if (yes(min) && yes(max)) {
      var _span = max - min;

      if (wrap) _span--;
      if (_span < 1) return 0; // if max and min are the same, span will be 0, or -1 with wrap

      var _size = 0;

      while (Math.pow(2, _size) < _span) {
        _size++;
      }

      return _size;
    }

    return 0;
  }

  if (type === "float") {
    if (yes(min) && yes(max)) {
      return max - min;
    }

    return 0;
  }

  return 0;
}

function process(schema) {
  var result = {};
  processPreset(schema, result);
  return result;
}

function processPreset(preset, result) {
  if (Array.isArray(preset)) {
    preset.forEach(function (choice) {
      processPreset(choice, result);
    });
  } else {
    var key = preset.id;

    if (preset.type === "group" || preset.type === "chooser") {
      var choices = choicesForItem(preset);
      result[key] = Object.assign({
        value: preset["default"]
      }, preset);
      choices.forEach(function (choice) {
        processPreset(choice, result);
      });
    } else {
      // not a group
      result[key] = Object.assign({
        value: preset["default"]
      }, preset);
    }
  }
}

function toUglyValue(value, item) {
  // sanitizes via wrap and clamp
  if (no(value)) return 0;
  var type = item.type;
  if (type === "bool") return value ? 1 : 0;else if (type === "enum" || type === "chooser") return specifiedPrettyValue(item); // pretty needed, don't want to become re-entrant
  else {
      var min = item.min;
      var max = item.max;
      var size = sizeOfItem(item);

      if (type === "int") {
        if (no(size)) return 0;
        var length = Math.pow(2, size) - 1;
        var start = min;
        var end = max;
        if (yes(min) && yes(max)) length = max - min;else if (yes(min)) end = min + length;else if (yes(max)) start = max - length;else {
          start = 0;
          end = length;
        }

        if (item.wrap) {
          while (value >= end) {
            value -= length;
          }

          while (value < start) {
            value += length;
          }
        } else {
          // clamp
          value = Math.max(start, value);
          value = Math.min(end, value);
        }

        value = value - start;
        return Math.round(value);
      } else if (type === "float") {
        if (no(size)) return 0;

        var _length = Math.pow(2, size) - 1;

        if (yes(min) && yes(max)) {
          var span = max - min;

          if (item.wrap) {
            while (value >= max) {
              value -= span;
            }

            while (value < min) {
              value += span;
            }
          } else {
            // clamp
            value = Math.max(min, value);
            value = Math.min(max, value);
          }

          value = (value - min) / span * _length;
        } else if (yes(min)) value = value - min;else if (yes(max)) value = value - max - _length;

        return Math.round(value);
      }
    }
  return value;
}

function toPrettyValue(value, item) {
  var type = item.type;
  var min = item.min;
  var max = item.max;
  var size = item.size;
  if (type === "bool") return value % 2 ? true : false;else if (type === "int") {
    if (no(size)) return 0;
    var length = Math.pow(2, size) - 1;

    if (yes(min)) {
      value = min + value;
    } else if (yes(max)) {
      var start = max - length;
      value = start + value;
    }
  } else if (type === "float") {
    if (no(size)) return 0;

    var _length2 = Math.pow(2, size) - 1;

    if (yes(min) && yes(max)) {
      var span = max - min;
      value = value / _length2 * span;
      value = min + value;
    } else if (yes(min)) {
      value = min + value;
    } else if (yes(max)) {
      var _start = max - _length2;

      value = _start + value;
    }

    if (yes(item.fixed)) value = value.toFixed(item.fixed) * 1;
  } else if (type === "enum") {
    var values = item.values;
    if (no(values) || !values.length) return null;
    if (no(value)) value = 0;
    if (value < 0) value = 0;
    if (value >= values.length) value = values.length - 1;
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
  value = toPrettyValue(value, item);
  if (isFunction(item.unarchive)) value = item.unarchive.call(item, value);
  return value;
}

function _archive(settings, schema) {
  if (no(schema)) throw new Error("no schema to use for archiving");
  if (no(settings) || settings === null) settings = {};
  var archived = archiveItem(schema, settings, 0, bigInt());
  var number = archived.number;
  var string = "";

  while (number.greater(0)) {
    var _int = bigInt(number);

    string = alphabet.charAt(_int.mod(base)) + string;
    number = bigInt(number.divide(base));
  }

  return string;
}

function archiveItem(item, converted, current, number) {
  var choices = [];

  if (Array.isArray(item)) {
    choices = item;
  } else {
    var type = item.type;
    var value = converted[item.id];
    if (type === "group") choices = choicesForItem(item);

    if (type === "chooser") {
      if (no(value)) value = specifiedPrettyValue(item); // converted can be {}, giving no value.

      choices = [choicesForItem(item)[value]];
    }

    var size = sizeOfItem(item);

    if (size) {
      value = convert(value, item);

      var _int2 = bigInt(value);

      var shifted = _int2.shiftLeft(current);

      number = bigInt(number.or(shifted));
      current += size;
    }
  }

  choices.forEach(function (item) {
    var archived = archiveItem(item, converted, current, number);
    number = archived.number;
    current = archived.current;
  });
  return {
    current: current,
    number: number
  };
}

function _unarchive(string, schema) {
  // unconvert url query string to object literal
  if (no(schema)) throw new Error("no schema to use for unarchiving");
  var processed = process(schema);
  if (no(string) || string === null) string = "";
  var length = string.length;
  var number = bigInt();

  for (var i = 0; i < length; i++) {
    number = bigInt(number.times(base).plus(alphabet.indexOf(string.charAt(i))));
  }

  var ugly = {};
  unarchiveItem(schema, ugly, 0, length ? number : undefined); // last argument optional for special handling of zero length string

  var pretty = unconvert(ugly, processed);
  return pretty;
}

function unarchiveItem(item, result, current, number) {
  // last argument optional for special handling of zero length string
  var children = [];
  if (Array.isArray(item)) children = item;else if (item.type === "group") children = choicesForItem(item);else {
    var size = sizeOfItem(item);

    if (size) {
      var value = no(number) ? specifiedUglyValue(item) : bigInt(number).shiftRight(current).and(Math.pow(2, size) - 1).toJSNumber();
      current += size;
      value = unconvert(value, item);

      if (item.type === "chooser") {
        var choices = choicesForItem(item);

        if (value >= 0 && value < choices.length) {
          var child = choices[value]; // object in array at index

          children.push(child); // othe items are hidden
        }
      }

      result[item.id] = value;
    }
  }
  children.forEach(function (child) {
    current = unarchiveItem(child, result, current, number);
  });
  return current;
}

function _increment(key, value, amount, schema) {
  if (no(schema)) throw new Error("no schema for increment");
  if (typeof amount === "undefined" || amount === null) amount = 1;
  var processed = process(schema);
  var item = processed[key];
  var ugly = convert(value, item);
  var pretty = unconvert(ugly + amount, item);
  return pretty;
}

function _decrement(key, value, amount, schema) {
  if (no(schema)) throw new Error("no schema for decrement");
  if (typeof amount === "undefined" || amount === null) amount = 1;
  return _increment(key, value, amount * -1, schema);
}

export default lursa;
