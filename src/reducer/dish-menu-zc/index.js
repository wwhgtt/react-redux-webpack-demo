const Immutable = require('seamless-immutable');
const dishMenuReducer = require('../dish-menu/index.js');
const combineReducers = require('redux').combineReducers;

const dishMenuZcReducer = function (
  state = Immutable.from({
    callMsg:{
      info:'',
      callStatus:false,
    },
    canCall:true,
    timerStatus:false,
    shopStatus:{
      data:{},
      isLogin:false,
    },
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_CALL_MSG': {
      const data = payload || {};
      return state.set('callMsg', data);
    }
    case 'SET_CAN_CALL': {
      return state.set('canCall', payload);
    }
    case 'SET_TIMER_STATUS': {
      return state.set('timerStatus', payload.timerStatus);
    }
    case 'SET_SHOP_STATUS': {
      return state.set('shopStatus', payload);
    }
    default:
      return state;
  }
};

module.exports = combineReducers({
  dishMenuReducer,
  dishMenuZcReducer,
});
