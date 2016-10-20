import Immutable from 'seamless-immutable';

const defaultState = Immutable.from({
  errorMessage: '',
  loadInfo: '',
  childView: '',
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_LOAD_MSG':
      return state.set('loadInfo', payload);
    case 'SET_CHILDVIEW':
      return state.set('childView', payload);
    default:
      return state;
  }
};
