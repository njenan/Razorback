var assert = require('assert');

var normalizer = require('../index');


describe('Object Normalizer/Denormalizer', function () {

    describe('denormalize', function () {
        it('should collapse a simple object to itself', function () {
            var obj = {
                a: 'first',
                b: 'second'
            };

            var actual = normalizer.denormalize(obj)[0];

            assert.equal(obj.a, actual.a);
            assert.equal(obj.b, actual.b);
        });

        it('should turn a object with 2 levels into a 1 level', function () {
            var obj = {
                a: 'first',
                b: {
                    c1: 'second',
                    c2: 'third'
                }
            };

            var expected = {
                a: 'first',
                b_c1: 'second',
                b_c2: 'third'
            };

            var actual = normalizer.denormalize(obj)[0];

            assert.equal(expected.a, actual.a);
            assert.equal(expected.b_c1, actual.b_c1);
            assert.equal(expected.b_c2, actual.b_c2);

        });

        it('should turn a object with 4 levels into a 1 level', function () {
            var obj = {
                a: 'first',
                b: {
                    c1: 'second',
                    c2: {
                        d1: {
                            e1: 'third'
                        }
                    },
                    c3: 'fourth'
                }
            };

            var expected = {
                a: 'first',
                b_c1: 'second',
                b_c2_d1_e1: 'third',
                b_c3: 'fourth'
            };

            var actual = normalizer.denormalize(obj)[0];

            assert.equal(expected.a, actual.a);
            assert.equal(expected.b_c1, actual.b_c1);
            assert.equal(expected.b_c2_d1_e1, actual.b_c2_d1_e1);
            assert.equal(expected.b_c3, actual.b_c3);
        });

        it('should turn an object with an array into an array of flat objects',
            function () {
                var obj = {
                    a: 'first',
                    b: [
                        '1',
                        '2',
                        '3'
                    ]
                };

                var expected = [
                    {
                        a: 'first',
                        b: '1'
                    },
                    {
                        a: 'first',
                        b: '2'
                    },
                    {
                        a: 'first',
                        b: '3'
                    }
                ];

                var actual = normalizer.denormalize(obj)[0];

                assert.equal(expected[0].a, actual[0].a);
                assert.equal(expected[0].b, actual[0].b);
                assert.equal(expected[1].a, actual[1].a);
                assert.equal(expected[1].b, actual[1].b);
                assert.equal(expected[2].a, actual[2].a);
                assert.equal(expected[2].b, actual[2].b);
            });

    });

    describe('normalize', function () {
        it('should transform a flat object into itself', function () {
            var obj = {
                a: 'first',
                b: 'second'
            };

            var actual = normalizer.normalize(obj);

            assert.equal(obj.a, actual.a);
            assert.equal(obj.b, actual.b);
        });

        it('should transform a flat object into a 2 level object', function () {
            var obj = {
                a: 'zeroth',
                b_c: 'first',
                b_d: 'second'
            };

            var expected = {
                a: 'zeroth',
                b: {
                    c: 'first',
                    d: 'second'
                }
            };

            var actual = normalizer.normalize(obj);

            assert.equal(expected.a, actual.a);
            assert.equal(expected.b.c, actual.b.c);
            assert.equal(expected.b.d, actual.b.d);
        });

        it('should transform a flat object into a 4 level object', function () {
            var obj = {
                a_b: 'zeroth',
                a_c_e: 'first',
                a_c_f_g: 'first and a half',
                d: 'second'
            };

            var expected = {
                a: {
                    b: 'zeroth',
                    c: {
                        e: 'first',
                        f: {
                            g: 'first and a half'
                        }
                    }
                },
                d: 'second'
            };


            var actual = normalizer.normalize(obj);

            assert.equal(expected.a.b, actual.a.b);
            assert.equal(expected.a.c.e, actual.a.c.e);
            assert.equal(expected.a.c.f.g, actual.a.c.f.g);
            assert.equal(expected.d, actual.d);
        });
    });
});
