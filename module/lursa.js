var bigInt = require("big-integer");

var alphabet = "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"; // no 1,0,l,I,O // consider removing 5 and S, maybe 8 and B

var base = alphabet.length; // 57

var ROOT_KEY = "root";
var lursa = function lursa(schema) {
  return {
    archive: function archive(settings) {
      return _archive(settings, schema);
    },
    unarchive: function unarchive(settings) {
      return _unarchive(settings, schema);
    }
  };
};

function process(schema) {
  var topLevelIds = [];
  var children = [];
  var result = {};
  result[ROOT_KEY] = {
    type: "root",
    childIds: topLevelIds,
    children: children
  };
  schema.forEach(function (preset) {
    topLevelIds.push(preset.id);
    children.push(preset);
    processPreset(preset, result);
  });
  return result;
}

function choicesForItem(item, isEnum) {
  var choices = item.choices;
  if (!isEnum && no(choices)) choices = item["default"];
  if (no(choices)) choices = item.values;
  if (no(choices)) choices = [];
  return choices;
}

function processPreset(preset, result) {
  if (Array.isArray(preset)) {
    preset.forEach(function (choice) {
      processPreset(choice, result);
    });
  } else {
    var key = preset.id;
    var childIds = [];

    if (preset.type === "root") {
      //console.log("ROOT");
      var choices = choicesForItem(preset);
      choices.forEach(function (choice) {
        childIds.push(choice.id);
        processPreset(choice, result);
      });
      result[key] = {
        id: key,
        value: key,
        type: preset.type,
        name: key,
        childIds: childIds
      };
    } else if (preset.type === "chooser") {
      // process all regardless, unlike unarchiving
      var _choices = choicesForItem(preset, true);

      _choices.forEach(function (choice, index) {
        childIds.push(choice.id);
        processPreset(choice, result);
      });

      result[key] = Object.assign({
        name: preset.displayName,
        value: preset["default"],
        childIds: childIds
      }, preset);
    } else if (preset.type === "group") {
      var _choices2 = choicesForItem(preset);

      result[key] = Object.assign({
        name: preset.displayName,
        value: preset["default"]
      }, preset);

      _choices2.forEach(function (choice) {
        processPreset(choice, result);
      });
    } else {
      // not a group
      result[key] = Object.assign({
        name: preset.displayName,
        value: preset["default"]
      }, preset);
    }
  }
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

function toUglyValue(value, item) {
  // validates via wrap and clamp
  if (no(value)) return 0;
  var type = item.type;
  var min = item.min;
  var max = item.max;
  var size = sizeOfItem(item);
  if (type === "bool") return value ? 1 : 0;else if (type === "int") {
    if (no(size)) return 0;
    var length = Math.pow(2, size) - 1;
    var start = min;
    var end = max;

    if (yes(min) && yes(max)) {
      length = max - min;
    } else if (yes(min)) {
      end = min + length;
    } else if (yes(max)) {
      start = max - length;
    } else {
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
        value = Math.max(min, value);
        value = Math.min(max, value);
      }

      value = (value - min) / span * _length;
    } else if (yes(min)) {
      value = value - min;
    } else if (yes(max)) {
      var _start = max - _length;

      value = value - _start;
    }

    return Math.round(value);
  } else if (type === "enum") {
    return specifiedPrettyValue(item); // pretty needed, don't want to become re-entrant
  }
  return value;
}

