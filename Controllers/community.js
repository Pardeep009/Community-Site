const community = require('../Models/community');
const user = require('../Models/user');
const discussion = require('../Models/discussion');
const comment = require('../Models/comment');
const reply = require('../Models/reply');

function createcommunity(req) {
	let cid;
	const obj = req.body;
	obj.communityowner = req.session.data.name;
	obj.communityownerid = req.session.data._id;
	community.create(obj, (err, result) => {
		if (err) throw err;
		else {
			//  cid = result._id;
			user.updateOne({ _id: req.session.data._id },
				{ $push: { owned: result._id } }, (err, result) => {
					if (err) throw err;
					else {
						console.log(result);
					}
				});
		}
	});
}

exports.createcommunity = (req, res) => {
	if (!req.body.communityname) {
		res.send('no dataa');
	} else {
		if (req.body.myImage) {
			console.log('photo found');
			upload(req, res, (err) => {
				if (err) throw err;
				else {
					console.log(photoname);
					req.body.communityimage = photoname;
					console.log('photo uploaded');
					createcommunity(req);
					// res.redirect('/community/switchcreatecommunity');
					res.render('createcommunity', { obj: req.session.data });
				}
			});
		} else {
			createcommunity(req);
			res.render('createcommunity', { obj: req.session.data });
		}
	}
};

exports.getCommunityList = (req, res) => {
	if (req.body.order[0].column == 0) {
		if (req.body.order[0].dir == 'asc') getdata('communityname', 1);
		else getdata('communityname', -1);
	} else if (req.body.order[0].column == 1) {
		if (req.body.order[0].dir == 'asc') getdata('communitymembershiprule', 1);
		else getdata('communitymembershiprule', -1);
	} else if (req.body.order[0].column == 2) {
		if (req.body.order[0].dir == 'asc') getdata('communitylocation', 1);
		else getdata('communitylocation', -1);
	} else if (req.body.order[0].column == 3) {
		if (req.body.order[0].dir == 'asc') getdata('communityowner', 1);
		else getdata('communityowner', -1);
	} else if (req.body.order[0].column == 4) {
		if (req.body.order[0].dir == 'asc') getdata('communitycreatedate', 1);
		else getdata('communitycreatedate', -1);
	} else {
		getdata('communityname', 1);
	}

	function getdata(colname, sortorder) {
		community.countDocuments((e, count) => {
			const start = parseInt(req.body.start);
			console.log(start);
			const len = parseInt(req.body.length);
			const mrule = req.body.communitymembershiprule;
			const search = req.body.search.value;
			let getcount = 10;
			console.log(req.body.search.value.length);

			const findobj = {};
			console.log(mrule);
			if (mrule != 'all') { findobj.communitymembershiprule = mrule; } else {
				delete findobj.communitymembershiprule;
			}
			if (search != '') {
				findobj.$or = [{
					communityname: { $regex: search, $options: 'i' },
				}, {
					communitymembershiprule: { $regex: search, $options: 'i' },
				}, {
					communitylocation: { $regex: search, $options: 'i' },
				},
				{
					communityowner: { $regex: search, $options: 'i' },
				},,
					{
						communitycreatedate: { $regex: search, $options: 'i' },
					}];
			} else delete findobj.$or;

			community.find(findobj).countDocuments((e, coun) => {
				getcount = coun;
			}).catch((err) => {
				console.error(err);
				res.send(error);
			});

			community.find(findobj).skip(start).limit(len).sort({ [colname]: sortorder })
				.then((data) => {
					res.send({ recordsTotal: count, recordsFiltered: getcount, data });
				})
				.catch((err) => {
					console.error(err);
				});
		});
	}
};

exports.uploadImage = (req, res) => {
	community.updateOne({ _id: req.params.pro }, { $set: { communityimage: req.file.secure_url } }, (error, result) => {
		if (error) throw error;
		else {
			res.redirect(`/community/editcommunity/${req.params.pro}`);
		}
	});
};

