const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const helper = require('../../helper/dish-hepler');
const getCurrentPosition = require('../../helper/common-helper.js').getCurrentPosition;
const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
const _orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
const _removeAllOrders = createAction('REMOVE_ALL_ORDERS', orders => orders);
const _setTakeawayServiceProps = createAction('SET_TAKEAWAY_SERVICE_PROPS', props => props);
const setDiscountToOrder = createAction('SET_DISCOUNT_TO_ORDER', discount => discount);
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

  getCurrentPosition(gps => {
    const longitude = gps.longitude || '';
    const latitude = gps.latitude || '';
    fetch(`${config.getDefaultSendArea}?shopId=${shopId}&longitude=${longitude}&latitude=${latitude}`, config.requestOptions).
      then(res => {
        if (!res.ok) {
          dispatch(setErrorMsg('获取配送范围失败...'));
        }
        return res.json();
      }).
      then(areaData => {
        if (areaData.code === '200') {
          const sendAreaData = areaData.data;
          const shipmentFee = sendAreaData.shipment;
          const minPrice = sendAreaData.sendPrice;
          const shipFreePrice = sendAreaData.freeDeliveryPrice;
          sessionStorage.setItem(`${shopId}_sendArea_Id`, sendAreaData.sendAreaId);
          sessionStorage.setItem(`${shopId}_sendPrice`, minPrice);
          sessionStorage.setItem(`${shopId}_shipment`, shipmentFee);
          sessionStorage.setItem(`${shopId}_freeDeliveryPrice`, shipFreePrice);
          dispatch(_setTakeawayServiceProps({ shipmentFee, minPrice, shipFreePrice }));
        } else {
          dispatch(setErrorMsg(areaData.msg));
        }
      }).
      catch(err => {
        dispatch(setErrorMsg('加载配送范围失败...'));
      });
  }, err => {
    dispatch(setErrorMsg(err.message));
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
