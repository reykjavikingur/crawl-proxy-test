var _ = require('underscore');
var express = require('express');
var request = require('request');

module.exports = startProxyServer;

function startProxyServer(options) {
	options = _.defaults(options || {}, {
		port: 4800,
		proxyTarget: 'http://localhost:3600'
	});

	var app = express();

	app.all('*', function(req, res, next) {
		// construct request to proxy target
		var proxyReq = {
			method: req.method,
			url: options.proxyTarget + req.url,
			headers: _.clone(req.headers),
			followRedirect: false
		};
		// change origin
		proxyReq.headers.host = options.proxyTarget;
		// TODO fix referer header
		// TODO fix domain restrictions in cookie headers
		// relay request contents
		if (req.method === 'GET') {
			proxyReq.qs = req.query;
		} else {
			// TODO set `proxyReq.body` to something from `req` (must be Buffer or String)
		}
		// send request to proxy target
		request(proxyReq, function(err, proxyRes, body) {
			if (err) {
				res.status(500).send('proxy error');
			} else {
				res.set(proxyRes.headers);
				res.status(proxyRes.statusCode);
				res.send(body);
			}
		});
	});

	app.listen(options.port, function() {
		console.log('proxy server listening on port ' + options.port);
	});
}