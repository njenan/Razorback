(function () {
    var fieldmap = require('../Functions').fieldmap;


    function constructCurrentPath(path, seperator, k) {
        var currentPath;

        if (path === '') {
            currentPath = k;
        } else {
            currentPath = path + seperator + k;
        }

        return currentPath;
    }


    var FixedIndexMapper = function (_seperator) {
        var seperator = _seperator;


        FixedIndexMapper.prototype.flatten = function (source, out, fullPath) {
            for (var k in source) {
                if (typeof source[k] !== 'object') {
                    var value = source[k];
                    var path = constructCurrentPath(fullPath, seperator, k,
                        source);

                    out[path] = value;
                } else {
                    var path = constructCurrentPath(fullPath, seperator, k,
                        source);
                    this.flatten(source[k], out, path);
                }
            }
        };

        FixedIndexMapper.prototype.unflatten = function (source) {
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

        FixedIndexMapper.prototype.seedValue = function () {
            return {};
        };
    };

    module.exports = FixedIndexMapper;
})();