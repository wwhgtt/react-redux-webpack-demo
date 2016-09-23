import Immutable from 'seamless-immutable';
const orderDetailInHelper = require('../../helper/order-detail-in-helper.js');

const defaultState = Immutable.from({
  errorMessage: '',
  orderDetail: {},
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_ORDER_DETAIL':
      return state.set('orderDetail', Immutable.from(
        orderDetailInHelper.getOrderDetail(payload)));
    default:
      return state;
  }
};
