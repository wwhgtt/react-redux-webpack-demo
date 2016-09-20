import Immutable from 'seamless-immutable';

const defaultState = Immutable.from({
  errorMessage: '',
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    default:
      return state;
  }
};
