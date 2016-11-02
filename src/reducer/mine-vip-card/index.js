const Immutable = require('seamless-immutable');

module.exports = function (
  state = Immutable.from({
    userInfo:{},
    memberInfo:{},
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
    case 'SET_MEMBER_INFO': {
      return state.set('memberInfo', payload || {});
    }
    case 'SET_USER_INFO': {
      return state.set('userInfo', payload || {});
    }
    default:
  }
  return state;
};
