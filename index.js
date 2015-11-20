(function () {


    function fieldmap(func, obj) {
        for (var k in obj) {
            func(obj[k], k);
        }
    }

    function map(func, array) {
        var out = [];
        for (var i = 0; i < array.length; i++) {
            out.push(func(array[i]));
        }
        return out;
    }

    function constructCurrentPath(path, seperator, k) {
        var currentPath;

        if (path === '') {
            currentPath = k;
        } else {
            currentPath = path + seperator + k;
        }

        return currentPath;
    }

    function flattenToFixedIndex(source, out, fullPath) {
        for (var k in source) {
            if (typeof source[k] !== 'object') {
                var value = source[k];
                var path = constructCurrentPath(fullPath, seperator, k,
                    source);

                out[path] = value;
            } else {
                var path = constructCurrentPath(fullPath, seperator, k,
                    source);
                flattenToFixedIndex(source[k], out, path);
            }
        }
    }

    function unflatten(source) {
        if (source.constructor === Array) {
            return unflattenToDynamicIndex(source);
        } else {
            return unflattenToFixedIndex(source);
        }
    }

    function unflattenToDynamicIndex(source) {
        var out = {};

        map(function (item) {
            fieldmap(function (value, fieldname) {
                var paths = fieldname.split(seperator);

                var currentObj = out;

                for (var i = 0; i < paths.length; i++) {
                    var currentKey = paths[i];

                    if (i === paths.length - 1) {
                        if (currentObj[currentKey] === undefined) {
                            currentObj[currentKey] = value;
                        } else if (currentObj[currentKey].constructor ===
                            Array) {
                            currentObj[currentKey].push(value);
                        } else if (currentObj[currentKey] !== value) {
                            var temp = currentObj[currentKey];
                            currentObj[currentKey] = [];
                            currentObj[currentKey].push(temp);
                            currentObj[currentKey].push(value);
                        }
                    } else {
                        if (!currentObj[currentKey]) {
                            currentObj[currentKey] = {}
                        }

                        currentObj = currentObj[currentKey];
                    }
                }
            }, item);
        }, source);

        return out;
    }

    function unflattenToFixedIndex(source) {
        var obj = {};

        fieldmap(function (source, k) {
            var split = k.split(seperator);

            if (split.length > 1) {
                var current = obj;
                for (var i = 1; i < split.length; i++) {
                    var newObj;

                    var field = split[i];
                    if (!isNaN(field)) {
                        newObj = [];
                    } else {
                        newObj = {};
                    }

                    current[split[i - 1]] =
                        current[split[i - 1]] ? current[split[i - 1]] :
                            newObj;

                    if (i + 1 === split.length) {
                        current[split[i - 1]][field] = source;
                    } else {
                        current = current[split[i - 1]];
                    }
                }
            } else {
                obj[k] = source;
            }
        }, source);


        return obj;
    }

    function flattenToDynamicIndex(source, out) {
        var arrayWasPopped = false;
        do {
            arrayWasPopped = false;

            var current = {};

            out.push(current);

            fieldmap(function (source, k) {
                var type = source.constructor;

                if (type === Array) {
                    current[k] = source.shift();

                    if (source.length !== 0) {
                        arrayWasPopped = true;
                    }
                } else {
                    current[k] = source;
                }
            }, source);
        } while (arrayWasPopped)
    }

    function applyCustomMappingsToFlatObject(obj, mappings) {
        fieldmap(function (source, k) {
            if (mappings[k]) {
                var temp = source;
                delete source;
                obj[mappings[k]] = temp;
            }
        }, obj);
    }


    var seperator = '_';
    var defaultToCustomMappings = {};
    var customToDefaultMappings = {};
    var useDynamicIndex = false;

    var Norm = function (params) {
        if (!params) {
            params = {}
        }

        if (params.mappings) {
            map(function (mapping) {
                defaultToCustomMappings[mapping.from] = mapping.to;
                customToDefaultMappings[mapping.to] = mapping.from;
            }, params.mappings);
        }

        useDynamicIndex = params.useDynamicArrays;

        seperator = params.seperator ? params.seperator : '_';
    };

    Norm.prototype.denormalize = function (obj) {
        var out;
        if (useDynamicIndex) {
            out = [];
            flattenToDynamicIndex(obj, out);
        } else {
            out = {};
            flattenToFixedIndex(obj, out, '');
        }
        applyCustomMappingsToFlatObject(out, defaultToCustomMappings);
        return out;
    };

    Norm.prototype.normalize = function (obj) {
        applyCustomMappingsToFlatObject(obj, customToDefaultMappings);
        return unflatten(obj);
    };

    module.exports = Norm;

}());
