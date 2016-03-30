var url = require('url');
var _ = require('underscore');
var express = require('express');
var httpProxy = require('http-proxy');
var rerender = require('./rerender');
var scrubber = require('./scrubber');
var liberateCookie = require('./liberate-cookie');

module.exports = startProxyServer;

function startProxyServer(options) {

	var port = options.port;
	var proxyTarget = options.proxyTarget;

	var proxy = httpProxy.createServer({
		target: proxyTarget
	});

	var app = express();

	app.use(rerender());

	app.use(function(req, res) {
		proxy.web(req, res, {
			target: proxyTarget,
			changeOrigin: true
		});
	});

	app.listen(port, function() {
		console.log('proxy server listening on port ' + port);
	});

}