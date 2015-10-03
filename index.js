(function () {

    var seperator = '_';

    function flatten(source, out, path) {
        for (var k in source) {
            if (typeof source[k] !== 'object') {
                out[path === '' ? k : path + seperator + k] = source[k];
            } else {
                flatten(source[k], out, path === '' ? k : path + seperator + k);
            }
        }
    }

    function unflatten(value, out, path) {
        var current = path.shift();

        if (out[current] === undefined) {
            if (path.length === 0) {
                out[current] = value;
            } else {
                out[current] = {};
                unflatten(value, out[current], path);
            }
        } else {
            unflatten(value, out[current], path);
        }
    }


    module.exports = {
        denormalize: function (obj) {
            var out = [{}];
            flatten(obj, out[0], '');
            return out;å
        },
        normalize: function (obj) {
            var out = {};

            for (var k in obj) {
                var split = k.split(seperator);
                unflatten(obj[k], out, split);
            }

            return out;
        }
    };
})();
