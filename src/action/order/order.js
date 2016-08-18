const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const getDishesPrice = require('../../helper/dish-hepler.js').getDishesPrice;
const isGroupDish = require('../../helper/dish-hepler.js').isGroupDish;
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
const setAddressListInfoToOrder = createAction('SET_ADDRESS_LIST_INFO_TO_ORDER', data => data);
const setDeliveryPrice = createAction('SET_DELIVERY_PRICE', freeDeliveryPrice => freeDeliveryPrice);
const setSendAreaId = createAction('SET_SEND_AREA_ID', areaId => areaId);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setCustomToShopAddress = createAction('SET_ADDRESS_TOSHOP_TO_ORDER', option => option);
const setOrderTimeProps = createAction('SET_ORDER_TIME_PROPS', timeJson => timeJson);
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
      if (type === 'TS') {
        dispatch(setOrder(order.data));
      } else {
        const selectedCustomerProps = JSON.parse(localStorage.getItem('receiveOrderCustomerInfo'));
        if (selectedCustomerProps) {
          order.data.ma = selectedCustomerProps.addresses[0];
          order.data.member = { name:selectedCustomerProps.name, sex:selectedCustomerProps.sex, mobile:selectedCustomerProps.mobile };
          dispatch(setOrder(order.data));
        } else {
          dispatch(setOrder(order.data));
        }
      }
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
exports.fetchOrderCoupons = () => (dispatch, getState) => {
  let brandDishidsCollection = [];
  getState().orderedDishesProps.dishes.filter(
    dish => !isGroupDish(dish)
  ).map(
    dish => brandDishidsCollection.push(dish.brandDishId)
  );
  const brandDishIds = brandDishidsCollection.join(',');
  fetch(
    `${config.orderCouponsAPI}?shopId=${shopId}&orderAccount=${getDishesPrice(getState().orderedDishesProps.dishes)}&brandDishIds=${brandDishIds}`,
    config.requestOptions).
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
};

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
exports.fetchUserAddressListInfo = () => (dispatch, getState) => {
  fetch(`${config.getUserAddressListAPI}?shopId=${shopId}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取用户地址列表信息失败...'));
      }
      return res.json();
    }).
    then(coupons => {
      dispatch(setAddressListInfoToOrder(coupons.data));
    }).
    catch(err => {
      console.log(err);
    });
};
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
  const state = getState();
  const paramsData = helper.getSubmitUrlParams(state, note, receipt);
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
        helper.setCallbackUrl(result.data.orderId);
        const isOnlinePay = state.serviceProps.payMethods.some(payMethod => payMethod.id === 'online-payment' && payMethod.isChecked);
        const paramStr = `shopId=${shopId}&orderId=${result.data.orderId}`;
        let jumpToUrl = '';
        if (isOnlinePay && paramsData.needPayPrice.toString() !== '0') {
          jumpToUrl = `/shop/payDetail?${paramStr}&orderType=${type}`;
        } else {
          jumpToUrl = type === 'WM' ? '/order/takeOutDetail?' : '/order/orderallDetail?';
          jumpToUrl += paramStr;
        }
        location.href = jumpToUrl;
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
exports.fetchDeliveryPrice = () => (dispatch, getState) => {
  const freeDeliveryPrice = sessionStorage.getItem(shopId + '_sendArea_freeDeliveryPrice');
  const deliveryPrice = sessionStorage.getItem(shopId + '_sendArea_shipment');
  const deliveryProps = { freeDeliveryPrice:JSON.parse(freeDeliveryPrice), deliveryPrice:JSON.parse(deliveryPrice) };
  dispatch(setDeliveryPrice(deliveryProps));
};

exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));

exports.setSessionAndForwardChaining = (id) => (dispatch, getState) => {
  sessionStorage.setItem('rurl_address', JSON.stringify(location.href));
  if (typeof id !== 'string') {
    location.href = `${config.editUserAddressURL}?shopId=${getUrlParam('shopId')}`;
  } else {
    location.href = `${config.editUserAddressURL}?shopId=${getUrlParam('shopId')}&id=${id}`;
  }
};
exports.setSessionAndForwardEditUserAddress = (id) => (dispatch, getState) => {
  sessionStorage.setItem('rurl_address', JSON.stringify(location.href));
  let url = `${config.editUserAddressURL}?shopId=${shopId}`;
  if (typeof id === 'string') {
    url += `&addressId=${id}`;
  }
  location.href = url;
};
exports.setCustomerProps = (evt, customerProps) => (dispatch, getState) => {
  if (!customerProps.name) {
    dispatch(setErrorMsg('请输入您的姓名'));
    return false;
  }
  dispatch(setOrderProps(null, customerProps));
  return true;
};
exports.setCustomerToShopAddress = (evt, customerTProps, validateRet) => (dispatch, getState) => {
  if (!validateRet.valid) {
    dispatch(setErrorMsg(validateRet.msg));
    return false;
  }

  dispatch(setCustomToShopAddress(customerTProps));
  return true;
};

exports.confirmOrderAddressInfo = (info, orderedDishesProps, serviceProps) => (dispatch, getState) => {
  const address = info.addresses && info.addresses[0] || {};
  const rangeId = address.rangeId || 0;
  const addressId = address.id || 0;
  const url = `${config.getOrderAddressInfoAPI}?shopId=${shopId}&rangeId=${rangeId}&addressId=${addressId}`;
  fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('外卖下单确认地址...'));
      }
      return res.json();
    }).
    then(result => {
      if (result.code !== '200') {
        dispatch(setErrorMsg(result.msg));
        return;
      }

      dispatch(setOrderProps(null, info));
      const data = result.data || {};
      const dishesPrice = getDishesPrice(orderedDishesProps.dishes || []);
      sessionStorage.setItem(`${shopId}_sendArea_id`, data.sendAreaId);
      sessionStorage.setItem(`${shopId}_sendArea_shipment`, data.shipment);
      sessionStorage.setItem(`${shopId}_sendArea_sendPrice`, data.sendPrice);
      sessionStorage.setItem(`${shopId}_sendArea_freeDeliveryPrice`, data.freeDeliveryPrice);

      if (data.sendPrice > dishesPrice) {
        localStorage.setItem('receiveOrderCustomerInfo', JSON.stringify(info));
        dispatch(setErrorMsg('订单金额不满足起送价'));
        setTimeout(() => {
          location.href = `${config.getMoreWMDishesURL}?type=${type}&shopId=${shopId}`;
        }, 3000);
        return;
      }

      const deliveryProps = {
        freeDeliveryPrice: data.freeDeliveryPrice,
        deliveryPrice: data.shipment,
      };
      dispatch(setDeliveryPrice(deliveryProps));
      dispatch(setOrderTimeProps(data.timeJson));
    }).
    catch(err => {
      console.log(err);
    });
};
