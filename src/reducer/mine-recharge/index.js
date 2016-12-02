const Immutable = require('seamless-immutable');

module.exports = function (
  state = Immutable.from({
    rechargeInfo: {},
    userInfo: {},
    brandInfo: {},
    errorMessage: '',
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_RECHARGE_INFO': {
      return state.set('rechargeInfo', payload);
    }
    case 'SET_USER_INFO': {
      return state.set('userInfo', payload);
    }
    case 'SET_BRAND_INFO': {
      return state.set('brandInfo', payload);
    }
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    default:
  }
  return state;
};
