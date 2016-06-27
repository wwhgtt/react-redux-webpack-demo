const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({ order:undefined }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER':
      return state.setIn(['order'], payload);
    default:
      return state;
  }
};
