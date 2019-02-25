document.forms['signupForm'].addEventListener('submit', event => {
	event.preventDefault();
	const data = [...Array(event.target.length - 1)].reduce((a, _, index) => {
		a[event.target[index].name] = event.target[index].value;
		return a;
	}, {});
	fetch('auth/signup', {
		method: 'POST', 
		headers: {
	        "Content-Type": "application/json",
	        // "Content-Type": "application/x-www-form-urlencoded",
    	}, 
    	body: JSON.stringify(data)
    })
		.then(res => res.json())
		.then(successful => successful ? location.reload() : document.getElementsByClassName('alert-danger')[1].style.display = 'block');
});
document.forms['signinForm'].addEventListener('submit', event => {
	event.preventDefault();
	const data = [...Array(event.target.length - 1)].reduce((a, _, index) => {
		a[event.target[index].name] = event.target[index].value;
		return a;
	}, {});
	fetch('auth/signin', {
		method: 'POST', 
		headers: {
	        "Content-Type": "application/json",
	        // "Content-Type": "application/x-www-form-urlencoded",
    	}, 
    	body: JSON.stringify(data)
    })
		.then(res => res.json())
		.then(successful => successful ? location.reload() : document.getElementsByClassName('alert-danger')[0].style.display = 'block');
});

document.addtocartForm.addEventListener('submit', function(ev) {
	// debugger;
	ev.preventDefault();
	const form = ev.target;
	const data = [...Array(form.length - 1)].reduce((a, _, index) => {
		let input = form[index];
		a[input.name] = input.value;
		return a;
	}, {});
	console.log('submit', data);
	fetch('/cart/add/5c6f584a47813214978a9a63', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	}).then(res => res.json())
	  .then(data => console.log(data));
}, false);