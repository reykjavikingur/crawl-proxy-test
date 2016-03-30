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
			console.log('rerendering for ' + req.method + ' ' + req.url);
			var html = '';
			var stream = elem.createStream({
				outer: true
			});
			stream.setEncoding('utf8');
			stream.on('readable', function() {
				var chunk;
				while (null !== (chunk = stream.read())) {
					html += chunk;
				}
			});
			stream.on('end', function() {
				console.log('rendering complete');
				stream.end(html);
			});
		}
	}]);

}