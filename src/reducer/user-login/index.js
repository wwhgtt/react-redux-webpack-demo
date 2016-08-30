const Immutable = require('seamless-immutable');
module.exports = (
  state = Immutable.from({
    errorMessage:null,
  }),
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    default:
  }
  return state;
};

