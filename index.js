var seperator = '_';

function enflatten(source, out, path) {
    for (var k in source) {
        if (typeof source[k] !== 'object') {
            out[path === '' ? k : path + seperator + k] = source[k];
        } else {
            enflatten(source[k], out, path === '' ? k : path + seperator + k);
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
        var out = {}
        enflatten(obj, out, '');
        return out;
    },
    normalize: function (obj) {
        var out = {};

        for (var k in obj) {
            var split = k.split(seperator);

            if (split.length > 1) {
                unflatten(obj[k], out, split);
            } else {
                out[k] = obj[k];
            }
        }

        return out;
    }
};