var url = require('url');

module.exports = scrubber;

/**
 * Creates scrub function
 * @return {Object} The options, including local and remote origins
 */
function scrubber(source, target) {
	source = sanitize(source);
	target = sanitize(target);
	return function scrub(string) {
		var fix = fixer(source, target);
		string = fix(string);
		if (canShorten(source)) {
			var replacement = canShorten(target) ? shorten(target) : target;
			var shortFix = fixer(shorten(source), replacement);
			string = shortFix(string);
		}
		return string;
	};
}

function fixer(origin1, origin2) {
	return function fix(value) {
		var patternString = '\\b' + escape(origin1) + '\\b';
		value = value.replace(new RegExp(patternString + '$', 'g'), origin2);
		value = value.replace(new RegExp(patternString + '/', 'g'), origin2 + '/');
		return value;
	};
}

function escape(s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var shortPattern = /^http:\/\//;

function canShorten(s) {
	return shortPattern.test(s);
}

function shorten(s) {
	return s.replace(shortPattern, '');
}

function sanitize(value) {
	if (!/^https?:\/\//.test(value)) {
		value = 'http://' + value;
	}
	var p = url.parse(value);
	return url.format({
		protocol: p.protocol,
		host: p.host
	});
}