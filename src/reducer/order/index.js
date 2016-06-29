const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    areaList:[],
    tableList:[],
    timeTable:{},
    customerProps:{},
    commercialProps:{},
    serviceProps:{
      isPickupFromFrontDesk:'',
      tableProps:{
        tableArea:'',
        tableId:'',
      },
      payMethod:'',
    },
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      return state.set('areaList', payload.areaList)
                  .set('tableList', payload.tableList)
                  .set('timeTable', payload.timeJson)
                  .set('customerProps', Immutable.from({ name:payload.member.name, mobile:payload.member.mobile,
                    sex:payload.member.sex, isMember:payload.isMember, customerCount:1 }))
                  .set('commercialProps', Immutable.from({ name:payload.commercialName, integral:payload.integral,
                        commercialLogo:payload.commercialLogo, pickupPayType:payload.pickupPayType,
                        totablePayType:payload.totablePayType }))
                  .setIn(['serviceProps', 'payMethod'], payload.diningForm === 0 ?
                  [].concat.apply([], [Immutable.from({ name:'货到付款', isChecked:true, key:'offline', id:1 })])
                  :
                  [].concat.apply([], [Immutable.from({ name:'在线支付', isChecked:true, key:'online', id:0 }),
                  Immutable.from({ name:'货到付款', isChecked:false, key:'offline', id:1 })]))
                  .setIn(['serviceProps', 'isPickupFromFrontDesk'], payload.serviceApproach.indexOf('pickup') !== -1 ?
                        Immutable.from({ name:'前台取餐', isChecked:true, key:'pickup', id:1 }) : undefined);
    }
    default:
      return state;
  }
};
