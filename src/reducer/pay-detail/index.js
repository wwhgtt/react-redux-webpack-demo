const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    payProps:null,
    errorMessage:null,
    loading:false,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_PAY_PROPS':
      return state.set('payProps', payload);
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_LOAD_PROP': {
      return state.set('loading', payload);
    }
    default:
  }
  return state;
};
