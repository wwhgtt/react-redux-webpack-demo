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
const setPhoneValidateProps = createAction('SET_PHONE_VALIDATE_PROPS', bool => bool);
const shopId = getUrlParam('shopId');
const type = getUrlParam('type');

const serviceAreaId = JSON.parse(sessionStorage.getItem(`${shopId}_sendArea_id`));
const isToShop = serviceAreaId === 0 || !serviceAreaId ? '1' : '0';
const deliveryRangeId = sessionStorage.getItem(`${shopId}_sendArea_rangeId`) || '0';
const getOrderUrl = type === 'WM' ?
  `${config.orderTakeAwayAPi}?shopId=${shopId}&toShopFlag=${isToShop}&rangeId=${deliveryRangeId}`
  :
  `${config.orderDineInAPi}?shopId=${shopId}`;

exports.fetchOrder = () => (dispatch, getState) =>
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
        const selectedCustomerProps = JSON.parse(sessionStorage.getItem('receiveOrderCustomerInfo'));
        if (selectedCustomerProps) {
          order.data.ma = selectedCustomerProps.addresses[0];
          const selectedDateTimeKey = 'selectedDateTime';
          const selectedDateTime = sessionStorage.getItem(selectedDateTimeKey);
          if (selectedDateTime) {
            order.data.defaultSelectedDateTime = JSON.parse(selectedDateTime);
            sessionStorage.removeItem(selectedDateTimeKey);
          }
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
  const orderAccount = helper.getPriceCanBeUsedToBenefit(
    getDishesPrice(getState().orderedDishesProps.dishes),
    getState().serviceProps.deliveryProps
  ) - helper.countMemberPrice(
      true,
      getState().orderedDishesProps.dishes,
      getState().serviceProps.discountProps.discountList,
      getState().serviceProps.discountProps.discountType
    );
  fetch(
    `${config.orderCouponsAPI}?shopId=${shopId}&orderAccount=${orderAccount}&brandDishIds=${brandDishIds}`,
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
    then(result => {
      const sessionToShopInfoJson = sessionStorage.getItem(`${shopId}_customer_toshopinfo`);
      const sessionToShopInfo = sessionToShopInfoJson && JSON.parse(sessionToShopInfoJson);
      const { toShopInfo } = result.data;
      if (toShopInfo && toShopInfo.toShopFlag && sessionToShopInfo) {
        Object.assign(toShopInfo, sessionToShopInfo);
      }
      dispatch(setAddressListInfoToOrder(result.data));
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
        sessionStorage.removeItem('receiveOrderCustomerInfo');
        sessionStorage.removeItem(`${shopId}_sendArea_id`);
        sessionStorage.removeItem(`${shopId}_customer_toshopinfo`);

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
      } else if (result.code.toString() === '20013') {
        dispatch(setPhoneValidateProps(true));
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
exports.setCustomerProps = (customerProps) => (dispatch, getState) => {
  dispatch(setOrderProps(null, customerProps));
};
exports.setCustomerToShopAddress = (evt, validateRet, customerTProps) => (dispatch, getState) => {
  if (!validateRet.valid) {
    dispatch(setErrorMsg(validateRet.msg));
    return false;
  }

  const json = JSON.stringify(customerTProps);
  sessionStorage.setItem(`${shopId}_customer_toshopinfo`, json);
  dispatch(setCustomToShopAddress(customerTProps));
  return true;
};

exports.confirmOrderAddressInfo = (info) => (dispatch, getState) => {
  const address = info.addresses && info.addresses[0] || {};
  const rangeId = address.rangeId || 0;
  const addressId = address.id || 0;
  const state = getState();
  const { orderedDishesProps, timeProps } = state;
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
      let sendAreaId = data.sendAreaId === null ? -1 : data.sendAreaId;
      if (address.toShopFlag) {
        sendAreaId = 0;
      }
      sessionStorage.setItem(`${shopId}_sendArea_id`, sendAreaId);
      sessionStorage.setItem(`${shopId}_sendArea_rangeId`, rangeId);
      sessionStorage.setItem(`${shopId}_sendArea_shipment`, data.shipment);
      sessionStorage.setItem(`${shopId}_sendArea_sendPrice`, data.sendPrice);
      sessionStorage.setItem(`${shopId}_sendArea_freeDeliveryPrice`, data.freeDeliveryPrice);
      sessionStorage.setItem('receiveOrderCustomerInfo', JSON.stringify(info));

      dispatch(setSendAreaId(sendAreaId));
      if (data.sendPrice > dishesPrice) {
        if (timeProps && timeProps.selectedDateTime) {
          sessionStorage.setItem('selectedDateTime', JSON.stringify(timeProps.selectedDateTime));
        }
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

exports.submitOrderWithCode = (note, receipt) => (dispatch, getState) => {
  const state = getState();
  const paramsData = helper.getSubmitUrlParams(state, note, receipt);
  if (!paramsData.success) {
    dispatch(setErrorMsg(paramsData.msg));
    return false;
  }
  return fetch(`${config.submitWMOrderAPI}${paramsData.params}&code=${state.phoneValidateCode}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('提交订单信息失败'));
      }
      return res.json();
    }).
    then(result => {
      if (result.code === '200') {
        localStorage.removeItem('lastOrderedDishes');
        sessionStorage.removeItem('receiveOrderCustomerInfo');
        sessionStorage.removeItem(`${shopId}_sendArea_id`);
        sessionStorage.removeItem(`${shopId}_customer_toshopinfo`);

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
      } else if (result.code.toString() === '20013') {
        dispatch(setPhoneValidateProps(true));
      } else {
        dispatch(setErrorMsg(result.msg));
      }
    }).
    catch(err => {
      console.log(err);
    });
};
