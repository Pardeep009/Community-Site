/* eslint-disable radix */
const tag = require('../Models/tag');

exports.getTags = (req, res) => {
	function getdata(colname, sortorder) {
		tag.countDocuments((e, count) => {
			const start = parseInt(req.body.start);
			const len = parseInt(req.body.length);
			const search = req.body.search.value;
			let getcount = 10;

			const findobj = {
				tagflag: '1',
			};
			if (search !== '') {
				findobj.$or = [{
					tagname: { $regex: search, $options: 'i' },
				}, {
					tagcreator: { $regex: search, $options: 'i' },
				}, {
					tagdate: { $regex: search, $options: 'i' },
				}];
			} else {
				delete findobj.$or;
			}

			tag.find(findobj).countDocuments((er, coun) => {
				getcount = coun;
			}).catch((err) => {
				console.error(err);
				res.send(err);
			});

			tag.find(findobj).skip(start).limit(len).sort({ [colname]: sortorder })
				.then((data) => {
					res.send({ recordsTotal: count, recordsFiltered: getcount, data });
				})
				.catch((err) => {
					console.error(err);
				});
		});
	}
	if (req.body.order[0].column === 0) {
		if (req.body.order[0].dir === 'asc') getdata('tagname', 1);
		else getdata('tagname', -1);
	} else if (req.body.order[0].column === 1) {
		if (req.body.order[0].dir === 'asc') getdata('tagcreator', 1);
		else getdata('tagcreator', -1);
	} else if (req.body.order[0].column === 2) {
		if (req.body.order[0].dir === 'asc') getdata('tagdate', 1);
		else getdata('tagdate', -1);
	} else {
		getdata('tagname', 1);
	}
};

exports.addtag = (req, res) => {
	tag.create(req.body, (error) => {
		if (error) throw error;
		else {
			res.end();
		}
	});
};

exports.deleteTag = (req, res) => {
	tag.updateOne({ _id: req.body._id }, { $set: { tagflag: '0' } }, (error) => {
		if (error) throw error;
		else {
			res.end();
		}
	});
};
