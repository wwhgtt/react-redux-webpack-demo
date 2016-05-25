module.exports = function (state = { dishTypesData:[], dishesData:[] }, action) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_MENU_DATA':
      return { dishTypesData:payload.dishTypeList, dishesData: payload.dishList };
    default:
      return state;
  }
};
