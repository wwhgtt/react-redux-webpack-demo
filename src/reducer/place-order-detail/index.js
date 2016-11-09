const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    orderDetail: {},
    orderInfo:{},
    errorMessage:'',
    load:{
      status:false,
      word:'加载中',
    },
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER_DETAIL': {
      return state.set('orderDetail', payload || {});
    }
    case 'SET_ORDER_INFO': {
      return state.set('orderInfo', payload || {});
    }
    case 'SET_ERROR_MSG': {
      return state.set('errorMessage', payload || '');
    }
    case 'SET_LOAD_MSG': {
      return state.set('load', payload);
    }
    default:
  }
  return state;
};
