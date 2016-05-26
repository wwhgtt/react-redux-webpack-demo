
module.exports = function (state = { activeDishTypeId:-1, dishTypesData:[], dishesData:[] }, action) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_MENU_DATA':
      return Object.assign({}, state, { dishTypesData:payload.dishTypeList, dishesData: payload.dishList });
    case 'ACTIVE_DISH_TYPE':
      return Object.assign({}, state, { activeDishTypeId:payload[1] });
    default:
      return state;
  }
};
