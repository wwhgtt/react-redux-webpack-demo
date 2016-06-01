const _findIndex = require('lodash.findindex');
module.exports = function (state = { activeDishTypeId:-1, dishTypesData:[], dishesData:[], dishDetailData: undefined }, action) {
  const { type, payload } = action;
  let newDishIdx;
  let newDishData;
  let newDishsData;
  switch (type) {
    case 'SET_MENU_DATA':
      return Object.assign({}, state, { dishTypesData:payload.dishTypeList, dishesData: payload.dishList });
    case 'ACTIVE_DISH_TYPE':
      return Object.assign({}, state, { activeDishTypeId:payload[1] });
    case 'SHOW_DISH_DETAIL':
      return Object.assign({}, state, { dishDetailData:payload });
    case 'ORDER_DISH':
      newDishIdx = _findIndex(state.dishesData, { id: payload[0].id });
      newDishsData = state.dishesData.slice();
      newDishsData[newDishIdx] = newDishData = Object.assign({}, state.dishesData[newDishIdx]);
      if (false) {
        // TODO,For Complex Dishes
      } else {
        if (newDishData.order === undefined) {
          newDishData.order = newDishData.dishIncreaseUnit;
        } else if (newDishData.order + payload[1] < newDishData.dishIncreaseUnit) {
          newDishData.order = undefined;
        } else {
          newDishData.order = newDishData.order + payload[1];
        }
      }
      return Object.assign({}, state, { dishesData:newDishsData });
    default:
      return state;
  }
};
