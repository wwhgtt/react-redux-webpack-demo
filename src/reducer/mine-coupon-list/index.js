const Immutable = require('seamless-immutable');

module.exports = function (
  state = Immutable.from({
    couponList:{},
    errorMessage:'',
    load:{
      status:true,
      word:'加载中',
    },
  }),
  action
) {
  const { type, payload } = action;

  switch (type) {
    case 'SET_ERROR_MSG': {
      return state.set('errorMessage', payload || '');
    }
    case 'SET_LOAD_MSG': {
      return state.set('load', payload);
    }
    case 'SET_COUPON_LIST': {
      return state.set('couponList', payload || {});
    }
    default:
  }
  return state;
};
