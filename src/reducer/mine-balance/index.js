const Immutable = require('seamless-immutable');

module.exports = function (
  state = Immutable.from({
    balanceInfo:{},
    errorMessage:'',
  }),
  action
) {
  const { type, payload } = action;

  switch (type) {
    case 'SET_BALANCE_INFO': {
      return state.set('balanceInfo', payload);
    }
    case 'SET_ERROR_MSG': {
      return state.set('errorMessage', payload || '');
    }
    default:
  }
  return state;
};
