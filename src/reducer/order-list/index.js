const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  orderList: [],
  childView: '',
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER_LIST':
      return state.set('orderList', payload);
    case 'SET_CHILD_VIEW':
      return state.set('childView', payload);
    default:
      return state;
  }
};
