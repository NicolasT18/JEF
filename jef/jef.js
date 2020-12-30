import home from '../pages/home/script.js';
import errorLink from '../pages/404/script.js';

const jef = {
	env: '',
	js: '../',
	content: document.getElementById('content'),
	currentPage: '',
	path: Array(),
	component: Array(),
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
				if (jef.loadFunction) jef.loadFunction();
				home(jef);
			}
		} else {
			let error = true;
			jef.path.forEach(path => {
				if (jef.env + '/' + path[0] === url) {
					error = false;
					jef.loadPage(path[0], path[1], path);
				}
			});
			if (error) {
				jef.loadPage('404', errorLink);
			}
		}
	},
	loadPage: (page, script, log = false) => {
		if (jef.currentPage !== page) {
			const initPage = () => {
				jef.currentPage = page;
				jef.initLink();
				if (jef.loadFunction) jef.loadFunction();
				if (script) script(jef);
			}
			console.log(log);
			if (log === false || log.length <= 2) {
				fetch(jef.js + 'pages/' + page + '/index.html')
					.then(res => res.text())
					.then(function (html) {
						jef.content.innerHTML = html;
						if (log !== false) { log[2] = html };
						initPage();
					});
			} else {
				jef.content.innerHTML = log[2];
				initPage();
			}
		}
	},
	initLink: () => {
		// init all link
		const appLink = document.getElementsByClassName('jef-link');
		for (let i = 0; i < appLink.length; i++) {
			appLink[i].replaceWith(appLink[i].cloneNode(true));
			appLink[i].addEventListener('click', e => {
				e.preventDefault();
				if (appLink[i] !== e.target) {
					return appLink[i].click();
				}
				const url = e.target.getAttribute("url");
				window.history.pushState(url, url, '/' + url);
				jef.root();
			});
		}
	},
	comp: (name, js = false, path) => {
		if (typeof jef.component[name] !== 'undefined') {
			return jef.component[name];
		} else {
			return fetch(path)
				.then(res => res.text())
				.then(html => {
					jef.component[name].htlm = html;
					if (js !== false) {
						jef.component[name].js = js;
					}
					return html;
				});
		}
	},
	fetch: (url, params = false, callback, currentPage = true) => {
		const header = new Headers();
		header.append('Content-Type', 'application/x-www-form-urlencoded');
		let paramsString = '';
		if (params) {
			let i = 0;
			Object.keys(params).forEach(name => {
				paramsString += `${i < 0 ? '&' : ''}${name}=${params[name]}`;
				i++;
			});
		}
		const init = {
			method: 'POST',
			headers: header,
			body: paramsString
		};

		if (currentPage) {
			const path = `pages/${jef.currentPage}/php/${url}.php`;
		} else {
			const path = url;
		}

		fetch(path, init)
			.then(res => res.json())
			.then(json => { if (callback) return callback(json) });
	}
}

export default jef;