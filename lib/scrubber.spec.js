var should = require('should');

var scrubber = require('./scrubber');

describe('scrubber', function() {

	it('should be defined', function() {
		should(scrubber).be.ok;
	});

	describe('when source and target are non-secure', function() {

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

		it('should not replace source not following word boundary', function() {
			should(scrub('sproxy.local')).eql('sproxy.local');
		});

		it('should not replace source not preceding word boundary', function() {
			should(scrub('proxy.locally')).eql('proxy.locally');
		});

		it('should not replace shortened source with different port', function() {
			should(scrub('proxy.local:5000')).eql('proxy.local:5000');
		});

		it('should not replace full source with different port', function() {
			should(scrub('http://proxy.local:3000/')).eql('http://proxy.local:3000/');
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

	describe('when source is without protocol and target is secure', function() {

		var source, target, scrub;

		beforeEach(function() {
			source = 'proxy.local';
			target = 'https://base.com';
			scrub = scrubber(source, target);
		});

		it('should replace source with protocol', function() {
			should(scrub('http://proxy.local')).eql('https://base.com');
		});

		it('should replace source with protocol plus path', function() {
			should(scrub('http://proxy.local/path')).eql('https://base.com/path');
		});

		it('should replace source without protocol', function() {
			should(scrub('proxy.local')).eql('https://base.com');
		});

		it('should replace source without protocol plus path', function() {
			should(scrub('proxy.local/path')).eql('https://base.com/path');
		});

		it('should not replace source without protocol embedded in word', function() {
			should(scrub('sproxy.local')).eql('sproxy.local');
		});

	});

	describe('when source is secure and target is without protocol', function() {

		var source, target, scrub;

		beforeEach(function() {
			source = 'https://proxy.local';
			target = 'base.com';
			scrub = scrubber(source, target);
		});

		it('should replace source with unshortened target', function() {
			should(scrub('https://proxy.local')).eql('http://base.com');
		});

		it('should replace source plus path with unshortened target plus path', function() {
			should(scrub('https://proxy.local/mon')).eql('http://base.com/mon');
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

		it('should not replace substring instance of non-secure equivalent of source', function() {
			should(scrub('http://proxy.local')).eql('http://proxy.local');
		});

	});

	describe('when source and target are without protocol', function() {

		var source, target, scrub;

		beforeEach(function() {
			source = 'proxy.local';
			target = 'base.com';
			scrub = scrubber(source, target);
		});

		it('should replace source without protocol', function() {
			should(scrub('proxy.local')).eql('base.com');
		});

		it('should replace source with protocol', function() {
			should(scrub('http://proxy.local')).eql('http://base.com');
		});

	});

	describe('when source has trailing slash', function() {

		var source, target, scrub;

		beforeEach(function() {
			source = 'http://proxy.local/';
			target = 'http://base.com';
			scrub = scrubber(source, target);
		});

		it('should replace source without trailing slash', function() {
			should(scrub('http://proxy.local')).eql('http://base.com');
		});

	});

	describe('when target has trailing slash', function() {

		var source, target, scrub;

		beforeEach(function() {
			source = 'http://proxy.local';
			target = 'http://base.com/';
			scrub = scrubber(source, target);
		});

		it('should replace source without trailing slash', function() {
			should(scrub('http://proxy.local')).eql('http://base.com');
		});

	});

	describe('when source has protocol and port', function() {

		var source, target, scrub;

		beforeEach(function() {
			source = 'http://proxy.local:5000';
			target = 'http://base.com';
			scrub = scrubber(source, target);
		});

		it('should replace source', function() {
			should(scrub('http://proxy.local:5000')).eql('http://base.com');
		});

		it('should replace source before path', function() {
			should(scrub('http://proxy.local:5000/pq')).eql('http://base.com/pq');
		});

		it('should not replace source without port', function() {
			should(scrub('http://proxy.local')).eql('http://proxy.local');
		});

		it('should replace source without protocol', function() {
			should(scrub('proxy.local:5000')).eql('base.com');
		});

	});

	describe('when source has port but no protocol', function() {

		var source, target, scrub;

		beforeEach(function() {
			source = 'proxy.local:5000';
			target = 'http://base.com';
			scrub = scrubber(source, target);
		});

		it('should replace source', function() {
			should(scrub('http://proxy.local:5000')).eql('http://base.com');
		});

		it('should replace source before path', function() {
			should(scrub('http://proxy.local:5000/pq')).eql('http://base.com/pq');
		});

		it('should not replace source without port', function() {
			should(scrub('http://proxy.local')).eql('http://proxy.local');
		});

		it('should replace source without protocol', function() {
			should(scrub('proxy.local:5000')).eql('base.com');
		});

	});

});