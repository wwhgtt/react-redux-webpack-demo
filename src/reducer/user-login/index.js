const Immutable = require('seamless-immutable');
module.exports = (
  state = Immutable.from({
    errorMessage: null,
    phoneNum:null,
    loadingInfo: { ing: false, text: '' },
    supportInfo: {
      mobile: true,
      isxeq: false,
      weixin: false,
    },
    timestamp: null,
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
    case 'SET_TIMESTAMP':
      return state.set('timestamp', payload);
    case 'SET_USER_PHONE':
      return state.set('phoneNum', payload);
    default:
  }
  return state;
};