exports.promteUser = (req, res) => {
	community.updateOne({ _id: req.body.commid }, { $push: { communitymanager: req.body.userid }, $pull: { communitymember: { $in: [req.body.userid] } } }, (err, result) => {
		if (err) throw err;
		else {
			user.updateOne({ _id: req.body.userid }, { $push: { manager: req.body.commid }, $pull: { join: { $in: [req.body.commid] } } }, (err, result) => {
				if (err) throw err;
				else {
					req.session.data.manager.push(req.body.commid);
					for (let i = 0; i < req.session.data.join.length; i++) {
						if (req.session.data.join[i] == req.body.commid) {
							req.session.data.join.splice(i, 1);
							break;
						}
					}
					res.send('DONE');
				}
			});
		}
	});
};

exports.demoteUser = (req, res) => {
	community.updateOne({ _id: req.body.commid }, { $push: { communitymember: req.body.userid }, $pull: { communitymanager: { $in: [req.body.userid] } } }, (err, result) => {
		if (err) throw err;
		else {
			user.updateOne({ _id: req.body.userid }, { $push: { join: req.body.commid }, $pull: { manager: { $in: [req.body.commid] } } }, (err, result) => {
				if (err) throw err;
				else {
					req.session.data.join.push(req.body.commid);
					for (let i = 0; i < req.session.data.manager.length; i++) {
						if (req.session.data.manager[i] == req.body.commid) {
							req.session.data.manager.splice(i, 1);
							break;
						}
					}
					res.send('DONE');
				}
			});
		}
	});
};

exports.addReply = (req, res) => {
	const obj = req.body;
	obj.replyownerid = req.session.data._id;
	obj.replyowername = req.session.data.name;
	obj.replyownerphotoname = req.session.data.photoname;
	reply.create(obj, (error, result) => {
		if (error) throw error;
		else {
			comment.updateOne({ _id: obj.commentid }, {
				$push: { reply: result._id },
				$inc: { replylength: 1 },
			}, (error, result) => {
				if (error) throw error;
				else {
					res.send(obj);
				}
			});
		}
	});
};

exports.deleteReply = (req, res) => {
	reply.updateOne({ _id: req.body.replyid }, { $set: { flag: false } }, (error, result) => {
		if (error) throw error;
		else {
			comment.updateOne({ _id: req.body.commentid }, {
				$inc: { replylength: -1 },
			}, (error, result) => {
				if (error) throw error;
				else {
					res.send('Reply Deleted');
				}
			});
		}
	});
};

exports.addComment = (req, res) => {
	const obj = req.body;
	obj.commentownerid = req.session.data._id;
	obj.commentownername = req.session.data.name;
	obj.commentownerphoto = req.session.data.photoname;
	obj.reply = [];
	obj.replylength = 0;
	comment.create(obj, (error, result) => {
		if (error) throw error;
		else {
			discussion.updateOne({ _id: obj.discussionid },
				{
					$push: {
						discussioncomments: result._id,
					},
					$inc: { commentslength: 1 },
				}, (error, rslt) => {
					if (error) throw error;
					else {
						console.log(rslt);
						obj._id = result._id;
						res.send(obj);
					}
				});
		}
	});
};

exports.deleteComment = (req, res) => {
	comment.updateOne({ _id: req.body.commentid }, { $set: { flag: false } }, (error, result) => {
		if (error) throw error;
		else {
			discussion.updateOne({ _id: req.body.discussionid },
				{
					$inc: { commentslength: -1 },
				}, (error, rslt) => {
					if (error) throw error;
					else {
						res.send('Reply Deleted');
					}
				});
		}
	});
};

exports.createDiscussion = (req, res) => {
	const obj = req.body;
	obj.discussionownername = req.session.data.name;
	obj.discussionownerid = req.session.data._id;
	obj.discussiondeleted = false;
	obj.discussionfeatured = false;
	obj.discussionglobal = false;
	obj.commentslength = 0;
	discussion.create(obj, (error, result) => {
		if (error) {
			console.log(error);
		} else {
			community.updateOne({ _id: obj.communityid },
				{
					$push: {
						communitydiscussion: result._id,
					},
				}, (error, rslt) => {
					if (error) throw error;
					else {
						obj._id = result._id;
						res.send(obj);
					}
				});
		}
	});
};

