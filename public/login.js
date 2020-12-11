const username = document.getElementById('username');
const password = document.getElementById('password');
const login = document.getElementById('submit');
login.addEventListener('click', () => {
	console.log('hello');
	let obj = {};
	obj = {
		username: username.value,
		password: password.value,
	};
	console.log(obj);
	const request = new XMLHttpRequest();
	request.open('POST', '/auth/loginUser');
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify(obj));
	request.onload = () => {
		if (request.responseText === '0000') {
			window.location = '/notactive';
		} else if (request.responseText === '0') {
			document.getElementById('wrong').style.display = 'block';
		} else {
			window.location = '/home';
		}
	};
});
