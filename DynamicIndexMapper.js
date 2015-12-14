(function () {
    var fieldmap = require('./Functions').fieldmap;

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


    function iterateThroughKeys(source, out, path) {
        var wasPopped = false;
        fieldmap(function (current, key) {
            var currentPath = constructCurrentPath(path, seperator, key);

            if (isArray(current)) {
                var isDeep = false;
                var element = current.shift();

                if (isObject(element)) {
                    wasPopped = iterateThroughKeys(element, out,
                        currentPath);
                    isDeep = wasPopped;
                } else {
                    out[currentPath] = element;
                }

                if (current.length > 0) {
                    wasPopped = true;
                }

                if (isDeep) {
                    current.unshift(element);
                }
            } else if (isObject(current)) {
                wasPopped = iterateThroughKeys(current, out, currentPath);
            } else {
                out[currentPath] = current;
            }
        }, source);

        return wasPopped;
    }

    function isObject(obj) {
        return typeof obj === 'object';
    }

    function isArray(array) {
        return array.constructor === Array;
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


    var seperator;


    var DynamicIndexMapper = function (_seperator) {
        seperator = _seperator;
    };

    DynamicIndexMapper.prototype.flatten = function (source, out) {

        var arraysHaveRemainingElements = true;

        while (arraysHaveRemainingElements) {
            var temp = {};
            out.push(temp);
            arraysHaveRemainingElements =
                iterateThroughKeys(source, temp, '');
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

    module.exports = DynamicIndexMapper;
})
();