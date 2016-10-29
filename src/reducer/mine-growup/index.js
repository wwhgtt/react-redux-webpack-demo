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
    case 'SET_GROWNLEVELS_INFO': {
      return state.setIn(['growupInfo', 'levelInfo'], payload || {});
    }
    default:
  }
  return state;
};
