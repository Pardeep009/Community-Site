const express = require('express');

const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, '../../public')));

const discussion = require('../../Models/discussion');
const community = require('../../Models/community');

router.get('/switchcreatecommunity',
	(req, res) => {
		res.render('createcommunity', { obj: req.session.data });
	});

router.get('/communitypanel',
	(req, res) => {
		res.render('communityhome', { obj: req.session.data });
	});

router.get('/list',
	(req, res) => {
		res.render('communitysearch', { obj: req.session.data });
	});

router.get('/communityprofile/:pro',
	(req, res) => {
		const id = req.params.pro;
		console.log(id);
		const query = [{ path: 'communityownerid', select: { name: 1, photoname: 1 } }, { path: 'communitymember', select: { name: 1, photoname: 1 } }, { path: 'communitymanager', select: { name: 1, photoname: 1 } }];
		community.findOne({ _id: id }).populate(query).exec((err, person) => {
			if (err) throw err;
			console.log(person);
			res.render('communityprofile', { obj: req.session.data, commobj: person });
		});
	});

router.get('/manageCommunity/:pro',
	(req, res) => {
		const id = req.params.pro;
		community.findOne({ _id: id }, (err, result) => {
			if (err) throw err;
			else if (result.communityconfirm === false) {
				res.render('notactive', { message: { msg: 'Error: This community is deactivated or may be deleted by admin' } });
			} else {
				res.render('manageCommunity', { obj: req.session.data, commobj: result });
			}
		});
	});

router.get('/discussions/:pro',
	(req, res) => {
		const id = req.params.pro;
		community.findOne({ _id: id }, (err, result) => {
			if (err) throw err;
			else {
				console.log(result);
				if (result.communityconfirm === false) {
					res.render('notactive', { message: { msg: 'Error: This community is deactivated or may be deleted by superadmin' } });
				} else {
					res.render('communitydiscussions', { obj: req.session.data, commobj: result });
				}
			}
		});
	});

router.get('/communitymembers/:pro',
	(req, res) => {
		community.findOne({ _id: req.params.pro }, (err, result) => {
			if (err) throw err;
			else {
				res.render('communitymembers', { obj: req.session.data, commobj: result });
			}
		});
	});

router.get('/editcommunity/:pro',
	(req, res) => {
		community.findOne({ _id: req.params.pro }, (err, result) => {
			if (err) throw err;
			else {
				res.render('editCommunity', { obj: req.session.data, commobj: result });
			}
		});
	});

router.get('/selecteddiscussion/:communityid/:discussionid',
	(req, res) => {
		community.findOne({ _id: req.params.communityid }, (err, communityreslult) => {
			if (err) throw err;
			else {
				discussion.findOne({ _id: req.params.discussionid }, (error, discussionresult) => {
					if (error) throw error;
					else {
						res.render('communityselectdisucssion', { obj: req.session.data, commobj: communityreslult, discussion: discussionresult });
					}
				});
			}
		});
	});

router.use('/', (req, res) => res.status(404).json({
	error: 'requested address was not found on server',
}));

module.exports = router;
