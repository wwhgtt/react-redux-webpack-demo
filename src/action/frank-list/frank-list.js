const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setAJdata = createAction('GET_DATA', userInfo => userInfo);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const deleteAJdata = createAction('delete_DATA', ss => ss);

const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');

//let url = '';
//url = `${config.takeawayMenuAPI}?shopId=810005865&type=WM`;    /*门店号参数*/


exports.AJFUN = (id) => (dispatch, getStates) => 
    fetch(helper.decode(id), config.requestOptions).
    then(res => {
      if (res.msg) {
        dispatch(setErrorMsg('获取订单信息失败...'));
      }
      return res.json();
    }).
    then(menuData => {
      dispatch(setAJdata(helper.AJ(menuData)));
    }).
    catch(err => {
      dispatch(setErrorMsg('加载订单信息失败...'));
    });
    
//获取门店ID
exports.getId = (id) => (dispatch, getStates) =>{
	    if(!id){return false;}
	    fetch(helper.decode(id),config.requestOptions).
	    then(res=>{
	    	if(res.msg){
	    		dispatch(setErrorMsg('获取订单信息失败...'));
	    	}
	    	else{
	    		return res.json();
	    	}
	    }).
	    then(listData=>{
	    	dispatch(setAJdata(helper.AJ(listData)));
	    }).
	    catch(err => {
	      dispatch(setErrorMsg('加载订单信息失败...'));
	    });
    }
exports.AJDelete = () => (dispatch, getStates) => 
    { 
    	//console.log(getStates());
    	dispatch(deleteAJdata('all'));
    	
    };