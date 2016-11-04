const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  queueInfo: {},
  errorMsg: '',
  isRefresh: false,
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_QUEUE_INFO':
      return state.set('queueInfo', payload);
    case 'SET_ERROR_MSG':
      return state.set('errorMsg', payload);
    case 'SET_REFRESH':
      return state.set('isRefresh', payload);
    default:
      return state;
  }
};
