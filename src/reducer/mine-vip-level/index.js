const Immutable = require('seamless-immutable');

module.exports = function (
  state = Immutable.from({
    userInfo:{},
    grownLevelInfo:{},
    errorMessage:'',
    load:{
      status:true,
      word:'加载中',
    },
  }),
  action
) {
  const { type, payload } = action;

  switch (type) {
    case 'SET_ERROR_MSG': {
      return state.set('errorMessage', payload || '');
    }
    case 'SET_LOAD_MSG': {
      return state.set('load', payload);
    }
    case 'SET_GROWN_LEVEL_INFO': {
      return state.set('grownLevelInfo', payload || {});
    }
    case 'SET_USER_INFO': {
      return state.set('userInfo', payload || {});
    }
    default:
  }
  return state;
};
