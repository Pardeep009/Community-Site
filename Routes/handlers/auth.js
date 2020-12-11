const express = require('express');

const router = express.Router();
const path = require('path');
const userController = require('../../Controllers/user');

router.use(express.static(path.join(__dirname, '../../public')));

router.get('/login',
	(req, res) => {
		res.render('login');
	});

router.post('/loginUser',
	userController.login);

router.use('/', require('../../Middlewares/passport.js'));

module.exports = router;
