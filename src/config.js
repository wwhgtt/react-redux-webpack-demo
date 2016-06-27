let apiBase;

switch (process.env.NODE_ENV) {
  case 'production':
    apiBase = 'http://devweixin.shishike.com';
    break;
  default:
    apiBase = `http://${process.env.DEV_HOST}:3001`;
}

module.exports = {
  takeawayMenuAPI: `${apiBase}/takeaway/dishAll.json`,
  orderallMenuAPI: `${apiBase}/orderall/dishAll.json`,
  orderDineInAPi: `${apiBase}/orderall/dishBox.json`,
};
