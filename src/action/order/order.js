const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const getDishesPrice = require('../../helper/dish-hepler.js').getDishesPrice;
const helper = require('../../helper/order-helper.js');
require('es6-promise');
require('isomorphic-fetch');

const setOrder = createAction('SET_ORDER', order => order);
const setOrderProps = exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
const setDiscountToOrder = createAction('SET_DISCOUNT_TO_ORDER', discount => discount);
const setCouponsToOrder = createAction('SET_COUPONS_TO_ORDER', coupons => coupons);
const setChildView = exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setOrderedDishesToOrder = createAction('SET_ORDERED_DISHES_TO_ORDER', dishes => dishes);
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
exports.fetchOrder = () => (dispatch, getState) =>
  fetch(config.orderDineInAPi, config.requestOptions).
    then(res => {
      if (!res.ok) {
        throw new Error('获取订单信息失败...');
      }
      return res.json();
    }).
    then(order => {
      dispatch(setOrder(order.data));
      return order.data;
    }).
    catch(err => {
      console.log(err);
    });

exports.fetchOrderDiscountInfo = () => (dispatch, getState) =>
  fetch(config.orderDiscountInfoAPI, config.requestOptions).
    then(res => {
      if (!res.ok) {
        throw new Error('获取会员信息失败...');
      }
      return res.json();
    }).
    then(discount => {
      dispatch(setDiscountToOrder(discount.data));
    }).
    catch(err => {
      console.log(err);
    });
exports.fetchOrderCoupons = () => (dispatch, getState) => {
  fetch(config.orderCouponsAPI, config.requestOptions).
    then(res => {
      if (!res.ok) {
        throw new Error('获取折扣信息失败...');
      }
      return res.json();
    }).
    then(coupons => {
      dispatch(setCouponsToOrder(coupons.data));
    }).
    catch(err => {
      console.log(err);
    });
};
exports.setOrderPropsAndResetChildView = (evt, option) => (dispatch, getState) => {
  dispatch(setOrderProps(evt, option));
  dispatch(setChildView(''));
};
exports.getLastOrderedDishes = () => (dispatch, getState) => {
  const lastOrderedDishes = localStorage.getItem('lastOrderedDishes');
  if (!lastOrderedDishes) {
    throw new Error('获取本地订单信息失败...');
  }
  dispatch(setOrderedDishesToOrder(JSON.parse(lastOrderedDishes)));
};
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
exports.submitOrderProps = (note, receipt) => (dispatch, getState) => {
  const payMethodScope = getState().serviceProps.payMethods.filter(payMethod => payMethod.isChecked)[0].name === '在线支付' ? '1' : '0';
  const integral = helper.countIntegralsToCash(getDishesPrice(getState().orderedDishesProps.dishes),
    getState().orderSummary.coupon,
    getState().serviceProps.integralsInfo.integralsDetail
  ).integralInUsed;
  const needPayPrice = helper.countFinalPrice(
    getState().orderedDishesProps, getState().orderSummary, getState().serviceProps.integralsInfo, getState().commercialProps
  );
  const useDiscount = !getState().orderSummary.discount ? '0' : '1';
  const serviceApproach = getState().serviceProps.isPickupFromFrontDesk.isChecked ? 'pickup' : 'totable';
  const coupId = getState().serviceProps.couponsProps.inUseCouponDetail.id ? getState().serviceProps.couponsProps.inUseCouponDetail.id : '0';
  const params = 'name=' + getState().customerProps.name
      + '&Invoice=' + receipt + '&note=' + note
      + '&mobile=' + getState().customerProps.mobile
      + '&sex=' + getState().customerProps.sex
      + '&payMethod=' + payMethodScope
      + '&coupId=' + coupId
      + '&integral=' + Number(integral)
      + '&useDiscount=' + useDiscount
      + '&orderType=' + getUrlParam('type')
      + '&tableId=' + getState().tableProps.tables.filter(table => table.isChecked)[0].id
      + '&peopleCount=' + getState().customerProps.customerCount
      + '&serviceApproach=' + serviceApproach
      + '&shopId=' + getUrlParam('shopId')
      + '&needPayPrice=' + needPayPrice;
  fetch(config.submitOrderAll + '?' + params, {
    method: 'GET', mod: 'cors',
    // headers: { 'Content-Type': 'text/plain', Accept: 'application/json' },
  }).
    then(res => {
      if (!res.ok) {
        throw new Error('提交订单信息失败...');
      }
      return res.json();
    }).
    then(data => {

    }).
    catch(err => {
      console.log(err);
    });
};
