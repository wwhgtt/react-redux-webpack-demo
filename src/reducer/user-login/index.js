const Immutable = require('seamless-immutable');
module.exports = (
  state = Immutable.from({
    errorMessage: null,
    loadingInfo: { ing: false, text: '' },
  }),
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_LOADING_INFO':
      return state.set('loadingInfo', payload);
    default:
  }
  return state;
};

