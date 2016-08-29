const Immutable = require('seamless-immutable');
const helper = require('../../helper/dish-hepler');
module.exports = function (
  state = Immutable.from({
    Info:{},
    Code:"",
    errorMessage:""
  }),
  action
) {
	
  const { type, payload } = action;

  switch (type) {
    case 'setInfo':
      return state.set("Info",payload||"");
    case 'setCode':
      alert(123)
      return state.set("Code",payload||"");
    case 'SET_ERROR_MSG':
      return state.set("errorMessage",payload||"");
      //window.location.href="http://www.baidu.com"; 跳转到登陆页面
    default:
  }
  return state;
};
