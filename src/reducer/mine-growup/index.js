const Immutable = require('seamless-immutable');
module.exports = (
  state = Immutable.from({
    growupInfo: {},
  }),
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_GROWUP_INFO': {
      return state.set('growupInfo', payload);
    }
    default:
  }
  return state;
};
