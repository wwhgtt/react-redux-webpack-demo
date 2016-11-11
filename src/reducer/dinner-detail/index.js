const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  dinnerDetail: {},
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_DINNER_DETAIL':
      return state.set('dinnerDetail', payload);
    default:
      return state;
  }
};
