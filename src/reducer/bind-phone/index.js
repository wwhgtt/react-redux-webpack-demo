import Immutable from 'seamless-immutable';

const defaultState = Immutable.from({
  childView: '',
  phoneInfo: {},
  errorMessage: '',
  loadInfo: {
    status: false,
    word: '',
  },
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_CHILDVIEW':
      return state.set('childView', payload || '');
    case 'SET_PHONE':
      return state.set('phoneInfo', payload);
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_LOAD_MSG':
      return state.set('loadInfo', payload);
    default:
      return state;
  }
};
