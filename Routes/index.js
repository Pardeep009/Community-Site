const express = require('express');

const router = express.Router();
const checkLogin = require('../Middlewares/checkLogin');
const isAdmin = require('../Middlewares/isAdmin');

router.use('/community', require('./handlers/community.js'));

router.use('/admin', isAdmin, checkLogin, require('./handlers/admin.js'));

router.use('/auth', require('./handlers/auth.js'));

router.use('/', require('./handlers/user.js'));

module.exports = router;
