const Immutable = require('seamless-immutable');
const combineReducers = require('redux').combineReducers;
const initializeAreaAdnTableProps = require('../../helper/order-helper').initializeAreaAdnTableProps;
const dishMenu = require('../../reducer/dish-menu/index.js');

const orderTSCart = (
  state = Immutable.from({
    wxName:'',
    member: {
      name: '',
      mobile: '',
      sex: '',
      loginType: 1,
      iconUri: '',
    },
    peopleCount: 1,
    memo: '',
    mainOrderId: -1,
    commercialName: '',
    commercialLogo: null,
    wxAuthSuccess: false,
    serviceApproach: 'pickup,totable',
    diningForm: 1,
    wxAuthInfo: null,
    shopSetting: null,
    tableProps: {
      areaList: null,
      tableList: null,
      selectedTableId: null,
    },
    addItemStatus: 0,
    tradeNo: '',
    tableName: '',
  }),
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case 'INIT_ORDER_INFO':
      return state.merge(payload)
             .set('tableProps', initializeAreaAdnTableProps(payload.areaList, payload.tableList))
             .set('wxName', payload.name || '');
    case 'SET_ORDER_INFO':
      return state.merge(payload);
    case 'SELECT_TABLE':
      return state
        .setIn(['tableProps', 'selectedTableId'], payload.table.id)
        .updateIn(['tableProps', 'areaList'], areas => areas.map(area => area.set('isChecked', area.id === payload.area.id)))
        .updateIn(['tableProps', 'tableList'], tables => tables.map(table => table.set('isChecked', table.id === payload.table.id)));
    default:
      break;
  }
  return state;
};

module.exports = combineReducers({ dishMenu, orderTSCart });
