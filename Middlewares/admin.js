module.exports = {
	isAdmin(req, res, next) {
		if (req.session.data.role === 'admin') {
			next();
		} else {
			res.redirect('/home');
		}
	},
	isSwitchAdmin(req, res, next) {
		if (req.session.data.switch === 'admin') {
			next();
		} else {
			res.redirect('/home');
		}
	},
};
