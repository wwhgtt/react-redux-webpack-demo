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
const setAddressInfoToOrder = createAction('SET_ADDRESS_INFO_TO_ORDER', address => address);
const setSendAreaId = createAction('SET_SEND_AREA_ID', areaId => areaId);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const shopId = getUrlParam('shopId');
const type = getUrlParam('type');
exports.fetchOrder = () => (dispatch, getState) => {
  const sendAreaId = JSON.parse(sessionStorage.getItem(shopId + '_sendArea_id'));
  const toShopFlag = sendAreaId === 0 || !sendAreaId ? '1' : '0';
  const getOrderUrl = type === 'WM' ?
    config.orderTakeAwayAPi + '?shopId=' + shopId + '&toShopFlag=' + toShopFlag
    :
    config.orderDineInAPi + '?shopId=' + shopId;
  fetch(getOrderUrl, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取订单信息失败...'));
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
};

exports.fetchOrderDiscountInfo = () => (dispatch, getState) =>
  fetch(`${config.orderDiscountInfoAPI}?shopId=${shopId}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取会员信息失败...'));
      }
      return res.json();
    }).
    then(discount => {
      if (!discount.data) {
        return false;
      }
      return dispatch(setDiscountToOrder(discount.data));
    }).
    catch(err => {
      console.log(err);
    });
exports.fetchOrderCoupons = () => (dispatch, getState) =>
  fetch(`${config.orderCouponsAPI}?shopId=${shopId}&orderAccount=${getDishesPrice(getState().orderedDishesProps.dishes)}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取折扣信息失败...'));
      }
      return res.json();
    }).
    then(coupons => {
      dispatch(setCouponsToOrder(coupons.data));
    }).
    catch(err => {
      console.log(err);
    });

exports.fetchUserAddressInfo = () => (dispatch, getState) =>
  fetch(config.userAddressAPI, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取用户地址信息失败...'));
      }
      return res.json();
    }).
    then(coupons => {
      dispatch(setAddressInfoToOrder(coupons.data));
    }).
    catch(err => {
      console.log(err);
    });
exports.setOrderPropsAndResetChildView = (evt, option) => (dispatch, getState) => {
  dispatch(setOrderProps(evt, option));
  dispatch(setChildView(''));
};
exports.fetchLastOrderedDishes = () => (dispatch, getState) => {
  const lastOrderedDishes = localStorage.getItem('lastOrderedDishes');
  if (!lastOrderedDishes) {
    location.href = type === 'TS' ?
      `${config.getMoreTSDishesURL}?type=${type}&shopId=${shopId}`
      :
      `${config.getMoreWMDishesURL}?type=${type}&shopId=${shopId}`;
  }
  dispatch(setOrderedDishesToOrder(JSON.parse(lastOrderedDishes)));
};
exports.submitOrder = (note, receipt) => (dispatch, getState) => {
  const submitUrl = type === 'WM' ? config.submitWMOrderAPI : config.submitTSOrderAPI;
  const paramsData = helper.getSubmitUrlParams(getState(), note, receipt);
  if (!paramsData.success) {
    dispatch(setErrorMsg(paramsData.msg));
    return false;
  }
  return fetch(`${submitUrl}${paramsData.params}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('提交订单信息失败'));
      }
      return res.json();
    }).
    then(result => {
      if (result.code === '200') {
        localStorage.removeItem('lastOrderedDishes');
        location.href = `/order/orderallDetail?shopId=${shopId}&orderId=${result.data.orderId}`;
      } else {
        dispatch(setErrorMsg(result.msg));
      }
    }).
    catch(err => {
      console.log(err);
    });
};
exports.fetchSendAreaId = () => (dispatch, getState) => {
  const sendAreaId = sessionStorage.getItem(shopId + '_sendArea_id');
  dispatch(setSendAreaId(JSON.parse(sendAreaId)));
};
exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));

exports.setSessionAndForwardChaining = (id) => (dispatch, getState) => {
  sessionStorage.setItem('rurl_address', location.href);
  if (typeof id !== 'string') {
    location.href = `${config.editUserAddressURL}?shopId=${getUrlParam('shopId')}`;
  } else {
    location.href = `${config.editUserAddressURL}?shopId=${getUrlParam('shopId')}&id=${id}`;
  }
};
