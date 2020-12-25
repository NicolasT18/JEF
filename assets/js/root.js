import jef from './jef.js';
import hello from '../../pages/hello/script.js';

jef.prod(false); // optionnal, only if the website is not at the racine in production

jef.path.push(['hello', hello]);
jef.root(true); // true only if root function is launch after the loading of website
