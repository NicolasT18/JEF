import home from '../pages/home/script.js';
import errorLink from '../pages/404/script.js';

const jef = {
	env: '',
	js: '../../',
	content: document.getElementById('content'),
	currentPage: '',
	path: Array(),
	store: {},
	prod: (prod = false, env = '') => {
		if (prod) {
			jef.env = env;
			jef.js = '';
		}
	},
	root: (firstLoading = false) => {
		const url = window.location.pathname;
		if (url === jef.env + '/') {
			if (!firstLoading) {
				jef.loadPage('home', home);
			} else {
				jef.currentPage = 'home';
				jef.initLink();
				home(jef);
			}
		} else {
			let error = true;
			jef.path.forEach(path => {
				if (jef.env + '/' + path[0] === url) {
					error = false;
					jef.loadPage(path[0], path[1]);
				}
			});
			if (error) {
				jef.loadPage('404', errorLink);
			}
		}
	},
	loadPage: (page, script) => {
		if (jef.currentPage !== page) {
			fetch(jef.js + 'pages/' + page + '/index.html')
				.then(res => res.text())
				.then(function (html) {
					jef.currentPage = page;
					jef.content.innerHTML = html;
					jef.initLink();
					if (script) script(jef);
				});
		}
	},
	initLink: () => {
		// init all link
		const appLink = document.getElementsByClassName('jef-link');
		for (let i = 0; i < appLink.length; i++) {
			appLink[i].replaceWith(appLink[i].cloneNode(true));
			appLink[i].addEventListener('click', e => {
				e.preventDefault();
				const url = e.target.getAttribute("url");
				window.history.pushState(url, url, '/' + url);
				jef.root();
			});
		}
	},
	fetch: (url, params = {}, callback) => {
		const header = new Headers();
		header.append('Content-Type', 'application/x-www-form-urlencoded');
		let paramsString = '';
		if (params) {
			let i = 0;
			Object.keys(params).forEach(name => {
				console.log(name, params[name]);
				paramsString += `${i = 0 ? '&' : ''}${name}=${params[name]}`;
				i++;
			});
		}
		const init = {
			method: 'POST',
			headers: header,
			body: paramsString
		};

		fetch(`pages/${jef.currentPage}/php/${url}.php`, init)
			.then(res => res.json())
			.then(json => { if (callback) return callback(json)});
	}
}

export default jef;