const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    customerProps: { sex: '1', name: '徐海疆' ,age:'26',label:'煞笔' },
    list:[],
    errorMessage: "获取数据错误！！"
  }),
  action
) {
	
  const { type, payload } = action;

  switch (type) {
    case 'GET_DATA':
      return state.set('list', payload || '');
      //return state.set('childView', payload || '');
    case 'SET_ERROR_MSG':
      alert(payload);
      //return state.set('childView', payload || '');
    case 'delete_DATA':
      if(payload==='all'){
      	
      	return state.set('list', []);
      }
      else{
      	return;
      }
      //return state.set('childView', payload || '');
    default:
  }
  return state;
};
