const Immutable = require('seamless-immutable');
module.exports = (
  state = Immutable.from({
    errorMessage: null,
    loadingInfo: { ing: false, text: '' },
    supportInfo: {
      mobile: true,
      isxeq: false,
      weixin: false,
    },
  }),
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_LOADING_INFO':
      return state.set('loadingInfo', payload);
    case 'SET_SUPPORT_INFO':
      return state.set('supportInfo', payload);
    default:
  }
  return state;
};

