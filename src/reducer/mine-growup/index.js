const Immutable = require('seamless-immutable');
module.exports = (
  state = Immutable.from({
    growupInfo: {},
    currentRule: null,
  }),
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_GROWUP_INFO': {
      return state.set('growupInfo', payload);
    }
    case 'SET_CURRGROWN_RULE': {
      return state.set('currentRule', payload);
    }
    default:
  }
  return state;
};
