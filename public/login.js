const username = document.getElementById('username');
const password = document.getElementById('password');
const login = document.getElementById('submit');
login.addEventListener('click', () => {
	console.log('hello');
	const obj = new Object();
	obj.username = username.value;
	obj.password = password.value;
	console.log(obj);
	const request = new XMLHttpRequest();
	request.open('POST', '/auth/login');
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify(obj));
	request.onload = () => {
		if (request.responseText == '0000') {
			console.log('hello');
			window.location = '/notactive';
		} else if (request.responseText == '0') {
			document.getElementById('wrong').style.display = 'block';
		} else {
			console.log('dsdssssssss');
			window.location = '/home';
		}
	};
});
