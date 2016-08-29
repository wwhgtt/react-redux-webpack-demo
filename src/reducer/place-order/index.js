const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
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
    case 'SET_ORDER_PROPS':
      if (payload.id === 'table') {
        return state
          .updateIn(
            ['tableProps', 'areas'],
            areas => areas.flatMap(
              area => area.id === payload.area.id ? area.set('isChecked', true) : area.set('isChecked', false)
            )
          )
          .updateIn(
            ['tableProps', 'tables'],
            tables => tables.flatMap(
              table => table.id === payload.table.id ? table.set('isChecked', true) : table.set('isChecked', false)
            )
          );
      } else if (payload.id === 'takeaway-time') {
        return state
          .setIn(
            ['timeProps', 'selectedDateTime', 'date'], payload.dateTime.id
          )
          .setIn(
            ['timeProps', 'selectedDateTime', 'time'],
            _find(payload.dateTime.times, { isChecked:true }).id
          );
      }
      break;
    default:
  }
  return state;
};