exports.getDiscussion = (req, res) => {
	const query = [{
		path: 'communitydiscussion',
		match: { discussiondeleted: { $ne: true } },
		select: {
			discussiontitle: 1, discussiondetail: 1, discussionownername: 1, discussionownerid: 1, discussiondate: 1, discussioncomments: 1, commentslength: 1, discussionfeatured: 1, discussionglobal: 1, communityid: 1,
		},
	}];
	community.findOne({ _id: req.body.commid }).populate(query).exec((err, result) => {
		if (err) throw err;
		else {
			res.send(result);
		}
	});
};

exports.getDiscussionComments = (req, res) => {
	const query = [{
		path: 'reply',
		match: { flag: { $ne: false } },
		select: {
			replyownerid: 1, text: 1, replyowername: 1, replyownerphotoname: 1, replydate: 1, commentid: 1,
		},
	}];
	comment.find({ discussionid: req.body.discussionid, flag: { $ne: false } }).populate(query).exec((error, result) => {
		if (error) throw error;
		else {
			res.send(result);
		}
	});
};

exports.featureDiscussion = (req, res) => {
	discussion.updateOne({ _id: req.body.discussionid }, { $set: { discussionfeatured: req.body.value } }, (error, result) => {
		if (error) throw error;
		else {
			res.send('Discussion Modified');
		}
	});
};

exports.globalDiscussion = (req, res) => {
	discussion.updateOne({ _id: req.body.discussionid }, { $set: { discussionglobal: req.body.value } }, (error, result) => {
		if (error) throw error;
		else {
			res.send('Discussion Modified');
		}
	});
};

exports.deleteDiscussion = (req, res) => {
	const { discussionid } = req.body;
	discussion.updateOne({ _id: discussionid }, { $set: { discussiondeleted: true } }, (error, result) => {
		if (error) throw error;
		else {
			res.send('Discussion Deleted');
		}
	});
};

exports.get = (req, res) => {
	const query = [{ path: 'communityownerid', select: { name: 1, photoname: 1 } }, { path: 'communitymember', select: { name: 1, photoname: 1 } }, { path: 'communitymanager', select: { name: 1, photoname: 1 } }];
	community.findOne({ _id: req.body._id }).populate(query).exec((err, person) => {
		if (err) throw err;
		// console.log(person);
		res.send(person);
	});
};

exports.removeUser = (req, res) => {
	community.updateOne({ _id: req.body.commid }, { $pull: { communitymember: { $in: [req.body.userid] } }, $pull: { communitymanager: { $in: [req.body.userid] } } }, (err, result) => {
		if (err) throw err;
		else {
			user.updateOne({ _id: req.body.userid }, { $pull: { join: { $in: [req.body.commid] } }, $pull: { manager: { $in: [req.body.commid] } } }, (err, result) => {
				if (err) throw err;
				else {
					for (let i = 0; i < req.session.data.join.length; i++) {
						if (req.session.data.join[i] == req.body.commid) {
							req.session.data.join.splice(i, 1);
							break;
						}
					}
					for (let i = 0; i < req.session.data.manager.length; i++) {
						if (req.session.data.manager[i] == req.body.commid) {
							req.session.data.manager.splice(i, 1);
							break;
						}
					}
					res.send('DONE');
				}
			});
		}
	});
};

exports.rejectRequest = (req, res) => {
	community.updateOne({ _id: req.body.commid }, { $pull: { communityrequest: { $in: [req.body.userid] } } }, (err, result) => {
		if (err) throw err;
		else {
			user.updateOne({ _id: req.body.userid }, { $pull: { req: { $in: [req.body.commid] } } }, (err, result) => {
				if (err) throw err;
				else {
					for (let i = 0; i < req.session.data.req.length; i++) {
						if (req.session.data.req[i] == req.body.commid) {
							req.session.data.req.splice(i, 1);
							break;
						}
					}
					res.send('DONE');
				}
			});
		}
	});
};

exports.acceptRequest = (req, res) => {
	console.log(req.body);
	community.updateOne({ _id: req.body.commid }, { $push: { communitymember: req.body.userid }, $pull: { communityrequest: { $in: [req.body.userid] } } }, (err, result) => {
		if (err) throw err;
		else {
			user.updateOne({ _id: req.body.userid }, { $push: { join: req.body.commid }, $pull: { req: { $in: [req.body.commid] } } }, (err, result) => {
				if (err) throw err;
				else {
					req.session.data.join.push(req.body.commid);
					res.send('DONE');
				}
			});
		}
	});
};

