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

function unflatten(source, out) {
    for (var k in source) {
        var split = k.split(seperator);

        if (split.length > 1) {
            var collector = out[split[0]] == undefined ? out[split[0]] = {} :
                out[split[0]];


            for (var i = 1; i < split.length; i++) {
                collector[split[i]] = source[k];
            }

        } else {
            out[k] = source[k];
        }

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
        unflatten(obj, out);
        return out;
    }
};
