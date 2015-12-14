# Razorback
### A js library for normalization/denormalization of objects.

[![Build Status](https://travis-ci.org/njenan/Razorback.svg?branch=master)](https://travis-ci.org/njenan/Razorback)

Razorback is designed to allow easier denormalization of objects prior to persisting in flat sql tables, as well as normalizing the objects upon retrieval.

	var razorback = new Razorback();
	
	var obj = {
		a: 'first',
		b: {
			c: 'second'
		}
	};
	
	razorback.denormalize(obj);
	
	//produces:
	//
	//{
	//	a: 'first',
	//	b_c: 'second'
	//}
	

Razorback supports fixed index arrays, where numbered indexes store arrays:

	var razorback = new Razorback();
	
	var obj = {
		a: 'first',
		b: [
			'second',
			'third'
		]
	};
	
	razorback.denormalize(obj);
	
	//produces:
	//
	//{
	//	a: 'first',
	//	b_0: 'second',
	//	b_1: 'third'
	//}
	
Or dynamic indexes, where arrays are represented by arrays of flat objects:

	var actual = new Razorback({useDynamicArrays: true})
		.denormalize({
			a: 'top',
            b: [
            	{
                	c: 'alpha',
                    d: [
                    	'first',
                        'second'
                    ]
                }, {
                	c: 'beta',
                    d: [
                    	'fourth',
                        'fifth'
                    ]
                }
            ]
        });
        
    //produces:
    
    //[
    //	{
    //  	a: 'top',
    //      b_c: 'alpha',
    //      b_d: 'first'
    //   },
    //	 {
    //   	a: 'top',
    //      b_c: 'alpha',
    //      b_d: 'second'
    //   },
    //   {
    //      a: 'top',
    //      b_c: 'beta',
    //      b_d: 'fourth'
    //   },
    //   {
    //      a: 'top',
    //      b_c: 'beta',
    //      b_d: 'fifth'
    //   }
    //];

Custom seperators can be used instead of the default underscore '_' character if this conflicts with existing field names on objects.

	var razorback = new Razorback({
		seperator : '&'
		});
		
	razorback.denormalize({
		a: 'first',
		b: {
			c: 'second',
			d: 'third'
		}
	});
	
	//produces:
	//
	//{
	//	a: 'first',
	//	b&c: 'second',
	//	b&d: 'third'
	//}
	
	
Custom mappings between the default (ugly) fields that norm generates can also be provided.

	var razorback = new Razorback({
		mappings: [
			{
				from: 'a_b',
				to: 'customField'
			}
		]
	});
	
	razorback.denormalize({
		a: {
			b: 'first'
		}
	});
	
	//produces:
	//
	//{
	//	customField: 'first'
	//}
