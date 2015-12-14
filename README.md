# D'Norm
## /dɪˈnɔrm/
### A js library for normalization/denormalization of objects.

[![Build Status](https://travis-ci.org/njenan/NormalizeDenormalize.svg?branch=master)](https://travis-ci.org/njenan/NormalizeDenormalize)

D'Norm is designed to allow easier denormalization of objects prior to persisting in flat sql tables, as well as normalizing the objects upon retrieval.

	var dnorm = new DNorm();
	
	var obj = {
		a: 'first',
		b: {
			c: 'second'
		}
	};
	
	dnorm.denormalize(obj);
	
	//produces:
	//
	//{
	//	a: 'first',
	//	b_c: 'second'
	//}
	

Currently, only fixed index arrays (those that always have a set number of items) are supported.

	var dnorm = new DNorm();
	
	var obj = {
		a: 'first',
		b: [
			'second',
			'third'
		]
	};
	
	dnorm.denormalize(obj);
	
	//produces:
	//
	//{
	//	a: 'first',
	//	b_0: 'second',
	//	b_1: 'third'
	//}
	

Custom seperators can be used instead of the default underscore '_' character if this conflicts with existing field names on objects.

	var dnorm = new DNorm({
		seperator : '&'
		});
		
	dnorm.denormalize({
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

	var dnorm = new DNorm({
		mappings: [
			{
				from: 'a_b',
				to: 'customField'
			}
		]
	});
	
	dnorm.denormalize({
		a: {
			b: 'first'
		}
	});
	
	//produces:
	//
	//{
	//	customField: 'first'
	//}
