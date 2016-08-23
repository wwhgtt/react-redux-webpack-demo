const Immutable = require('seamless-immutable');
const helper = require('../../helper/dish-hepler');
module.exports = function (
  state = Immutable.from({
    baseInfo: { sex: '1', name: '徐海疆' ,age:'26',label:'煞笔' },
    list:[],
    errorMessage: "获取数据错误！！",
    BG:"",
    nameInfo:{},
    menuList:[],
    shop_list:[]
  }),
  action
) {
	
  const { type, payload } = action;

  switch (type) {
    case 'GET_BG':
     
      return state.set('BG', helper.edit(payload).bg() || '').set('nameInfo', payload.brand|| '').set('menuList', payload.menuList|| '');
    case 'SET_SHOP_LIST':
      return state.set('shop_list', payload || '');
      //return state.set('childView', payload || '');
    default:
  }
  return state;
};
