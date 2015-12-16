var assert = require('assert');

var Razorback = require('../index');


describe('Razorback', function () {

    describe('fixed index mapping', function () {
        describe('denormalize feature', function () {
            it('should collapse a simple object to itself', function () {
                var obj = {
                    a: 'first',
                    b: 'second'
                };

                var actual = new Razorback({
                    useMapper: 'fixedIndex'
                }).denormalize(obj);

                assert.equal(obj.a, actual.a);
                assert.equal(obj.b, actual.b);
            });

            it('should turn a object with 2 levels into a 1 level',
                function () {
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

                    var actual = new Razorback({
                        useMapper: 'fixedIndex'
                    }).denormalize(obj);

                    assert.equal(expected.a, actual.a);
                    assert.equal(expected.b_c1, actual.b_c1);
                    assert.equal(expected.b_c2, actual.b_c2);

                });

            it('should turn a object with 4 levels into a 1 level',
                function () {
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

                    var actual = new Razorback({
                        useMapper: 'fixedIndex'
                    }).denormalize(obj);

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

                    var expected = {
                        a: 'first',
                        b_0: '1',
                        b_1: '2',
                        b_2: '3'
                    };

                    var actual = new Razorback({
                        useMapper: 'fixedIndex'
                    }).denormalize(obj);

                    assert.equal(expected.a, actual.a);
                    assert.equal(expected.b_0, actual.b_0);
                    assert.equal(expected.b_1, actual.b_1);
                    assert.equal(expected.b_2, actual.b_2);
                });

            it('should flatten the objects within arrays', function () {
                var obj = {
                    a: 'first',
                    b: [
                        {
                            c: 'second',
                            d: 'third'
                        },
                        {
                            c: 'fourth',
                            d: 'fifth'
                        }
                    ]
                };

                var expected = {
                    a: 'first',
                    b_0_c: 'second',
                    b_0_d: 'third',
                    b_1_c: 'fourth',
                    b_1_d: 'fifth'
                };

                var actual = new Razorback({
                    useMapper: 'fixedIndex'
                }).denormalize(obj);

                assert.equal(expected.a, actual.a);
                assert.equal(expected.b_0_c, actual.b_0_c);
                assert.equal(expected.b_0_d, actual.b_0_d);
                assert.equal(expected.b_1_c, actual.b_1_c);
                assert.equal(expected.b_1_d, actual.b_1_d);
            });


            it('should flatten the objects within arrays within arrays',
                function () {
                    var obj = {
                        a: 'first',
                        b: [
                            {
                                c: 'second',
                                d: [
                                    'third',
                                    'fourth'
                                ]
                            },
                            {
                                c: 'fifth',
                                d: [
                                    'sixth',
                                    'seventh'
                                ]
                            }
                        ]
                    };

                    var expected = {
                        a: 'first',
                        b_0_c: 'second',
                        b_0_d_0: 'third',
                        b_0_d_1: 'fourth',
                        b_1_c: 'fifth',
                        b_1_d_0: 'sixth',
                        b_1_d_1: 'seventh'
                    };

                    var actual = new Razorback({
                        useMapper: 'fixedIndex'
                    }).denormalize(obj);

                    assert.equal(expected.a, actual.a);
                    assert.equal(expected.b_0_c, actual.b_0_c);
                    assert.equal(expected.b_0_d_0, actual.b_0_d_0);
                    assert.equal(expected.b_0_d_1, actual.b_0_d_1);
                    assert.equal(expected.b_1_c, actual.b_1_c);
                    assert.equal(expected.b_1_d_0, actual.b_1_d_0);
                    assert.equal(expected.b_1_d_1, actual.b_1_d_1);
                });


            it('should allow custom seperators', function () {
                var obj = {
                    a: {
                        b: 'first'
                    }
                };

                var expected = {
                    'a&b': 'first'
                };

                var actual = new Razorback({
                        useMapper: 'fixedIndex',
                        seperator: '&'
                    }
                ).denormalize(obj);

                assert.equal(expected['a&b'], actual['a&b']);
            });

        });

        describe('normalize feature', function () {
            it('should transform a flat object into itself', function () {
                var obj = {
                    a: 'first',
                    b: 'second'
                };

                var actual = new Razorback({
                    useMapper: 'fixedIndex'
                }).normalize(obj);

                assert.equal(obj.a, actual.a);
                assert.equal(obj.b, actual.b);
            });

            it('should transform a flat object into a 2 level object',
                function () {
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

                    var actual = new Razorback({
                        useMapper: 'fixedIndex'
                    }).normalize(obj);

                    assert.equal(expected.a, actual.a);
                    assert.equal(expected.b.c, actual.b.c);
                    assert.equal(expected.b.d, actual.b.d);
                });

            it('should transform a flat object into a 4 level object',
                function () {
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


                    var actual = new Razorback({
                        useMapper: 'fixedIndex'
                    }).normalize(obj);

                    assert.equal(expected.a.b, actual.a.b);
                    assert.equal(expected.a.c.e, actual.a.c.e);
                    assert.equal(expected.a.c.f.g, actual.a.c.f.g);
                    assert.equal(expected.d, actual.d);
                });

            it('should transform index objects back into arrays', function () {
                var obj = {
                    a: 'first',
                    b_0: 'second',
                    b_1: 'third'
                };


                var expected = {
                    a: 'first',
                    b: [
                        'second',
                        'third'
                    ]
                };

                var actual = new Razorback({
                    useMapper: 'fixedIndex'
                }).normalize(obj);

                assert.equal(expected.a, actual.a);
                assert.equal(expected.b[0], actual.b[0]);
                assert.equal(expected.b[1], actual.b[1]);
                assert.equal(true, expected.b.constructor === Array);
                assert.equal(true, actual.b.constructor === Array);
            });
        });
    });

    describe('custom mappings', function () {
        it('should allow custom mappings to flat objects', function () {
            var obj = {
                a: {
                    b: 'first'
                }
            };

            var expected = {
                custom: 'first'
            };

            var actual = new Razorback({
                useMapper: 'fixedIndex',
                mappings: [
                    {
                        from: 'a_b',
                        to: 'custom'
                    }
                ]
            }).denormalize(obj);

            assert.equal(expected['custom'], actual['custom']);
        });

        it('should allow custom mappings to normalized objects', function () {
            var expected = {
                a: {
                    b: 'first'
                }
            };

            var obj = {
                custom: 'first'
            };

            var actual = new Razorback({
                useMapper: 'fixedIndex',
                mappings: [
                    {
                        from: 'a_b',
                        to: 'custom'
                    }
                ]
            }).normalize(obj);

            assert.equal(expected.a.b, actual.a.b);
        });
    });

    describe('advanced array mappings', function () {
        it('should map objects with arrays to arrays of flat objects',
            function () {
                var expected = [
                    {
                        a: 'first',
                        b: 'array1'
                    },
                    {
                        a: 'first',
                        b: 'array2'
                    },
                    {
                        a: 'first',
                        b: 'array3'
                    }
                ];

                var actual = new Razorback().denormalize({
                    a: 'first',
                    b: [
                        'array1',
                        'array2',
                        'array3'
                    ]
                });

                assert.equal(3, actual.length);
                assert.equal(expected[0].a, actual[0].a);
                assert.equal(expected[0].b, actual[0].b);
                assert.equal(expected[1].a, actual[1].a);
                assert.equal(expected[1].b, actual[1].b);
                assert.equal(expected[2].a, actual[2].a);
                assert.equal(expected[2].b, actual[2].b);
            });


        it('should map arrays of flat objects to normalized objects',
            function () {
                var expected = {
                    a: 'first',
                    b: [
                        'array1',
                        'array2',
                        'array3'
                    ]
                };

                var actual = new Razorback().normalize([
                    {
                        a: 'first',
                        b: 'array1'
                    },
                    {
                        a: 'first',
                        b: 'array2'
                    },
                    {
                        a: 'first',
                        b: 'array3'
                    }
                ]);


                assert.equal(3, actual.b.length);
                assert.equal(expected.a, actual.a);
                assert.equal(expected.b[0], actual.b[0]);
                assert.equal(expected.b[1], actual.b[1]);
                assert.equal(expected.b[2], actual.b[2]);
            });


        it('should map arrays of flat objects to normalized objects with ' +
            'multiple levels', function () {
            var expected = {
                a: {
                    b: 'first'
                },
                c: [
                    'array1',
                    'array2',
                    'array3'
                ]
            };

            var actual = new Razorback().normalize([
                {
                    a_b: 'first',
                    c: 'array1'
                },
                {
                    a_b: 'first',
                    c: 'array2'
                },
                {
                    a_b: 'first',
                    c: 'array3'
                }
            ]);

            assert.equal(3, actual.c.length);
            assert.equal(expected.a.b, actual.a.b);
            assert.equal(expected.c[0], actual.c[0]);
            assert.equal(expected.c[1], actual.c[1]);
            assert.equal(expected.c[2], actual.c[2]);
        });


        it('should map arrays of flat objects to normalized objects with ' +
            'multiple levels', function () {
            var expected = {
                a: {
                    b: 'first'
                },
                c: [
                    'array1',
                    'array2',
                    'array3'
                ]
            };

            var actual = new Razorback().normalize([
                {
                    a_b: 'first',
                    c: 'array1'
                },
                {
                    a_b: 'first',
                    c: 'array2'
                },
                {
                    a_b: 'first',
                    c: 'array3'
                }
            ]);

            assert.equal(expected.a.b, actual.a.b);
            assert.equal(expected.c[0], actual.c[0]);
            assert.equal(expected.c[1], actual.c[1]);
            assert.equal(expected.c[2], actual.c[2]);
        });


        it('should denormalize deep objects with multiple arrays', function () {
            var actual = new Razorback().denormalize({
                a: 'top',
                b: [
                    {
                        c: 'alpha',
                        d: [
                            'first',
                            'second',
                            'third'
                        ]
                    }, {
                        c: 'beta',
                        d: [
                            'fourth',
                            'fifth',
                            'sixth'
                        ]
                    }
                ]
            });

            var expected = [
                {
                    a: 'top',
                    b_c: 'alpha',
                    b_d: 'first'
                },
                {
                    a: 'top',
                    b_c: 'alpha',
                    b_d: 'second'
                },
                {
                    a: 'top',
                    b_c: 'alpha',
                    b_d: 'third'
                },
                {
                    a: 'top',
                    b_c: 'beta',
                    b_d: 'fourth'
                },
                {
                    a: 'top',
                    b_c: 'beta',
                    b_d: 'fifth'
                },
                {
                    a: 'top',
                    b_c: 'beta',
                    b_d: 'sixth'
                }
            ];

            assert.equal(6, actual.length);

            for (var i = 0; i < expected.length; i++) {
                assert.equal(expected[i].a, actual[i].a);
                assert.equal(expected[i].b_c, actual[i].b_c);
                assert.equal(expected[i].b_d, actual[i].b_d);
            }
        });

        it('should handle objects without arrays', function () {
            var actual = new Razorback().denormalize({
                a: {
                    b: 'first',
                    c: 'second'
                }
            });

            var expected = [
                {
                    a_b: 'first',
                    a_c: 'second'
                }
            ];

            assert.equal(1, actual.length);
            assert.equal(expected[0].a_b, actual[0].a_b);
            assert.equal(expected[0].a_c, actual[0].a_c);
        });
    });

    describe('Exclusions', function () {
        it('should allow specific arrays to be excluded from dynamic index mapping',
            function () {
                var actual = new Razorback({
                    exclusions: [
                        'b'
                    ]
                }).denormalize({
                        a: [
                            'first',
                            'second'
                        ],
                        b: [
                            'third',
                            'fourth'
                        ]
                    });

                var expected = [
                    {
                        a: 'first',
                        b: [
                            'third',
                            'fourth'
                        ]
                    },
                    {
                        a: 'second',
                        b: [
                            'third',
                            'fourth'
                        ]
                    }
                ];

                assert.equal(expected[0].a, actual[0].a);
                assert.equal(expected[1].a, actual[1].a);

                assert.equal(expected[0].b[0], actual[0].b[0]);
                assert.equal(expected[0].b[1], actual[0].b[1]);

                assert.equal(expected[1].b[0], actual[1].b[0]);
                assert.equal(expected[1].b[1], actual[1].b[1]);
            });
    });
});
