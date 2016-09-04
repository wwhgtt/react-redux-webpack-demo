import Immutable from 'seamless-immutable';

const defaultState = Immutable.from({
  userInfo: {},
  errorMessage: '',
  loadinfo: {
    status: false,
    word: '',
  },
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_USER_INFO':
      return state.set('userInfo', payload);
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_LOAD_MSG':
      return state.set('loadInfo', payload);
    default:
      return state;
  }
};
