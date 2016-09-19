const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const helper = require('../../helper/dish-hepler');
const commonHelper = require('../../helper/common-helper');
const getCurrentPosition = require('../../helper/common-helper.js').getCurrentPosition;
const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
const _orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
const _removeAllOrders = createAction('REMOVE_ALL_ORDERS', orders => orders);
const _setTakeawayServiceProps = createAction('SET_TAKEAWAY_SERVICE_PROPS', props => props);
const setDiscountToOrder = createAction('SET_DISCOUNT_TO_ORDER', discount => discount);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
exports.showDishDetail = createAction('SHOW_DISH_DETAIL', dishData => dishData);
exports.showDishDesc = createAction('SHOW_DISH_DESC', dishData => dishData);
const setCallMsg = createAction('SET_CALL_MSG', callInfo => callInfo);
const setCanCall = createAction('SET_CAN_CALL', canCall => canCall);
const setTimerStatus = createAction('SET_TIMER_STATUS', timerStatus => timerStatus);

exports.activeDishType = createAction('ACTIVE_DISH_TYPE', (evt, dishTypeId) => {
  if (evt && /dish-type-item/.test(evt.target.className)) {
    window.__activeTypeByTap__ = true;
  } else {
    window.__activeTypeByTap__ = false;
  }
  return dishTypeId;
});
const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');
let url = '';
if (type === 'TS') {
  url = `${config.orderallMenuAPI}?shopId=${shopId}`;
} else {
  url = `${config.takeawayMenuAPI}?shopId=${shopId}`;
}
exports.fetchMenuData = () => (dispatch, getStates) =>
  fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取订单信息失败...'));
      }
      return res.json();
    }).
    then(menuData => {
      dispatch(setMenuData(helper.restoreDishesLocalStorage(menuData.data)));
    }).
    catch(err => {
      dispatch(setErrorMsg('加载订单信息失败...'));
    });

exports.fetchSendArea = () => (dispatch, getState) => {
  if (helper.getUrlParam('type') !== 'WM') return false;

  if (!!sessionStorage.getItem(`${shopId}_sendArea_id`)) {
    const shipmentFee = +sessionStorage.getItem(`${shopId}_sendArea_shipment`);
    const minPrice = +sessionStorage.getItem(`${shopId}_sendArea_sendPrice`);
    const shipFreePrice = +sessionStorage.getItem(`${shopId}_sendArea_freeDeliveryPrice`);
    dispatch(_setTakeawayServiceProps({ shipmentFee, minPrice, shipFreePrice }));
    return false;
  }

  const getDefaultSendArea = (longitude, latitude) => {
    const isGetLoc = !!longitude && !!latitude;
    fetch(`${config.getDefaultSendArea}?shopId=${shopId}&longitude=${longitude}&latitude=${latitude}&isGetLoc=${isGetLoc}`, config.requestOptions).
      then(res => {
        if (!res.ok) {
          dispatch(setErrorMsg('获取配送范围失败...'));
        }
        return res.json();
      }).
      then(areaData => {
        if (areaData.code === '200') {
          const sendAreaData = areaData.data;
          const shipmentFee = sendAreaData.shipment || 0;
          const minPrice = sendAreaData.sendPrice || 0;
          const shipFreePrice = sendAreaData.freeDeliveryPrice || 0;
          sessionStorage.setItem(`${shopId}_sendArea_id`, sendAreaData.id);
          sessionStorage.setItem(`${shopId}_sendArea_rangeId`, sendAreaData.id);
          sessionStorage.setItem(`${shopId}_sendArea_sendPrice`, minPrice);
          sessionStorage.setItem(`${shopId}_sendArea_shipment`, shipmentFee);
          sessionStorage.setItem(`${shopId}_sendArea_freeDeliveryPrice`, shipFreePrice);
          dispatch(_setTakeawayServiceProps({ shipmentFee, minPrice, shipFreePrice }));
        } else {
          dispatch(setErrorMsg(areaData.msg));
        }
      });
  };

  getCurrentPosition(gps => {
    getDefaultSendArea(gps.longitude, gps.latitude);
  }, error => {
    // if can't get gps location, pass empty longitude and latitude
    getDefaultSendArea('', '');
    // dispatch(setErrorMsg(error.message));
  });

  return true;
};

exports.orderDish = (dishData, action) => (dispatch, getStates) => {
  dispatch(_orderDish(dishData, action));
  helper.storeDishesLocalStorage(getStates().dishesData);
};

exports.removeAllOrders = (orders) => (dispatch, getStates) => {
  dispatch(_removeAllOrders(orders));
  helper.clearDishesLocalStorage();
};

exports.confirmOrder = () => (dispatch, getStates) => {
  const dishesData = getStates().dishesData;
  const orderedData = helper.getOrderedDishes(dishesData);
  const dishBoxChargeInfo = getStates().dishBoxChargeInfo;
  helper.deleteOldDishCookie();
  helper.setDishCookie(dishesData, orderedData);
  localStorage.setItem('dishBoxPrice', helper.getDishBoxprice(orderedData, dishBoxChargeInfo));
  if (type === 'TS') {
    //  堂食情况下需要考虑是否有tableId的情况
    const tableId = helper.getUrlParam('tableId');
    if (tableId) {
      location.href =
        `/orderall/dishBox?type=${helper.getUrlParam('type')}&shopId=${helper.getUrlParam('shopId')}&tableId=${tableId}`;
    } else {
      location.href =
        `/orderall/dishBox?type=${helper.getUrlParam('type')}&shopId=${helper.getUrlParam('shopId')}`;
    }
  } else {
    location.href = `/takeaway/dishBox?type=${helper.getUrlParam('type')}&shopId=${helper.getUrlParam('shopId')}`;
  }
};
exports.fetchOrderDiscountInfo = () => (dispatch, getState) =>
  fetch(config.orderDiscountInfoAPI + '?shopId=' + helper.getUrlParam('shopId'), config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取会员价信息失败...'));
      }
      return res.json();
    }).
    then(discount => {
      if (discount.code.toString() !== '200') {
        if (discount.msg !== '未登录') {
          dispatch(setErrorMsg(discount.msg));
        }
      }
      dispatch(setDiscountToOrder(discount.data));
    }).
    catch(err => {
      console.log(err);
    });

exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));

// call 服务铃
exports.callBell = (timer) => (dispatch, getStates) => {
  dispatch(setCanCall(false));
  dispatch(setCallMsg({ info:'正在发送...', callStatus:false }));
  fetch('http://testweixin.shishike.com/brand/index.json?shopId=810006427'). // config.requestOptions
  then(res => {
    if (!res.ok) {
      dispatch(setCallMsg({ info:'非常抱歉，发送失败了', callStatus:false }));
    }
    return res.json();
  }).
  then(basicData => {
    if (basicData.code === '20') {
      dispatch(setCallMsg({ info:'客官稍等，服务员马上就来', callStatus:true }));
      dispatch(setTimerStatus({ timerStatus:true }));
      commonHelper.interValSetting(timer, () => {
        dispatch(setTimerStatus({ timerStatus:false }));
      });
    } else {
      dispatch(setCallMsg({ info:'非常抱歉，发送失败了', callStatus:false }));
    }
    dispatch(setCanCall(true));
  }).
  catch(err => {
    console.info(err);
  });
};

exports.clearBell = (msg) => (dispatch, getStates) => {
  dispatch(setCallMsg({ info:msg, callStatus:false }));
};
