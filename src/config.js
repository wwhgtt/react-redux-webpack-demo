let apiBase;
let requestOptions;

switch (process.env.NODE_ENV) {
  case 'production':
    apiBase = `http://${process.env.PROD_HOST}/`;
    requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    };
    break;
  default:
    apiBase = `http://${process.env.DEV_HOST}:3001`;
    requestOptions = {
      method: 'GET', mod: 'cors',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    };
}

module.exports = {
  takeawayMenuAPI: `${apiBase}/takeaway/dishAll.json`,
  orderallMenuAPI: `${apiBase}/orderall/dishAll.json`,
  orderDineInAPi: `${apiBase}/orderall/dishBox.json`,
  orderCouponsAPI:`${apiBase}/coupon/getCanUseCoupons.json`,
  orderDiscountInfoAPI:`${apiBase}/shop/discountInfo.json`,

  requestOptions,
};
