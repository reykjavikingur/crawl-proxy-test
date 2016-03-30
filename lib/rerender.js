var _ = require('underscore');
var harmon = require('harmon');

// re-rendering middleware

module.exports = rerender;

/**
 * Generates middleware that transforms HTML
 * @param rules Array of Object with `filter` and `parse`
 * where `filter` is (req)->Boolean, `parse` is (html)->html
 */
function rerender(rules) {

	return harmon([], [{
		query: 'html',
		func: function(elem, req, res) {
			var rule = _.find(rules, function(rule) {
				return rule.filter && rule.filter(req);
			});
			if (!rule) {
				return;
			}
			console.log('rerendering for ' + req.method + ' ' + req.url);
			var html = '';
			var stream = elem.createStream({
				outer: true
			});
			stream.on('error', function(error) {
				console.log('unable to rerender:', error);
			});
			stream.setEncoding('utf8');
			stream.on('readable', function() {
				var chunk;
				while (null !== (chunk = stream.read())) {
					html += chunk;
				}
			});
			stream.on('end', function() {
				if (rule.transform) {
					html = rule.transform(html);
					console.log('transform applied');
				}
				console.log('rendering complete');
				stream.end(html);
			});
		}
	}], true);

}