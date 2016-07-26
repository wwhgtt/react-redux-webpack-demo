const _findIndex = require('lodash.findindex');
const Immutable = require('seamless-immutable');
const helper = require('../../helper/dish-hepler');
module.exports = function (
  state = Immutable.from({
    activeDishTypeId:-1,
    dishTypesData:[],
    dishesData:[],
    dishDetailData: undefined,
    takeawayServiceProps:undefined,
    dishBoxChargeInfo:null,
  }),
  action
) {
  const { type, payload } = action;
  let dishIdx;
  let orderIdx;
  let newState;
  switch (type) {
    case 'SET_MENU_DATA':
      return state.setIn(['dishTypesData'], payload.dishTypeList)
      .setIn(['dishesData'], payload.dishList)
      .setIn(
        ['activeDishTypeId'],
        payload.dishTypeList && payload.dishTypeList.length ?
        payload.dishTypeList[0].id
        :
        -1)
      .set('dishBoxChargeInfo', helper.getUrlParam('type') === 'WM' && payload.extraCharge ? payload.extraCharge : null)
      .setIn(['openTimeList'], payload.openTimeList)
      .setIn(['sendTimeList'], payload.sendTimeList);
    case 'ACTIVE_DISH_TYPE':
      return state.setIn(['activeDishTypeId'], payload);
    case 'SHOW_DISH_DETAIL':
      return state.setIn(['dishDetailData'], payload);
    case 'SHOW_DISH_DESC':
      return state.setIn(['dishDescData'], payload);
    case 'REMOVE_ALL_ORDERS':
      return state.update(
        'dishesData',
        dishes => dishes.flatMap(
          dish => dish.set('order', undefined)
        )
      );
    case 'SET_TAKEAWAY_SERVICE_PROPS':
      return state.set('takeawayServiceProps', payload);
    case 'ORDER_DISH':
      dishIdx = _findIndex(state.dishesData, { id: payload[0].id });
      if (helper.isSingleDishWithoutProps(state.dishesData[dishIdx])) {
        // for single dish without props;
        newState = state.setIn(['dishesData', dishIdx, 'order'], helper.getNewCountOfDish(state.dishesData[dishIdx], payload[1]));
      } else {
        // for single dish with props
        if (helper.isGroupDish(state.dishesData[dishIdx])) {
          orderIdx = _findIndex(
            state.dishesData[dishIdx].order === undefined ? [] : state.dishesData[dishIdx].order,
            { groups:payload[0].order[0].groups }
          );
        } else {
          orderIdx = _findIndex(
            state.dishesData[dishIdx].order === undefined ? [] : state.dishesData[dishIdx].order,
            { dishPropertyTypeInfos:payload[0].order[0].dishPropertyTypeInfos }
          );
        }
        if (orderIdx !== -1) {
          // if find the order with same props, just add the count of the exsited order;
          newState = state.setIn(
            ['dishesData', dishIdx, 'order', orderIdx, 'count'],
            state.dishesData[dishIdx].order[orderIdx].count + payload[0].order[0].count
          );
          if (newState.dishesData[dishIdx].order[orderIdx].count === 0) {
            // if order's count is 0, remove it.
            newState = newState.updateIn(
              ['dishesData', dishIdx, 'order'],
              order => order.flatMap((eachOrder, idx) => orderIdx === idx ? [] : eachOrder)
            );
          }
        } else {
          // if cannot find the order with same props,add it as new order;
          newState = state.updateIn(
            ['dishesData', dishIdx, 'order'],
            order => order === undefined ? payload[0].order : order.concat(payload[0].order)
          );
        }
      }
      return newState;
    case 'SET_DISCOUNT_TO_ORDER':
      return state.update(
          'dishesData', dishesData => dishesData.flatMap(
            dishData => dishData.set(
                'isMember', _findIndex(payload.dishList, { dishId:dishData.id }) !== -1
              ).set(
                'memberPrice', _findIndex(payload.dishList, { dishId:dishData.id }) !== -1 ?
                  payload.dishList[_findIndex(payload.dishList, { dishId:dishData.id })].value
                  :
                  false
              )
          )
      );
    default:
      return state;
  }
};
