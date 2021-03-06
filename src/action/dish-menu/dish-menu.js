const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const helper = require('../../helper/dish-helper');
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const getCurrentPosition = require('../../helper/common-helper.js').getCurrentPosition;
const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
const _orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
const _removeAllOrders = createAction('REMOVE_ALL_ORDERS', orders => orders);
const _setTakeawayServiceProps = createAction('SET_TAKEAWAY_SERVICE_PROPS', props => props);
const setDiscountToOrder = createAction('SET_DISCOUNT_TO_ORDER', discount => discount);
const setNormalDiscount = createAction('SET_NORMAL_DISCOUNT', discount => discount);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
exports.showDishDetail = createAction('SHOW_DISH_DETAIL', dishData => dishData);
exports.showDishDesc = createAction('SHOW_DISH_DESC', dishData => dishData);
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
if (type !== 'WM') {
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
      console.log(err);
      // dispatch(setErrorMsg('加载订单信息失败...'));
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
          const shipFreePrice = typeof sendAreaData.freeDeliveryPrice === 'number' ? sendAreaData.freeDeliveryPrice : 9999999999;
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
  helper.storeDishesLocalStorage(getStates().dishesDataDuplicate, getStates().shopInfo);
};

exports.removeAllOrders = (orders) => (dispatch, getStates) => {
  dispatch(_removeAllOrders(orders));
  helper.clearDishesLocalStorage();
};

exports.confirmOrder = () => (dispatch, getStates) => {
  const dishesData = getStates().dishesDataDuplicate;
  const orderedData = helper.getOrderedDishes(dishesData);
  const dishBoxChargeInfo = getStates().dishBoxChargeInfo;
  helper.deleteOldDishCookie();
  helper.setDishCookie(dishesData, orderedData);
  localStorage.setItem('dishBoxPrice', helper.getDishBoxprice(orderedData, dishBoxChargeInfo));
  if (type === 'TS') {
    //  堂食情况下需要考虑是否有tableId的情况
    const tableId = sessionStorage.getItem('tableId');
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

exports.fetchDishMarketInfos = () => (dispatch, getState) =>
  fetch(`${config.getDishMarketInfosAPI}?shopId=${helper.getUrlParam('shopId')}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取信息失败...'));
      }
      return res.json();
    }).
    then(discount => {
      if (discount.code !== '200') {
        if (discount.msg !== '未登录') {
          dispatch(setErrorMsg(discount.msg));
        }
      }
      dispatch(setNormalDiscount(discount.data));
    }).
    catch(err => {
      console.log(err);
    });

exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));


exports.fetchTableInfo = () => (dispatch, getState) => {
  const tableId = getUrlParam('tableId');
  const tableKey = getUrlParam('tableKey');
  let urlString = `?shopId=${shopId}`;
  if (!tableId && !tableKey) {
    return false;
  } else if (tableId) {
    urlString += `&tableId=${tableId}`;
  } else if (tableKey) {
    urlString += `&tableKey=${tableKey}`;
  }
  return fetch(`${config.getTableInfoAPI}${urlString}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取桌台信息失败...'));
      }
      return res.json();
    }).
    then(table => {
      if (table.code !== '200') {
        dispatch(setErrorMsg(table.msg));
        return false;
      }
      return sessionStorage.setItem('tableId', table.data.synFlag);
    }).
    catch(err => {
      console.log(err);
    });
};
