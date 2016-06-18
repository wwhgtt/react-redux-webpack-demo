let apiBase;

switch (process.env.NODE_ENV) {
  case 'production':
    apiBase = 'http://192.168.10.9:8080/';
    break;
  default:
    apiBase = 'http://192.168.10.9:8080/';
}

module.exports = {
  dishMenuAPI: `${apiBase}orderall/dishAll.json`,
};
