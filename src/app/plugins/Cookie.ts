import Cookies from 'universal-cookie';
const cookies = new Cookies(null, {
  path: '/'
  // domain: process.env.VUE_APP_COOKIE_DOMAIN
});
export default cookies;
