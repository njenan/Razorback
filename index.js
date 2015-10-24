(function () {
    function constructCurrentPath(path, seperator, k, source) {
        var currentPath;

        if (path === '') {
            if (source[k].isArray) {
                currentPath = path;
            } else {
                currentPath = k;
            }
        } else {
            if (source[k].isArray) {
                currentPath = path;
            } else {
                currentPath = path + seperator + k;
            }
        }

        return currentPath;
    }

    function extractValue(source, k) {
        var value;

        if (source[k].isArray) {
            value = source[k].shift();
        } else {
            value = source[k];
        }

        return value;
    }

    var seperator = '_';

    function flatten(source, out, fullPath) {
        for (var k in source) {
            if (typeof source[k] !== 'object') {
                var value = extractValue(source, k);
                var path = constructCurrentPath(fullPath, seperator, k, source);

                out[path] = value;
            } else {
                var path = constructCurrentPath(fullPath, seperator, k, source);
                flatten(source[k], out, path);
            }
        }
    }


    function unflatten(out) {
        var obj = {};

        for (var k in out) {
            var split = k.split(seperator);

            if (split.length > 1) {
                var current = obj;
                for (var i = 1; i < split.length; i++) {
                    current[split[i - 1]] =
                        current[split[i - 1]] ? current[split[i - 1]] : {};

                    if (i + 1 === split.length) {
                        current[split[i - 1]][split[i]] = out[k]
                    } else {
                        current = current[split[i - 1]];
                    }
                }
            } else {
                obj[k] = out[k];
            }


        }

        return obj;
    }


    module.exports = {
        denormalize: function (obj) {
            var out = [{}];
            flatten(obj, out[0], '');
            return out;
        },
        normalize: function (obj) {
            return unflatten(obj);
        }
    };
}());
