const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
const helper = require('../../helper/place-order-helper.js');
const getDefaultSelectedDateTime = require('../../helper/order-helper.js').getDefaultSelectedDateTime;
module.exports = function (
  state = Immutable.from({
    commercialProps:{
      shopLogo:null,
      shopName:null,
    },
    childView:null,
    timeProps:{
      selectedDateTime:{ date:'', time:'' },
      timeTable:null,
    },
    tableProps:{
      areas:[],
      tables:[],
    },
    errorMessage:null,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_COMMERCIAL_PROPS':
      return state
        .setIn(['commercialProps', 'shopLogo'], payload.shopLogo)
        .setIn(['commercialProps', 'shopName'], payload.shopName)
        .setIn(['timeProps', 'selectedDateTime'],
          Immutable.from(
            getDefaultSelectedDateTime(payload.timeJson, payload.defaultSelectedDateTime)
          )
        )
        .setIn(['timeProps', 'timeTable'], payload.timeJson);
    case 'SET_TABLE_PROPS':
      return state
        .setIn(['tableProps', 'areas'], helper.initializeTableProps(payload.areaList)).areas
        .setIn(['tableProps', 'tables'], helper.initializeTableProps(payload.areaList)).tables;
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
