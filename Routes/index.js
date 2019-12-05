let express = require('express');
let router = express.Router();
let path = require('path');

router.use(express.static(path.join(__dirname,'../public')));

router.use('/community',require('./handlers/community.js'));

router.use('/admin',require('./handlers/admin.js'));

router.use('/auth',require('./handlers/auth.js'));

router.use('/',require('./handlers/user.js'));

module.exports = router;
