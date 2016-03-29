var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

module.exports = startProxyServer;

function startProxyServer(options) {

	var app = express();

	app.use(bodyParser.raw({
		type: '*/*'
	}));

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
			proxyReq.body = req.body;
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