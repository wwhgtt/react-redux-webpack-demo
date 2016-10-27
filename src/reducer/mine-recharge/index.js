const Immutable = require('seamless-immutable');

module.exports = function (
  state = Immutable.from({
    rechargeInfo: {},
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_RECHARGE_INFO': {
      return state.set('rechargeInfo', payload);
    }
    default:
  }
  return state;
};
