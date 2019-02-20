document.forms['signupForm'].addEventListener('submit', event => {
	event.preventDefault();
	const data = [...Array(event.target.length - 1)].reduce((a, _, index) => {
		a[event.target[index].name] = event.target[index].value;
		return a;
	}, {});
	console.log(data);
	fetch('auth/signup', {
		method: 'POST', 
		headers: {
	        "Content-Type": "application/json",
	        // "Content-Type": "application/x-www-form-urlencoded",
    	}, 
    	body: JSON.stringify(data)
    })
		.then(res => res.json())
		.then(data => console.log(data));
});