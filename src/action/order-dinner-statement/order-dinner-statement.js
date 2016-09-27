const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const getDishesPrice = require('../../helper/dish-hepler.js').getDishesPrice;
const isGroupDish = require('../../helper/dish-hepler.js').isGroupDish;
const helper = require('../../helper/order-helper.js');
require('es6-promise');
require('isomorphic-fetch');

const setOrder = createAction('SET_ORDER', order => order);
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
const setDiscountToOrder = createAction('SET_DISCOUNT_TO_ORDER', discount => discount);
const setCouponsToOrder = createAction('SET_COUPONS_TO_ORDER', coupons => coupons);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const shopId = getUrlParam('shopId');
const tradeId = getUrlParam('tradeId');


exports.fetchOrder = () => (dispatch, getState) =>
  fetch(`${config.orderDinnerStatementAPI}?shopId=${shopId}&tradeId=${tradeId}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取订单信息失败...'));
      }
      return res.json();
    }).
    then(order => {
      if (order.code === '200') {
        dispatch(setOrder(order.data));
      } else {
        dispatch(setErrorMsg(order.msg));
      }
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


exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));

exports.submitDinnerOrder = () => (dispatch, getState) => {
  const state = getState();
  const coupId = state.serviceProps.couponsProps.inUseCoupon &&
                state.serviceProps.couponsProps.inUseCouponDetail.id ?
                +state.serviceProps.couponsProps.inUseCouponDetail.id
                :
                0;
  const dishesPrice = getDishesPrice(state.orderedDishesProps.dishes);
  const integral = state.serviceProps.integralsInfo.isChecked ? helper.countIntegralsToCash(
    Number(helper.countPriceWithCouponAndDiscount(dishesPrice, state.serviceProps)),
    state.serviceProps.integralsDetail
  ).integralInUsed : 0;

  let requestOptions = Object.assign({}, config.requestOptions);
  requestOptions.method = 'POST';
  requestOptions.body = JSON.stringify({ shopId:+shopId, orderId:+tradeId, coupId, integral });

  return fetch(`${config.submitDinnerOrderAPI}?shopId=${shopId}&orderId=${tradeId}`, requestOptions).
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

        location.href = `/order/orderallDetail?shopId=${shopId}&orderId=${result.data.orderId}`;
      } else {
        dispatch(setErrorMsg(result.msg));
      }
    }).
    catch(err => {
      console.log(err);
    });
};
