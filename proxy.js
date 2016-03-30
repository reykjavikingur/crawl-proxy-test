var startProxyServer = require('./lib/start-proxy-server');

startProxyServer({
	port: 4800,
	proxyTarget: 'http://www.postalmethods.com',
	rules: [
		//*
		{
			filter: function(req) {
				return req.url === '/';
			},
			transform: function(html) {
				return html.replace('PostalMethods Web-to-Post Service', 'PostalMethods AWESOME Web-to-Post Service');
			}
		},
		//*/
		//*
		{
			filter: function(req) {
				return req.url === '/faq';
			},
			transform: function(html) {
				return html.replace('What can I use PostalMethods for', 'What AMAZING THINGS can I use PostalMethods for');
			}
		}
		//*/
	]
});