var should = require('should');

var scrubber = require('./scrubber');

describe('scrubber', function() {

	it('should be defined', function() {
		should(scrubber).be.ok;
	});

	describe('when source and target are non-secure', function() {

		describe('scrub', function() {

			var source, target, scrub;

			beforeEach(function() {
				source = 'http://proxy.local';
				target = 'http://base.com';
				scrub = scrubber(source, target);
			});

			it('should replace source with target', function() {
				var input = 'http://proxy.local';
				var actual = scrub(input);
				should(actual).eql('http://base.com');
			});

			it('should replace source substring with target', function() {
				should(scrub('http://proxy.local/path')).eql('http://base.com/path');
			});

			it('should replace multiple instances of source with target', function() {
				var input = 'address=http://proxy.local/, rewrite=http://proxy.local/ctx';
				var expected = 'address=http://base.com/, rewrite=http://base.com/ctx';
				should(scrub(input)).eql(expected);
			});

			it('should replace instances of source without protocol', function() {
				should(scrub('proxy.local')).eql('base.com');
			});

			it('should replace substring instances of source without protocol', function() {
				should(scrub('proxy.local/')).eql('base.com/');
			});

			describe('when input resembles pattern', function() {

				var input;

				beforeEach(function() {
					input = 'http://proxy_local';
					should(new RegExp(source).test(input)).be.ok;
				});


				it('should not replace resemblance', function() {
					should(scrub(input)).eql(input);
				});

			});

		});

	});

	describe('when source is secure and target is non-secure', function() {

		var source, target, scrub;

		beforeEach(function() {
			source = 'https://proxy.local';
			target = 'http://base.com';
			scrub = scrubber(source, target);
		});

		it('should not replace substring instances of source without protocol', function() {
			should(scrub('proxy.local/')).eql('proxy.local/');
		});

	});

});