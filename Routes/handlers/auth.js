
    let express = require('express');
    let router = express.Router();
    let path = require('path');
    let userController = require('../../Controllers/user');

    router.use(express.static(path.join(__dirname,'../../public')));

    router.use('/login',userController.login);

    router.use('/',require('../../Middlewares/passport.js'));

    module.exports = router;