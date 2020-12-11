const express = require('express');

const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, '../../public')));
router.use(express.static(path.join(__dirname, '../../public/uploadimages')));

router.get('/adduser', (req, res) => {
	res.render('adduser', { obj: req.session.data });
});

router.get('/userslist', (req, res) => {
	res.render('userslist', { obj: req.session.data });
});

router.get('/communitylist', (req, res) => {
	res.render('communitylist', { obj: req.session.data });
});

router.get('/tagpanel', (req, res) => {
	res.render('tagpanel', { obj: req.session.data });
});

router.get('/showtaglist', (req, res) => {
	res.render('showtaglist', { obj: req.session.data });
});

router.use('/', (req, res) => res.status(404).json({
	error: 'requested address was not found on server',
}));

module.exports = router;
