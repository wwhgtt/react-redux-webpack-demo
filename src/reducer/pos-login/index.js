const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  errorMsg: '',
  info: {},
  childView: '',
  loadStatus: false,
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_INFO':
      return state.set('info', payload);
    case 'SET_ERROR_MSG':
      return state.set('errorMsg', payload);
    case 'SET_CHILDVIEW':
      return state.set('childView', payload);
    case 'SET_LOAD_STATUS':
      return state.set('loadStatus', payload);
    default:
      return state;
  }
};
