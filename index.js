(function () {
    var Functions = require('./lib/Functions'),
        fieldmap = Functions.fieldmap,
        DynamicIndexMapper = require('./lib/mappers/DynamicIndexMapper'),
        FixedIndexMapper = require('./lib/mappers/FixedIndexMapper');


    var Razorback = function (params) {
        var seperator = '_';
        var defaultToCustomMappings = {};
        var customToDefaultMappings = {};
        var mappers;
        var mapperType;
        var exclusions;

        function applyCustomMappingsToFlatObject(obj, mappings) {
            fieldmap(function (source, k) {
                if (mappings[k]) {
                    var temp = source;
                    delete source;
                    obj[mappings[k]] = temp;
                }
            }, obj);
        }


        if (!params) {
            params = {}
        }

        if (params.mappings) {
            params.mappings.map(function (mapping) {
                defaultToCustomMappings[mapping.from] = mapping.to;
                customToDefaultMappings[mapping.to] = mapping.from;
            });
        }

        if (params.exclusions) {
            exclusions = params.exclusions;
        }

        mapperType = params.useMapper ? params.useMapper : 'dynamicIndex';

        if (params.seperator) {
            seperator = params.seperator
        } else {
            seperator = '_';
        }

        mappers = {
            dynamicIndex: new DynamicIndexMapper(seperator, exclusions),
            fixedIndex: new FixedIndexMapper(seperator)
        };

        Razorback.prototype.denormalize = function (obj) {
            var mapper = mappers[mapperType];
            var out = mapper.seedValue();

            mapper.flatten(obj, out, '');

            applyCustomMappingsToFlatObject(out, defaultToCustomMappings);
            return out;
        };

        Razorback.prototype.normalize = function (obj) {
            applyCustomMappingsToFlatObject(obj, customToDefaultMappings);

            var mapper = mappers[mapperType];
            return mapper.unflatten(obj);
        };

    };

    module.exports = Razorback;

})();
