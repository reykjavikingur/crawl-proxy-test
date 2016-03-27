var startBaseServer = require('./lib/start-base-server');

console.log('starting the BASE server');

startBaseServer({
	baseDir: __dirname
});