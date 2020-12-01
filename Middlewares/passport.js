const express = require('express');

const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, '../public')));

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const User = require('../Models/user');

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(
	new GitHubStrategy({
		clientID: `${process.env.clientID}`,
		clientSecret: `${process.env.clientSecret}`,
		callbackURL: `${process.env.callbackUrl}`,
		session: true,
	}, ((accessToken, refreshToken, profile, cb) => {
		console.log('passport callback function fired');
		return cb(null, profile);
	})),
);

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
	console.log('githubsignin succesful');
	User.findOne({
		githubid: req.session.passport.user._json.id,
	})
		.then((data) => {
			if (data) {
				console.log('-----------User Exists---------');
				req.session.isLogin = 1;
				const obj = Object();
				obj.isLogin = 1;
				obj.username = data.username;
				obj.city = data.city;
				obj.role = data.role;
				obj.name = data.name;
				obj.status = data.status;
				obj.state = data.state;
				obj.githubid = data.githubid;
				obj.photoname = data.photoname;
				if (data.gender) {
					obj.gender = data.gender;
					obj.phone = data.phone;
					obj.dob = data.dob;
				}
				obj._id = data._id;
				req.session.data = obj;
				console.log('github login successful');
				res.redirect('/home');
			} else {
				console.log('User not Found');
				const obj = {
					name: req.session.passport.user._json.name,
					username: req.session.passport.user._json.email,
					city: req.session.passport.user._json.location,
					status: 'pending',
					role: 'user',
					githubid: req.session.passport.user._json.id,
					photoname: '/dp.png',
					state: 'active',
				};
				// eslint-disable-next-line no-unused-vars
				User.create(obj, (error, result) => {
					if (error) throw error;
					else {
						req.session.data = obj;
						User.findOne({
							githubid: req.session.passport.user._json.id,
						})
							.then((newlyCreatedUser) => {
								req.session.data._id = newlyCreatedUser._id;
								req.session.isLogin = 1;
								res.redirect('/home');
							})
							.catch((err) => {
								throw err;
							});
					}
				});
			}
		})
		.catch((err) => {
			res.send(err);
		});
});

router.use('/', (req, res) => {
	return res.status(404).json({
		error: 'requested address was not found on server',
	});
})

module.exports = router;
