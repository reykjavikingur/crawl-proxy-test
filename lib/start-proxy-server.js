var express = require('express');
var proxy = require('./proxy');
var rerender = require('./rerender');

module.exports = startProxyServer;

function startProxyServer(options) {

	var port = options.port;
	var proxyTarget = options.proxyTarget;

	var app = express();

	app.use(rerender([{
		filter: function(req) {
			return req.url === '/';
		},
		transform: function(html) {
			return html.replace('PostalMethods Web-to-Post Service', 'PostalMethods AWESOME Web-to-Post Service');
		}
	}, {
		filter: function(req) {
			return req.url === '/faq';
		},
		transform: function(html) {
			return html.replace('What can I use PostalMethods for', 'What AMAZING THINGS can I use PostalMethods for');
		}
	}]));

	app.use(proxy({
		target: proxyTarget
	}));

	app.listen(port, function() {
		console.log('proxy server listening on port ' + port);
	});

}