export default () => {
	console.log('404 error :(');
	const url = window.location.href;
	const page = url.split('error?/')[1];
	document.getElementById('page').textContent = page;
}