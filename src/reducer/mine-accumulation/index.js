const Immutable = require('seamless-immutable');
module.exports = (
  state = Immutable.from({
    accumulationInfo: {},
    currentRule: null,
  }),
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_ACCUMULATION_INFO':
      return state.set('accumulationInfo', payload || {});
    case 'SET_CURRINTEGRAL_RULE':
      return state.set('currentRule', payload || {});
    default:
  }
  return state;
};
