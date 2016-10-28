const Immutable = require('seamless-immutable');

module.exports = function (
  state = Immutable.from({
    rechargeInfo: {},
    userInfo: {},
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
    default:
  }
  return state;
};
