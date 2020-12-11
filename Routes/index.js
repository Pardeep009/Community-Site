const express = require('express');

const router = express.Router();
const { checkLogin, isAlreadLoggedIn } = require('../Middlewares/login');
const { isAdmin, isSwitchAdmin } = require('../Middlewares/admin');

router.use('/community', checkLogin, require('./handlers/community.js'));

router.use('/admin', checkLogin, isAdmin, isSwitchAdmin, require('./handlers/admin.js'));

router.use('/auth', isAlreadLoggedIn, require('./handlers/auth.js'));

router.use('/', checkLogin, require('./handlers/user.js'));

module.exports = router;
