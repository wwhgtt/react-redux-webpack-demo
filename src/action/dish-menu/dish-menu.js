const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const helper = require('../../helper/dish-hepler');
const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
const _orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
const _removeAllOrders = createAction('REMOVE_ALL_ORDERS', orders => orders);
const _setTakeawayServiceProps = createAction('SET_TAKEAWAY_SERVICE_PROPS', props => props);
const setDiscountToOrder = createAction('SET_DISCOUNT_TO_ORDER', discount => discount);
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
exports.fetchServiceProps = () => (dispatch, getStates) => {
  if (helper.getUrlParam('type') !== 'WM') {
    return false;
  }
  const shopId = helper.getUrlParam('shopId');
  const shipmentFee = sessionStorage.getItem(`${shopId}_sendArea_shipment`);
  const minPrice = sessionStorage.getItem(`${shopId}_sendArea_sendPrice`);
  const shipFreePrice = sessionStorage.getItem(`${shopId}_sendArea_freeDeliveryPrice`);
  dispatch(_setTakeawayServiceProps({ shipmentFee, minPrice, shipFreePrice }));
  return true;
};
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
        throw new Error('获取菜单信息失败...');
      }
      return res.json();
    }).
    then(menuData => {
      dispatch(setMenuData(helper.restoreDishesLocalStorage(menuData.data)));
    }).
    catch(err => {
      throw err;
    });

exports.orderDish = (dishData, action) => (dispatch, getStates) => {
  dispatch(_orderDish(dishData, action));
  helper.storeDishesLocalStorage(getStates().dishesData);
};

exports.removeAllOrders = (orders) => (dispatch, getStates) => {
  dispatch(_removeAllOrders(orders));
  helper.clearDishesLocalStorage();
};

const setDishCookie = exports.setDishCookie = (dishesData, orderedData) => (dispatch, getStates) => {
  // 下面开始区分套餐cookie和单品菜cookie
  orderedData.map(orderData => {
    if (!helper.isSingleDishWithoutProps(orderData)) {
      for (let index in orderData.order) {
        const setPackageDishCookie = helper.getDishCookieObject(orderData, index);
        helper.setCookie(setPackageDishCookie.key, setPackageDishCookie.value);
      }
      return true;
    }
    const setSignleDishCookie = helper.getDishCookieObject(orderData, 0);
    return helper.setCookie(setSignleDishCookie.key, setSignleDishCookie.value);
  });
};
exports.confirmOrder = () => (dispatch, getStates) => {
  const dishesData = getStates().dishesData;
  const orderedData = helper.getOrderedDishes(dishesData);
  const dishBoxChargeInfo = getStates().dishBoxChargeInfo;
  setDishCookie(dishesData, orderedData);
  localStorage.setItem('dishBoxPrice', helper.getDishBoxprice(orderedData, dishBoxChargeInfo));
  if (type === 'TS') {
    //  堂食情况下需要考虑是否有tableId的情况
    location.href =
      `/orderall/dishBox?type=${helper.getUrlParam('type')}&shopId=${helper.getUrlParam('shopId')}&tableId=${helper.getUrlParam('tableId')}`;
  } else {
    location.href = `/takeaway/dishBox?type=${helper.getUrlParam('type')}&shopId=${helper.getUrlParam('shopId')}`;
  }
};
exports.fetchOrderDiscountInfo = () => (dispatch, getState) =>
  fetch(config.orderDiscountInfoAPI + '?shopId=' + helper.getUrlParam('shopId'), config.requestOptions).
    then(res => {
      if (!res.ok) {
        throw new Error('获取会员价信息失败...');
      }
      return res.json();
    }).
    then(discount => {
      if (discount.code.toString() !== '200') {
        throw new Error('获取会员价信息失败...');
      }
      dispatch(setDiscountToOrder(discount.data));
    }).
    catch(err => {
      console.log(err);
    });
