let table;
function getdata() {
	$.fn.dataTable.ext.errMode = 'none';
	table = $('#community-table').DataTable({
		processing: true,
		serverSide: true,
		rowId: '_id',
		ajax: {
			url: '/cl',
			type: 'POST',
			data(d) {
				d.communitymembershiprule = $('#membership-select').val();
			},
		},
		columns: [
			{
				data: 'communityname',
				// id : "_id",
			},
			{
				data: 'communitymembershiprule',
				sorting: 'false',
			},
			{
				data: 'communitylocation',
			},
			{
				data: 'communityowner',
				// "sorting" : "false",
			},
			{
				data: 'communitycreatedate',
				// "sorting" : "false",
			},
			{
				data: null,
				sorting: 'false',
			},
			{
				data: null,
				sorting: 'false',
			},
		],
		columnDefs: [{
			targets: 6,

			render(data, type, row, meta) {
				// console.log("0");
				data = `<img src="${row.communityimage}" style="width:80px; height:80px;`;
				if (row.communityconfirm === true) data = `${data}border:4px solid green;"></img>`;
				else {
					data = `${data}border:4px solid red;"></img>`;
				}
				return data;
			},

		}, {
			targets: 5,

			render(data, type, row, meta) {
				data = `<center><a class="btn btn-sm editbtn actionbtns" data-target="#updateCommunity" data-toggle="modal" onclick=editCommunity("${row.communitycreatedate}","${encodeURIComponent(row.communityowner)}","${encodeURIComponent(row.communityname)}","${encodeURIComponent(row.communityconfirm)}","${row._id}") style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-edit"></span></a><a class="btn btn-sm infobtn actionbtns" onclick=showComminfo("${encodeURIComponent(row.communityname)}","${encodeURIComponent(row.communityimage)}","${encodeURIComponent(row.communitydescription)}") data-toggle="modal" data-target="#CommunityInfo" style="margin-top:35px; background-color: #2D312C; color: #fff"><span class="fa fa-info"></span></a></center>`;
				return data;
			},
		}],
	});

	$('#membership-select').on('change', () => {
	    table.ajax.reload(null, false);
  	});

	$('#refresh').on('click', () => {
	    table.ajax.reload(null, false);
  	});
  	}

$(document).ready(() => {
	console.log('1');
	getdata();
});

function editCommunity(obj, commo, commn, comms, _id) {
	console.log(comms);
	commn = decodeURIComponent(commn);
	comms = decodeURIComponent(comms);
	commo = decodeURIComponent(commo);
	console.log(commn, comms, commo);
	$('#CommunityNamePop').html(`Update ${commn}`);
	$('#CommunityAdminPop').html(`Created by ${commo},${obj}`);
	$('#CommuityName').val(commn);
	$('#communityStatus').val(comms);
	$('#editsubmit').off('click').on('click', () => {
		const obj = Object();
		obj._id = _id;
		obj.communityname = $('#CommuityName').val();
		obj.communityconfirm = $('#communityStatus').val();
		const request = new XMLHttpRequest();
		request.open('POST', `/community/updateCommunity/${obj._id}`);
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify(obj));
		request.onload = function () {
			console.log(obj);
			table.ajax.reload(null, false);
		};
	});
}

function showComminfo(commn, image, commd) {
	commn = decodeURIComponent(commn);
	commd = decodeURIComponent(commd);
	image = decodeURIComponent(image);
	console.log(commd, commn, image);
	$('#CommunityProfilePic').attr('src', image);
	$('#CommunityInfoPop').html(`Commuity ${commn}`);
	$('#communityDesc').html(commd);
}