function toPrettyValue(value, item) {
  var type = item.type;
  var min = item.min;
  var max = item.max;
  var size = item.size;
  if (type === "bool") return value ? true : false;else if (type === "int") {
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
      var _start2 = max - _length2;

      value = _start2 + value;
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

function sizeOfItem(item) {
  var type = item.type;
  if (type === "bool") return 1;
  if (type === "group") return 0;

  if (type === "enum" || type === "chooser") {
    var values = choicesForItem(item, true);
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

var convert = function convert(settings, schema) {
  var processed = process(schema);
  var result = {};
  Object.keys(settings).forEach(function (key) {
    var value = settings[key];
    var item = processed[key];

    if (yes(item)) {
      value = toUglyValue(value, item);
    }

    result[key] = value;
  });
  return result;
};

var unconvert = function unconvert(settings, schema, processed) {
  if (no(processed)) processed = process(schema);
  var result = {};
  Object.keys(settings).forEach(function (key) {
    var value = settings[key];
    var item = processed[key];

    if (yes(item)) {
      value = toPrettyValue(value, item);
    }

    result[key] = value;
  });
  return result;
};

var _archive = function _archive(settings, schema) {
  if (no(schema)) throw new Error("no schema to use for archiving"); //console.log("archive pretty:%s;",JSON.stringify(settings));

  settings = convert(settings, schema); //console.log("archive ugly:%s;",JSON.stringify(settings));

  if (no(settings) || settings === null) settings = {};
  var processed = process(schema);
  Object.keys(settings).forEach(function (key) {
    if (processed[key]) processed[key].value = settings[key];
  });
  var archived = archiveItems(ROOT_KEY, processed, 0, bigInt());
  var number = archived.number;
  var string = "";

  while (number.greater(0)) {
    var _int = bigInt(number);

    string = alphabet.charAt(_int.mod(base)) + string;
    number = bigInt(number.divide(base));
  } //console.log("archive hash:%s;",string);


  return string;
};

function archiveItems(key, dict, current, number, item) {
  if (no(item)) item = dict[key];
  var value = specifiedPrettyValue(item);

  if (item.type === "chooser") {
    var _choices3 = choicesForItem(item);

    value = _choices3.indexOf(value);
    if (value < 0) value = 0;
  }

  var size = sizeOfItem(item);

  if (size) {
    var length = Math.pow(2, size) - 1;

    if (item.type === "bool") {
      while (value < 0) {
        value += 2;
      }

      while (value > 1) {
        value -= 2;
      }
    } else if (item.type === "int") {
      if (item.wrap) {
        while (value < 0) {
          value += length;
        }

        while (value >= length) {
          value -= length;
        } // if wrap, max is exclusive!

      } else {
        if (value < 0) value = 0;
        if (value > length) value = length; // if not wrap, max is inclusive!
      }
    } else if (item.type === "float") {
      if (item.wrap) {
        while (value < 0) {
          value += length;
        }

        while (value >= length) {
          value -= length;
        } // if wrap, max is exclusive!

      } else {
        if (value < 0) value = 0;
        if (value > length) value = length; // if not wrap, max is inclusive!
      }
    }

    if (Number.isNaN(value)) throw new Error("value is not a number:" + key + ";");

    var _int2 = bigInt(value);

    if (_int2 === null) throw new Error("value is null:" + key + ";");

    var shifted = _int2.shiftLeft(current);

    number = bigInt(number.or(shifted));
    current += size;
  }

  var choices = choicesForItem(item);

  if (choices && item.type !== "enum") {
    choices.forEach(function (item) {
      var archived = archiveItems(item.id, dict, current, number);
      number = archived.number;
      current = archived.current;
    });
  } else {
    if (item.childIds) item.childIds.forEach(function (id) {
      var archived = archiveItems(id, dict, current, number);
      number = archived.number;
      current = archived.current;
    });
  }

  return {
    current: current,
    number: number
  };
}

var _unarchive = function _unarchive(string, schema) {
  // unconvert url query string to object literal
  //console.log("unarchive hash:%s;",string);
  if (no(schema)) throw new Error("no schema to use for unarchiving");
  var processed = process(schema);
  if (no(string) || string === null) string = "";
  var length = string.length;
  var number = bigInt();

  for (var i = 0; i < length; i++) {
    number = bigInt(number.times(base).plus(alphabet.indexOf(string.charAt(i))));
  }

  var ugly = {};
  var root = processed[ROOT_KEY];
  var children = root.children;
  delete root.children;
  console.log("unarchive processed:%s;", JSON.stringify(processed));
  unarchiveItems(processed, children, ugly, 0, length ? number : undefined); //console.log("unarchive ugly:%s;",JSON.stringify(ugly));

  var pretty = unconvert(ugly, schema, processed); //console.log("unarchive pretty:%s;",JSON.stringify(pretty));

  return pretty;
};

function unarchiveItems(processed, item, result, current, number) {
  // this depends on initial structure of presets, item must come before sections
  var children = [];
  if (Array.isArray(item)) children = item;else if (item.type === "group") children = choicesForItem(item);else {
    var size = sizeOfItem(item);

    if (size) {
      var value = no(number) ? specifiedUglyValue(item) : bigInt(number).shiftRight(current).and(Math.pow(2, size) - 1).toJSNumber();
      current += size;

      if (item.type === "chooser") {
        result[item.id] = value;
        var choices = choicesForItem(item, true);

        if (choices && value >= 0 && value < choices.length) {
          var child = choices[value]; // object in array at index

          var childId = child.id;
          var childIds = [childId]; // other items are hidden

          var copy = Object.assign({}, item);
          copy.childIds = childIds;
          processed[copy.id] = copy; // shouldn't be mutating

          item = copy;
          children.push(child); // othe items are hidden
        }
      } else {
        result[item.id] = value;
      }
    }
  }
  children.forEach(function (child) {
    // has to be childIds because of root item
    current = unarchiveItems(processed, child, result, current, number);
  });
  return current;
}

export { _archive as archive, lursa, _unarchive as unarchive };
