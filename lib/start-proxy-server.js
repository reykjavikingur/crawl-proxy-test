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

	proxy.on('error', function(error) {
		console.error('Proxy Error:', error);
	});
	/*
	proxy.on('proxyRes', function(proxyRes, req, res) {
		//console.log('handling proxyRes for ' + req.method + ' ' + req.url);
	});
	//*/

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