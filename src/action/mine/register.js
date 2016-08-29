const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const commonHelper= require('../../helper/common-helper');

const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setInfo = createAction('setInfo', setInfo => setInfo);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);

//commonHelper.setCookie('mid',"b5d13adbc9d8d6ce93ad9f8ea4cc");
const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');
const mid=commonHelper.getCookie("mid");
const registerAPI=`${config.registerAPI}`;

exports.getInfo = (id) => (dispatch, getStates) => {
	if(!shopId){
		window.location.href=notFound;
		return;
	}
    fetch(registerAPI+"?shopId="+shopId+"&mId="+mid).
    then(res => {
      return res.json();
    }).
    then(BasicData => {
    	//console.log(BasicData)
      if(BasicData.msg){
      	 dispatch(setErrorMsg(BasicData.msg));
      	 setTimeout(function(){
      	 	BasicData.msg=="未登录"?
      	 	window.location.href=logUrl+"?shopId="+shopId+"&returnUrl="+encodeURIComponent(wl.pathname+wl.search)
      	 	:"";
      	 },3000)
      	 return;
      }
      //console.log(BasicData.data);
      dispatch(setInfo(BasicData.data));
    }).
    catch(err => {
      dispatch(setErrorMsg('获取基本信息失败...'));
    });
    }

//得到验证码
exports.getCode = (phoneNumber,trp) => (dispatch, getStates) => {
    fetch(registerAPI+"?shopId="+shopId+"&mId="+mid).
    then(res => {
      return res.json();
    }).
    then(BasicData => {
      let code="1111"; //此处模拟验证码
    }).
    catch(err => {
      dispatch(setErrorMsg('获取验证码失败...'));
    });
}

//保存信息
exports.saveInfo = (obj) => (dispatch, getStates) => {
	console.log(obj);
	
}