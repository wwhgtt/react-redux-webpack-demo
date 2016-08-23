const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setBg = createAction('GET_BG', act => act);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setShopList=createAction('SET_SHOP_LIST', data => data);

const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');

//let url = '';
//url = `${config.takeawayMenuAPI}?shopId=810005865&type=WM`;    /*门店号参数*/


exports.getBg = (id) => (dispatch, getStates) => 
    fetch("http://testweixin.shishike.com/brand/index.json?shopId=810005865").
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取背景失败...'));
      }
      return res.json();
    }).
    then(menuData => {
      //console.log("123",menuData)
      dispatch(setBg(menuData.data));
    }).
    catch(err => {
      dispatch(setErrorMsg('获取背景失败...'));
    });

exports.getShopList=()=>(dispatch,getStates)=>
    fetch("http://testweixin.shishike.com/shop/brandShopList.json?brandId=2479").
    then(res=>{
    	if(res && !res.msg){
    		return res.json();
    	}
    	else{
    		dispatch(setErrorMsg("获取门店列表失败！！"));
    	}
    }).
    then(shopList=>{
    	dispatch(setShopList(shopList.data));
    })
