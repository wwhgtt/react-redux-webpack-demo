const _findIndex = require('lodash.findindex');
const Immutable = require('seamless-immutable');
const helper = require('../../helper/dish-hepler');
module.exports = function (
  state = Immutable.from({ activeDishTypeId:-1, dishTypesData:[], dishesData:[], dishDetailData: undefined }),
  action
) {
  const { type, payload } = action;
  let dishIdx;
  let orderIdx;
  let newState;
  // let newDishData;
  // let newDishsData;
  // let newDishOrderIdx;
  switch (type) {
    case 'SET_MENU_DATA':
      return state.setIn(['dishTypesData'], payload.dishTypeList).setIn(['dishesData'], payload.dishList);
    case 'ACTIVE_DISH_TYPE':
      return state.setIn(['activeDishTypeId'], payload);
    case 'SHOW_DISH_DETAIL':
      return state.setIn(['dishDetailData'], payload);
    case 'REMOVE_ALL_DISHES':
      return {};
    case 'ORDER_DISH':
      dishIdx = _findIndex(state.dishesData, { id: payload[0].id });
      // newDishsData = state.dishesData.slice();
      // newDishsData[dishIdx] = newDishData = Object.assign({}, state.dishesData[dishIdx]);
      if (helper.isSingleDishWithoutProps(state.dishesData[dishIdx])) {
        // for single dish without props;
        newState = state.setIn(['dishesData', dishIdx, 'order'], helper.getNewCountOfDish(state.dishesData[dishIdx], payload[1]));
        // newDishData.order = helper.getNewCountOfDish(newDishData, payload[1]);
      } else if (helper.isGroupDish(state.dishesData[dishIdx])) {
        // todo for group dish
      } else {
        // for single dish with props
        // newDishData.order = newDishData.order === undefined ? [] : newDishData.order;
        orderIdx = _findIndex(
          state.dishesData[dishIdx].order === undefined ? [] : state.dishesData[dishIdx].order,
          { dishPropertyTypeInfos:payload[0].order[0].dishPropertyTypeInfos }
        );
        if (orderIdx !== -1) {
          // if find the order with same props, just add the count of the exsited order;
          newState = state.setIn(
            ['dishesData', dishIdx, 'order', orderIdx, 'count'],
            state.dishesData[dishIdx].order[orderIdx].count + payload[0].order[0].count
          );
          // newDishData.order[orderIdx] = Object.assign(
          //   {}, newDishData.order[orderIdx],
          //   { count: newDishData.order[orderIdx].count + payload[0].order[0].count });
          if (newState.dishesData[dishIdx].order[orderIdx].count === 0) {
            // if order's count is 0, remove it.
            newState = newState.updateIn(
              ['dishesData', dishIdx, 'order'],
              order => order.flatMap((eachOrder, idx) => orderIdx === idx ? [] : eachOrder)
            );
            // newDishData.order.splice(orderIdx, 1);
          }
        } else {
          // if cannot find the order with same props,add it as new order;
          newState = state.updateIn(
            ['dishesData', dishIdx, 'order'],
            order => order === undefined ? Immutable.from(payload[0].order) : order.concat(payload[0].order)
          );
          // newDishData.order.push(payload[0].order[0]);
        }
      }
      return newState;
      // return Object.assign({}, state, { dishesData:newDishsData });
    default:
      return state;
  }
};
