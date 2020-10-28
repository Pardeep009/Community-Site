const express = require('express');

const router = express.Router();
const path = require('path');
const checkLogin = require('../../Middlewares/checkLogin');
const isAdmin = require('../../Middlewares/isAdmin');

router.use(express.static(path.join(__dirname, '../../public')));
router.use(express.static(path.join(__dirname, '../../public/uploadimages')));

router.get('/adduser', checkLogin, isAdmin, (req, res) => {
	res.render('adduser', { obj: req.session.data });
});

router.get('/userslist', checkLogin, isAdmin, (req, res) => {
	res.render('userslist', { obj: req.session.data });
});

router.get('/communitylist', checkLogin, isAdmin, (req, res) => {
	res.render('communitylist', { obj: req.session.data });
});

router.get('/tagpanel', checkLogin, isAdmin, (req, res) => {
	res.render('tagpanel', { obj: req.session.data });
});

router.get('/showtaglist', checkLogin, isAdmin, (req, res) => {
	res.render('showtaglist', { obj: req.session.data });
});

module.exports = router;
