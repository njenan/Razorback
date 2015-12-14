(function () {
    var Functions = require('./Functions'),
        fieldmap = Functions.fieldmap,
        DynamicIndexMapper = require('./DynamicIndexMapper'),
        FixedIndexMapper = require('./FixedIndexMapper');


    var Razorback = function (params) {
        var seperator = '_';
        var defaultToCustomMappings = {};
        var customToDefaultMappings = {};
        var useDynamicIndex = false;
        var dynamicIndexMapper;
        var fixedIndexMapper;


        if (!params) {
            params = {}
        }

        if (params.mappings) {
            params.mappings.map(function (mapping) {
                defaultToCustomMappings[mapping.from] = mapping.to;
                customToDefaultMappings[mapping.to] = mapping.from;
            });
        }

        useDynamicIndex = params.useDynamicArrays;

        if (params.seperator) {
            seperator = params.seperator
        } else {
            seperator = '_';
        }

        dynamicIndexMapper = new DynamicIndexMapper(seperator);
        fixedIndexMapper = new FixedIndexMapper(seperator);

        Razorback.prototype.denormalize = function (obj) {
            var mapper;
            var out;
            if (useDynamicIndex) {
                out = [];
                mapper = dynamicIndexMapper;
            } else {
                out = {};
                mapper = fixedIndexMapper;
            }

            mapper.flatten(obj, out, '');

            applyCustomMappingsToFlatObject(out, defaultToCustomMappings);
            return out;
        };

        Razorback.prototype.normalize = function (obj) {
            applyCustomMappingsToFlatObject(obj, customToDefaultMappings);

            var mapper;
            if (obj.constructor === Array) {
                mapper = dynamicIndexMapper;
            } else {
                mapper = fixedIndexMapper;
            }

            return mapper.unflatten(obj);
        };

        function applyCustomMappingsToFlatObject(obj, mappings) {
            fieldmap(function (source, k) {
                if (mappings[k]) {
                    var temp = source;
                    delete source;
                    obj[mappings[k]] = temp;
                }
            }, obj);
        }

    };

    module.exports = Razorback;

})();
