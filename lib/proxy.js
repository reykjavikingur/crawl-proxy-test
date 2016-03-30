var httpProxy = require('http-proxy');

module.exports = proxy;

/**
 * Generates middleware to act as reverse proxy.
 */
function proxy(options) {
	var target = options.target;
	var proxyServer = httpProxy.createServer({
		target: target
	});
	proxyServer.on('error', function(error) {
		console.error('Proxy Error:', error);
	});
	return function(req, res) {
		proxyServer.web(req, res, {
			target: target,
			changeOrigin: true
		});
	};
}