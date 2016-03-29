module.exports = logger;

function logger() {
	return function(req, res, next) {
		try {
			console.log(req.method + ' ' + req.url);
			console.log(req.headers);
			if (req.query) {
				console.log(req.query);
			}
			if (req.body) {
				console.log(req.body);
			}
		} catch (e) {
			console.error('unable to log:', e);
		}

		next();
	}
}