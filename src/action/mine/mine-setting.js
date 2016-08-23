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
const mid = commonHelper.getCookie('mid');
const wl=window.location;

const logUrl=`${config.logAddressURL}`;
const notFound=`${config.notFoundUrl}`;

const individualviewAPI=`${config.individualviewAPI}`;
const individualupdateAPI=`${config.individualupdateAPI}`;

exports.getInfo = (id) => (dispatch, getStates) => {
	if(!shopId){
		window.location.href=notFound;
		return;
	}
    fetch(individualviewAPI+"?shopId="+shopId+"&mId="+mid).
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
exports.updateInfo = (sex,name) => (dispatch, getStates) => {
	if(!shopId){
		window.location.href=notFound;
		return;
	}	
	else if(!sex.toString()){
		dispatch(setErrorMsg('请选择性别!!'));
		return;
	}
	else if(!name.replace(/(^\s+)|(\s+$)/g,"")){
		dispatch(setErrorMsg('请输入姓名!!'));
		return;
	}
    fetch(individualupdateAPI+"?shopId="+shopId+"&mId="+mid,commonHelper.fetchPost({sex:sex,name:name.replace(/(^\s+)|(\s+$)/g,"")})).
    then(res => {
      return res.json();
    }).
    then(BasicData => {
      if(BasicData.msg){
      	 dispatch(setErrorMsg(BasicData.msg));
      	 setTimeout(function(){
      	 	BasicData.msg=="未登录"?window.location.href=logUrl+"?shopId="+shopId+"&returnUrl="+encodeURIComponent(wl.pathname+wl.search):"";
      	 },3000)
      	 return;
      }
      dispatch(setErrorMsg('修改成功'));
      setTimeout(function(){window.location.reload();},3000);
    }).
    catch(err => {
      dispatch(setErrorMsg('修改失败!!'));
      setTimeout(function(){window.location.reload();},3000);
    });
    }

exports.logOff = () => (dispatch, getStates) => {
	commonHelper.delCookie("mid"); //删除mid cookie
	dispatch(setErrorMsg('注销成功，请重新登陆'));
	setTimeout(function(){
      	 	window.location.href=logUrl;
    },3000)
    }

exports.clearErrorMsg = () => (dispatch, getStates) =>{
	dispatch(setErrorMsg(''));
    }