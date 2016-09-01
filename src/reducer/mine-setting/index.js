const Immutable = require('seamless-immutable');

module.exports = function (
  state = Immutable.from({
    info:{},
    errorMessage:'',
  }),
  action
) {
  const { type, payload } = action;

  switch (type) {
    case 'SET_INFO': {
      const data = payload || {};
      return state.set('info', data);
    }
    case 'SET_ERROR_MSG': {
      return state.set('errorMessage', payload || '');
    }
    default:
  }
  return state;
};
