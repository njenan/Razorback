(function () {
    var Functions = require('../Functions'),
        fieldmap = Functions.fieldmap,
        isObject = Functions.isObject,
        isArray = Functions.isArray,
        Path = require('../Path');


    var DynamicIndexMapper = function (_seperator, _exclusions) {

        function constructObjectPath(currentObj, paths, value) {
            paths.map(function (currentKey, index, array) {
                var isLast = index === array.length - 1;
                if (isLast) {
                    constructValueAtEndOfPath(currentObj, currentKey, value);
                } else {
                    currentObj = currentObj[currentKey] =
                        buildNextLevel(currentObj[currentKey]);
                }
            });
        }

        function constructValueAtEndOfPath(currentObj, currentKey, value) {
            if (currentObj[currentKey] === undefined) {
                currentObj[currentKey] = value;
            } else if (currentObj[currentKey].constructor === Array) {
                currentObj[currentKey].push(value);
            } else if (currentObj[currentKey] !== value) {
                currentObj[currentKey] =
                    convertValueToArray(currentObj[currentKey]);
                currentObj[currentKey].push(value);
            }
        }

        function buildNextLevel(obj) {
            if (obj) {
                return obj;
            } else {
                return {};
            }
        }

        function convertValueToArray(obj) {
            var array = [];
            array.push(obj);
            return array;
        }


        var iterateThroughArrayElement = function (current, wasPopped, out, currentPath, seperator) {
            var isDeep = false;
            var element = current.shift();

            if (isObject(element)) {
                wasPopped = iterateThroughKeys(element, out,
                    currentPath, seperator);
                isDeep = wasPopped;
            } else {
                out[currentPath.toFlatPath()] = element;
            }

            if (current.length > 0) {
                wasPopped = true;
            }

            if (isDeep) {
                current.unshift(element);
            }
            return wasPopped;
        };

        function iterateThroughKeys(source, out, path, seperator) {
            var wasPopped = false;
            fieldmap(function (current, key) {
                var currentPath = path.append(key);

                if (isArray(current)) {
                    if (isExcluded(currentPath)) {
                        out[currentPath.toFlatPath()] = current;
                    } else {
                        wasPopped =
                            iterateThroughArrayElement(current, wasPopped, out,
                                currentPath, seperator);
                    }
                } else if (isObject(current)) {
                    wasPopped =
                        iterateThroughKeys(current, out, currentPath,
                            seperator);
                } else {
                    out[currentPath.toFlatPath()] = current;
                }
            }, source);

            return wasPopped;
        }

        function isExcluded(path) {
            return exclusions.some(function (exclusion) {
                return path.matchesJPath(exclusion);
            });
        }

        var seperator = _seperator;
        var exclusions = _exclusions ? _exclusions.slice() : [];


        DynamicIndexMapper.prototype.flatten = function (source, out) {

            var arraysHaveRemainingElements = true;

            while (arraysHaveRemainingElements) {
                var temp = {};
                out.push(temp);
                arraysHaveRemainingElements =
                    iterateThroughKeys(source, temp, new Path(seperator),
                        seperator);
            }
        };

        DynamicIndexMapper.prototype.unflatten = function (source) {
            var out = {};

            source.map(function (item) {
                fieldmap(function (value, fieldname) {
                    var paths = fieldname.split(seperator);
                    var currentObj = out;

                    constructObjectPath(currentObj, paths, value);
                }, item);
            });

            return out;
        };

        DynamicIndexMapper.prototype.seedValue = function () {
            return [];
        };
    };

    module.exports = DynamicIndexMapper;
})();