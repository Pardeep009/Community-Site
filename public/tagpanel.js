const tagname = document.getElementById('input-tag');
const submit = document.getElementById('tag-sub-btn');
submit.onclick = () => {
	console.log(tagname.value);
	const date = new Date();
	console.log(date);
	let today = new Date();
	const dd = today.getDate();
	const mm = today.getMonth() + 1;
	const yyyy = today.getFullYear();
	let hrs = today.getHours();
	const mins = today.getMinutes();
	let format = 'AM';
	if (hrs > 12) {
		hrs -= 12;
		format = 'PM';
	}
	today = `${+dd}-${getMonths(mm)}-${yyyy}`;
	today = `${today} ( ${hrs}:${mins} ${format} )`;
	console.log(today);
	const obj = Object();
	obj.tagname = tagname.value;
	obj.tagdate = today;
	obj.tagflag = '1';
	obj.tagcreator = document.getElementById('tagcreator').innerHTML;
	console.log(obj);
	const request = new XMLHttpRequest();
	request.open('POST', '/addtag');
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify(obj));
	request.onload = function () {
		alert('added');
		tagname.innerHTML = '';
	};
};

function getMonths(monthno) {
	const month = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return month[monthno - 1];
}

function opentaglist() {
	window.location = '/admin/showtaglist';
}
