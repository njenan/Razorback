(function () {
    module.exports = {
        fieldmap: function (func, obj) {
            for (var k in obj) {
                func(obj[k], k);
            }
        }
    };
})();