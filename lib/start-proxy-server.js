var express = require('express');
var proxy = require('./proxy');
var rerender = require('./rerender');

module.exports = startProxyServer;

function startProxyServer(options) {

	var port = options.port;
	var proxyTarget = options.proxyTarget;
	var rules = options.rules;

	var app = express();

	app.use(rerender(rules));

	app.use(proxy({
		target: proxyTarget
	}));

	app.listen(port, function() {
		console.log('proxy server listening on port ' + port);
	});

}