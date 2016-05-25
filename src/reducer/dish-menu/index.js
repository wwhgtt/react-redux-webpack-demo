module.exports = function (state = { activeDishTypeIdx:-1, dishTypesData:[], dishesData:[] }, action) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_MENU_DATA':
      return Object.assign({}, state, { dishTypesData:payload.dishTypeList, dishesData: payload.dishList });
    case 'ACTIVE_DISH_TYPE':
      return Object.assign({}, state, { activeDishTypeIdx:payload[2] });
    default:
      return state;
  }
};
