const _findIndex = require('lodash.findindex');
const _has = require('lodash').has;
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
    normalDiscountProps:null,
    errorMessage:null,
  }),
  action
) {
  const { type, payload } = action;
  let dishIdx;
  let orderIdx;
  let newState;

  const getFirstValidDishTypeId = (_payload) => {
    const dishTypeList = _payload.dishTypeList || [];
    const dishList = _payload.dishList || [];
    let i = 0;
    while (i < dishTypeList.length) {
      const dishTypeDishes = dishList.filter(dish => dishTypeList[i].dishIds && dishTypeList[i].dishIds.indexOf(dish.id) > -1);
      const isNotEmpty = dishTypeDishes.some(dish => dish.currRemainTotal !== 0);
      if (isNotEmpty) return dishTypeList[i].id;
      i++;
    }
    return -1;
  };

  switch (type) {
    case 'SET_MENU_DATA':
      return state.setIn(['dishTypesData'], payload.dishTypeList)
      .setIn(['dishesData'], payload.dishList)
      .setIn(['activeDishTypeId'], getFirstValidDishTypeId(payload))
      .set('dishBoxChargeInfo', helper.getUrlParam('type') === 'WM' && payload.extraCharge ? payload.extraCharge : null)
      .setIn(['openTimeList'], payload.openTimeList)
      // equal to 0, means accepting takeaway 24 hours, 2016-07-30 16:46:31 后端调整为bool型
      .setIn(['isAcceptTakeaway'], payload.isAcceptTakeaway === true)
      .set('normalDiscountProps', payload.discountInfo);
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
            dishData => {
              let haveDiscountPropsData = null;
              if (payload && payload.dishList && payload.dishList.length && payload.type) {
                haveDiscountPropsData = payload;
              } else if (state.normalDiscountProps && state.normalDiscountProps.dishList
                && state.normalDiscountProps.dishList.length && state.normalDiscountProps.type) {
                haveDiscountPropsData = state.normalDiscountProps;
              } else {
                return dishData
                  .set('isMember', false)
                  .set('memberPrice', false)
                  .set('discountType', false)
                  .set('discountLevel', false);
              }
              return dishData
                  .set(
                    'isMember', _findIndex(haveDiscountPropsData.dishList, { dishId:dishData.id }) !== -1
                  )
                  .set(
                    'memberPrice', _findIndex(haveDiscountPropsData.dishList, { dishId:dishData.id }) !== -1 ?
                      haveDiscountPropsData.dishList[_findIndex(haveDiscountPropsData.dishList, { dishId:dishData.id })].value
                      :
                      false
                  )
                  .set('discountType', haveDiscountPropsData.type)
                  .set('discountLevel', haveDiscountPropsData.levelName)
                  .set('isUserMember', _has(haveDiscountPropsData, 'isMember') ? haveDiscountPropsData.isMember : true);
            }
          )
      );
    case 'SET_ERROR_MSG':
      return state.set(
        'errorMessage', payload
      );
    default:
      return state;
  }
};
