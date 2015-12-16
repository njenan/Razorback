var Path = require('../lib/Path'),
    assert = require('assert');

describe('Path', function () {
    it('should return an empty string when no steps are added', function () {
        var path = new Path('_');

        assert.equal('', path.toFlatPath());
    });

    it('should return only the key when only 1 step is added', function () {
        var path = new Path('_');

        assert.equal('key', path.append('key').toFlatPath());
    });

    it('should seperate multiple keys by the seperator', function () {
        var step1 = new Path('_');
        var step2 = step1.append('a');
        var step3 = step2.append('b');

        assert.equal('a_b', step3.toFlatPath());
    });

    it('should be immutable', function () {
        var path1 = new Path('_');

        var path2 = path1.append('a');
        var path3 = path1.append('b');

        assert.equal('', path1.toFlatPath());
        assert.equal('a', path2.toFlatPath());
        assert.equal('b', path3.toFlatPath());
    });

    it('should match an equivelent jpath', function () {
        var path = new Path('_').append('a').append('b');

        assert.equal(true, path.matchesJPath('a.b'));
    });
});