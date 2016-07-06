let apiBase;

switch (process.env.NODE_ENV) {
  case 'production':
    apiBase = `http://${process.env.PROD_HOST}/`;
    break;
  default:
    apiBase = 'http://192.168.11.109:8080';
}
// ${process.env.DEV_HOST}:3001
module.exports = {
  takeawayMenuAPI: `${apiBase}/takeaway/dishAll.json`,
  orderallMenuAPI: `${apiBase}/orderall/dishAll.json`,
  orderDineInAPi: `${apiBase}/orderall/dishBox.json`,
  orderCouponsAPI:`${apiBase}/coupon/getCanUseCoupons.json`,
  orderDiscountInfoAPI:`${apiBase}/shop/discountInfo.json`,
  submitOrderAll:`${apiBase}/orderall/subOrder.json`,
};
