const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  bookDetail: {},
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_BOOK_DETAIL':
      return state.set('bookDetail', payload);
    default:
      return state;
  }
};
