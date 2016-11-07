const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  orderList: {},
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER_LIST':
      return state.set('orderList', payload);
    default:
      return state;
  }
};
