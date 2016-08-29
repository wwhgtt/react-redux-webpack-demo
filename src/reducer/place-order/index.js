const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    commercialProps:{
      logo:null,
      name:null,
    },
    childView:null,
    timeProps:null,
    tableProps:null,
    errorMessage:null,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case '':
      return state;
    case 'SET_ERROR_MSG':
      return state.set('errorMessage', payload);
    case 'SET_CHILDVIEW':
      if (payload === '#table-select') {
        return state.set('childView', 'table-select');
      } else if (payload === '#time-select') {
        return state.set('childView', 'time-select');
      }
      return state.set('childView', '');
    default:
  }
  return state;
};
