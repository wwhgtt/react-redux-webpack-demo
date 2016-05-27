const _findIndex = require('lodash.findindex');
module.exports = function (state = { activeDishTypeId:-1, dishTypesData:[], dishesData:[] }, action) {
  const { type, payload } = action;
  let targetDishIdx;
  let targetDish;
  switch (type) {
    case 'SET_MENU_DATA':
      return Object.assign({}, state, { dishTypesData:payload.dishTypeList, dishesData: payload.dishList });
    case 'ACTIVE_DISH_TYPE':
      return Object.assign({}, state, { activeDishTypeId:payload[1] });
    case 'ORDER_DISH':
      targetDishIdx = _findIndex(state.dishesData, payload.dishData.id);
      state.dishesData[targetDishIdx] = targetDish = Object.assign({}, state.dishesData[targetDishIdx]);
      if (targetDish.dishPropertyTypeInfos || targetDish.dishPropertyTypeInfos && typeof(type.action) !== 'string') {
        // TODO,For Complex Dishes
      } else {
        targetDish.order = targetDish.order !== undefined ? targetDish.order + 1 : 0;
      }
      return Object.assign({}, state, { dishesData:state.dishesData });
    default:
      return state;
  }
};
