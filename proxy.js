var startProxyServer = require('./lib/start-proxy-server');

console.log('starting the PROXY server');

startProxyServer({
	port: 4800,
	proxyTarget: 'http://localhost:3600'
});