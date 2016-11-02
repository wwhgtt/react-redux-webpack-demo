const Immutable = require('seamless-immutable');

const defaultState = Immutable.from({
  queueInfo: {},
});

module.exports = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_QUEUE_INFO':
      return state.set('queueInfo', payload);
    default:
      return state;
  }
};
