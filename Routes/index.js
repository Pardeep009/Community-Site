const express = require('express');
const { execSync } = require('child_process');

const router = express.Router();
const { checkLogin, isAlreadLoggedIn } = require('../Middlewares/login');
const { isAdmin, isSwitchAdmin } = require('../Middlewares/admin');

router.use('/community', checkLogin, require('./handlers/community.js'));

router.use('/admin', checkLogin, isAdmin, isSwitchAdmin, require('./handlers/admin.js'));

router.use('/auth', isAlreadLoggedIn, require('./handlers/auth.js'));

router.get('/restart-server', (req, res) => {
	console.log(req.body);
	const output = execSync('ls', { encoding: 'utf-8' });
	res.send(req, res, output);
});

router.use('/', checkLogin, require('./handlers/user.js'));

module.exports = router;
