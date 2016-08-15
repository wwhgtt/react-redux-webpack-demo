const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  customerProps: {},
  childView: '',
  errorMessage: '',
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_CHILDVIEW':
      return state.set('childView', payload || '');
    case 'SET_ADDRESS_INFO':
      return state.set('customerProps', Object.assign({}, state.customerProps, payload));
    case 'SET_ERROR_MSG':
      return state.set(
        'errorMessage', payload
      );
    case 'SET_All_ADDRESSLIST':
      return state.set('allAddressList', payload || []);
    default:
  }
  return state;
};
