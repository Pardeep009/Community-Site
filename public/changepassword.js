const old_password = document.getElementById('old-password');
const new_password = document.getElementById('new-password');
const button = document.getElementById('submit-button');
button.onclick = () => {
	const obj = Object();
	obj.old_password = old_password.value;
	obj.new_password = new_password.value;
	const request = new XMLHttpRequest();
	request.open('POST', '/changepassword');
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify(obj));
	request.onload = function () {
		if (request.responseText == '0') {
			//    alertbox.setAttribute("display","block");
			if (document.getElementById('right')) {
				document.getElementById('right').style.display = 'none';
			}
			document.getElementById('wrong').style.display = 'block';
			// document.getElementById("right").style.display = "none";
			old_password.value = '';
			new_password.value = '';
		} else {
			// document.getElementById("wrong").style.display = "none";
			if (document.getElementById('wrong')) {
				document.getElementById('wrong').style.display = 'none';
			}
			document.getElementById('right').style.display = 'block';
			old_password.value = '';
			new_password.value = '';
			// alert("Password Changed Successfully")
			// window.history.go(-1)
		}
	};
};
