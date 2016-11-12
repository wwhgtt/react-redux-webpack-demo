const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  takeoutDetail: {},
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_TAKEOUT_DETAIL':
      return state.set('takeoutDetail', payload);
    default:
      return state;
  }
};
