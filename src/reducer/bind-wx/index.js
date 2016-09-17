import Immutable from 'seamless-immutable';

const defaultState = Immutable.from({
  childView: '',
  errorMessage: '',
  wxInfo: {},
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_CHILDVIEW':
      return state.set('childView', payload || '');
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_WX_INFO':
      return state.set('wxInfo', payload);
    default:
      return state;
  }
};
