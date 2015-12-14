(function () {
    module.exports = {
        fieldmap: function (func, obj) {
            for (var k in obj) {
                func(obj[k], k);
            }
        },
        isObject: function (obj) {
            return typeof obj === 'object';
        },
        isArray: function (array) {
            return array.constructor === Array;
        }
    };
})();