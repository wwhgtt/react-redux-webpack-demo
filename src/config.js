let apiBase;

switch (process.env.NODE_ENV) {
  case 'production':
    apiBase = 'http://192.168.11.55:3001/';
    break;
  default:
    apiBase = 'http://192.168.11.55:3001/';
}

module.exports = {
  dishMenuAPI: `${apiBase}dish-menu`,
};
