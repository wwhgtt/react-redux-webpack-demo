const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    customerProps: { sex: '1', name: '我是谁' },
    childView: null,
    errorMessage: null,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_CHILDVIEW':
      return state.set('childView', payload || '');
    default:
  }
  return state;
};
