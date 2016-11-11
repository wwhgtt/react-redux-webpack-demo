const Immutable = require('seamless-immutable');
module.exports = (
  state = Immutable.from({
    accumulationInfo: {},
  }),
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_ACCUMULATION_INFO': {
      return state.set('accumulationInfo', payload || {});
    }
    default:
  }
  return state;
};
