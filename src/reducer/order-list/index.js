const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  orderList: [],
  childView: '',
  takeOutList: [],
  bookList: [],
  queueList: [],
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER_LIST':
      return state.set('orderList', payload);
    case 'SET_CHILD_VIEW':
      return state.set('childView', payload);
    case 'SET_TAKE_OUT_LIST':
      return state.set('takeOutList', payload);
    case 'SET_BOOK_LIST':
      return state.set('bookList', payload);
    case 'SET_QUEUE_LIST':
      return state.set('queueList', payload);
    default:
      return state;
  }
};
