module.exports = scrubber;

/**
 * Creates scrub function
 * @return {Object} The options, including local and remote origins
 */
function scrubber(source, target) {
	return function scrub(string) {
		string = string.replace(new RegExp(escape(source), 'g'), target);
		if (canShorten(source) && canShorten(target)) {
			string = string.replace(new RegExp(escape(shorten(source)), 'g'), shorten(target));
		}
		return string;
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