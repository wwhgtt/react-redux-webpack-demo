const Immutable = require('seamless-immutable');
const balanceHelper = require('../../helper/mine-helper.js');

module.exports = function (
  state = Immutable.from({
    balanceInfo:{},
  }),
  action
) {
  const { type, payload } = action;

  switch (type) {
    case 'SET_BALANCE_INFO': {
      return state.set('balanceInfo', balanceHelper.getBalanceInfo(payload));
    }
    default:
  }
  return state;
};
