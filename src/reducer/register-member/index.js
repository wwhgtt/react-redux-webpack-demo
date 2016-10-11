import Immutable from 'seamless-immutable';

const defaultState = Immutable.from({
  userInfo: {},
  errorMessage: '',
  loadInfo: {
    status: false,
    word: '',
  },
  phoneCode: '',
  timestamp: '',
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_USER_INFO':
      if (payload.loginType === 1) {
        Object.assign(payload, { name: '', sex: '-1' });
      }
      return state.set('userInfo', payload);
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_LOAD_MSG':
      return state.set('loadInfo', payload);
    case 'SET_PHONE_CODE':
      return state.set('phoneCode', payload);
    case 'SET_TIMESTAMP':
      return state.set('timestamp', payload);
    default:
      return state;
  }
};
