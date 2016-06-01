const _findIndex = require('lodash.findindex');
const helper = require('../../helper/dish-hepler');
module.exports = function (
  state = { activeDishTypeId:-1, dishTypesData:[], dishesData:[], dishDetailData: undefined },
  action
) {
  const { type, payload } = action;
  let newDishIdx;
  let newDishData;
  let newDishsData;
  let newDishOrderIdx;
  switch (type) {
    case 'SET_MENU_DATA':
      return Object.assign({}, state, { dishTypesData:payload.dishTypeList, dishesData: payload.dishList });
    case 'ACTIVE_DISH_TYPE':
      return Object.assign({}, state, { activeDishTypeId:payload });
    case 'SHOW_DISH_DETAIL':
      return Object.assign({}, state, { dishDetailData:payload });
    case 'ORDER_DISH':
      newDishIdx = _findIndex(state.dishesData, { id: payload[0].id });
      newDishsData = state.dishesData.slice();
      newDishsData[newDishIdx] = newDishData = Object.assign({}, state.dishesData[newDishIdx]);
      if (helper.isSingleDishWithoutProps(newDishData)) {
        // for single dish without props;
        if (newDishData.order === undefined) {
          newDishData.order = newDishData.dishIncreaseUnit;
        } else if (newDishData.order + payload[1] < newDishData.dishIncreaseUnit) {
          newDishData.order = undefined;
        } else {
          newDishData.order = newDishData.order + payload[1];
        }
      } else if (helper.isGroupDish(newDishData)) {
        // todo for group dish
      } else {
        // for single dish with props
        newDishData.order = newDishData.order === undefined ? [] : newDishData.order;
        newDishOrderIdx = _findIndex(newDishData.order, { dishPropertyTypeInfos:payload[0].order[0].dishPropertyTypeInfos });
        if (newDishOrderIdx !== -1) {
          // if find the order with same props, just add the count of the exsited order;
          newDishData.order[newDishOrderIdx] = Object.assign(
            {}, newDishData.order[newDishOrderIdx],
            { count: newDishData.order[newDishOrderIdx].count + payload[0].order[0].count });
        } else {
          // if cannot find the order with same props,add it as new order;
          newDishData.order.push(payload[0].order[0]);
        }
      }
      return Object.assign({}, state, { dishesData:newDishsData });
    default:
      return state;
  }
};
