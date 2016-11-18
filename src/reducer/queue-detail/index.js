const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  queueInfo: {},
  queueDetail: {},
  isRefresh: false,
  errorMessage:'',
  load:{
    status:false,
    word:'加载中',
  },
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_QUEUE_INFO':
      return state.set('queueInfo', payload);
    case 'SET_QUEUE_DETAIL':
      return state.set('queueDetail', payload);
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_REFRESH':
      return state.set('isRefresh', payload);
    default:
      return state;
  }
};
