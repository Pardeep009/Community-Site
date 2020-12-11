module.exports = {
	checkLogin(req, res, next) {
		if (req.session.isLogin) {
			next();
		} else {
			res.redirect('/auth/login');
		}
	},
	isAlreadLoggedIn(req, res, next) {
		if (req.session.isLogin) {
			res.redirect('/home');
		} else {
			next();
		}
	},
};
