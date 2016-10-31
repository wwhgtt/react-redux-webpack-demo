const Immutable = require('seamless-immutable');
module.exports = (
  state = Immutable.from({
    accumulationInfo: {},
  }),
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_PASSWORD_INFO': {
      return state.set('passwordInfo', payload);
    }
    default:
  }
  return state;
};
