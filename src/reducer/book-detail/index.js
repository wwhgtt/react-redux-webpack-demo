const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  bookInfo: {},
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_BOOK_INFO':
      return state.set('bookInfo': payload);
    default:
      return state;
  }
};