exports.getMembers = (req, res) => {
	const query = [{ path: 'communityownerid', select: { name: 1, photoname: 1 } }, { path: 'communitymember', select: { name: 1, photoname: 1 } }, { path: 'communityrequest', select: { name: 1, photoname: 1 } }, { path: 'invitations', select: { name: 1, photoname: 1 } }, { path: 'communitymanager', select: { name: 1, photoname: 1 } }];
	community.findOne({ _id: req.body._id }).populate(query).exec((err, person) => {
		if (err) throw err;
		res.send(person);
	});
};

exports.leaveCommunity = (req, res) => {
	user.updateOne({ _id: req.session.data._id }, { $pull: { join: { $in: [req.body.communityid] } }, $pull: { manager: { $in: [req.body.communityid] } } }, (error, result) => {
		if (error) throw error;
		else {
			community.updateOne({ _id: req.body.communityid }, { $pull: { communitymember: { $in: [req.session.data._id] } }, $pull: { communitymanager: { $in: [req.session.data._id] } } }, (error, result) => {
				if (error) throw error;
				else {
					for (let i = 0; i < req.session.data.join.length; i++) {
						if (req.session.data.join[i] == req.body.communityid) {
							req.session.data.join.splice(i, 1);
							break;
						}
					}
					for (let i = 0; i < req.session.data.manager.length; i++) {
						if (req.session.data.manager[i] == req.body.communityid) {
							req.session.data.manager.splice(i, 1);
							break;
						}
					}
					res.end();
				}
			});
		}
	});
};

exports.cancelRequest = (req, res) => {
	community.updateOne({ _id: req.body._id }, { $pull: { communityrequest: { $in: [req.session.data._id] } } }, (error, result) => {
		if (error) throw error;
		else {
			user.updateOne({ _id: req.session.data._id }, { $pull: { req: { $in: [req.body._id] } } }, (error, result) => {
				if (error) throw error;
				else {
					for (let i = 0; i < req.session.data.req.length; i++) {
						if (req.session.data.req[i] == req.body._id) {
							req.session.data.req.splice(i, 1);
							break;
						}
					}
					res.end();
				}
			});
		}
	});
};

exports.pjoin = (req, res) => {
	user.updateOne({ _id: req.session.data._id }, { $push: { req: req.body._id } }, (error, result) => {
		if (error) throw error;
		else {
			community.updateOne({ _id: req.body._id }, { $push: { communityrequest: req.session.data._id } }, (error, result) => {
				if (error) throw error;
				else {
					req.session.data.req.push(req.body._id);
					res.end();
				}
			});
		}
	});
};

exports.djoin = (req, res) => {
	user.updateOne({ _id: req.session.data._id }, { $push: { join: req.body._id } }, (error, result) => {
		if (error) throw error;
		else {
			community.updateOne({ _id: req.body._id }, { $push: { communitymember: req.session.data._id } }, (error, result) => {
				if (error) throw error;
				else {
					req.session.data.join.push(req.body._id);
					res.end();
				}
			});
		}
	});
};

exports.freeCommunities = (req, res) => {
	const { start } = req.body;
	const { end } = req.body;
	const findobj = { $and: [{ communityownerid: { $not: { $eq: req.session.data._id } } }, { communitymember: { $nin: [req.session.data._id] } }, { communityrequest: { $nin: [req.session.data._id] } }] };
	community.find(findobj).skip(start).limit(end).exec((error, result) => {
		{
			if (error) throw error;
			else {
				res.send(result);
			}
		}
	});
};

exports.updateCommunity = (req, res) => {
	community.updateOne({ _id: req.params.pro }, { $set: req.body }, (err, result) => {
		if (err) throw err;
		else {
			res.redirect(`/community/editcommunity/${req.params.pro}`);
		}
	});
};

exports.ownedCommunities = (req, res) => {
	community.find({ $or: [{ communityownerid: req.session.data._id }, { communitymember: { $in: [req.session.data._id] } }, { communitymanager: { $in: [req.session.data._id] } }, { communityrequest: { $in: [req.session.data._id] } }] }).exec((error, result) => {
		{
			if (error) throw error;
			else {
				res.send(result);
			}
		}
	});
};
