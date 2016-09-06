const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
const helper = require('../../helper/place-order-helper.js');
const getDefaultSelectedDateTime = require('../../helper/order-helper.js').getDefaultSelectedDateTime;
module.exports = function (
  state = Immutable.from({
    commercialProps:{
      shopLogo:null,
      shopName:null,
      openStatus:null,
      hasPeriodConfiguer:true,
      firstTime:null,
    },
    childView:null,
    timeProps:{
      selectedDateTime:{ date:'', time:'' },
      timeTable:null,
    },
    tableProps:{
      areas:[],
      tables:[],
      selectedTableId:null,
    },
    customerProps:{
      name:null,
      sex:null,
      mobile:null,
    },
    dinePersonCount:4,
    errorMessage:null,
    shuoldPhoneValidateShow:false,
    phoneValidateCode:'',
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_COMMERCIAL_PROPS':
      return state
        .setIn(['commercialProps', 'shopLogo'], payload.shopLogo)
        .setIn(['commercialProps', 'shopName'], payload.shopName)
        .setIn(['commercialProps', 'openStatus'], payload.openStatus)
        .setIn(['commercialProps', 'hasPeriodConfiguer'], payload.hasPeriodConfiguer)
        .setIn(['commercialProps', 'firstTime'], payload.firstTime)
        .setIn(['timeProps', 'selectedDateTime'],
          Immutable.from(
            getDefaultSelectedDateTime(payload.timeJson, payload.defaultSelectedDateTime)
          )
        )
        .setIn(['timeProps', 'timeTable'], payload.timeJson)
        .setIn(['customerProps', 'name'], payload.m.name)
        .setIn(['customerProps', 'mobile'], payload.m.mobile)
        .setIn(['customerProps', 'sex'], payload.m.sex);
    case 'SET_TABLE_PROPS':
      return state
        .setIn(['tableProps', 'areas'], Immutable.from(helper.initializeTableProps(payload.areaList).areas))
        .setIn(['tableProps', 'tables'], Immutable.from(helper.initializeTableProps(payload.areaList).tables));
    case 'SET_CUSTOMER_PROPS':
      return state
        .setIn(
          ['customerProps', 'name'], payload.name
        )
        .setIn([
          'customerProps', 'mobile'], payload.mobile
        )
        .setIn(
          ['customerProps', 'sex'], payload.sex
        );
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
      } else if (payload.id === 'dine-person-count') {
        return state.set('dinePersonCount', payload.newCount);
      }
      break;
    case 'SET_TABLE_AVALIABLE':
      if (payload.status !== 0) {
        return state.set('errorMessage', '预定桌台失败');
      }
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
        )
        .setIn(['tableProps', 'selectedTableId'], payload.tableId);
    case 'SET_PHONE_VALIDATE_PROPS':
      return state.set('shuoldPhoneValidateShow', payload);
    case 'SET_PHONE_VALIDATE_CODE':
      return state.set('phoneValidateCode', payload);
    default:
  }
  return state;
};
