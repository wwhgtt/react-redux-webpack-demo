const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  bookDetail: {},
  bookInfo: {},
  errorMessage:'',
  load:{
    status:false,
    word:'加载中',
  },
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_BOOK_DETAIL':
      return state.set('bookDetail', payload);
    case 'SET_BOOK_INFO':
      return state.set('bookInfo', payload);
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload || '');
    case 'SET_LOAD_MSG':
      return state.set('load', payload);
    default:
      return state;
  }
};
