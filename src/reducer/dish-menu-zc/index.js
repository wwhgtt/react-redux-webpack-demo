const Immutable = require('seamless-immutable');
const dishMenuReducer = require('../dish-menu/index.js');
const combineReducers = require('redux').combineReducers;

const dishMenuZcReducer = function (
  state = Immutable.from({
    callMsg:{
      info:'',
      callStatus:false,
    },
    callAble:true,
    timerStatus:false,
    serviceStatus:{
      data:{},
      isLogin:false,
    },
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_CALL_MSG': {
      return state.set('callMsg', payload || {});
    }
    case 'SET_CAN_CALL': {
      return state.set('callAble', payload);
    }
    case 'SET_TIMER_STATUS': {
      return state.set('timerStatus', payload.timerStatus);
    }
    case 'SET_SERVICE_STATUS': {
      return state.set('serviceStatus', payload || {});
    }
    default:
      return state;
  }
};

module.exports = combineReducers({
  dishMenuReducer,
  dishMenuZcReducer,
});
